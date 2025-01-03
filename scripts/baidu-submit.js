const https = require('https');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const { exec } = require('child_process');

const BAIDU_TOKEN = 'uGhrWHrXoMy4Cd7C';
const SITE_HOST = 'https://rifx.online';
const BATCH_SIZE = 2000; // 每批提交的URL数量限制

async function fetchSitemap(host) {
  return new Promise((resolve, reject) => {
    https.get(`${host}/sitemap-0.xml`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function submitUrlBatch(urls, batchIndex) {
  return new Promise((resolve, reject) => {
    // 创建临时urls文件
    const tempFile = path.join(__dirname, `urls_batch_${batchIndex}.txt`);
    fs.writeFileSync(tempFile, urls.join('\n'));

    // 构建curl命令
    const curlCommand = `curl -H 'Content-Type:text/plain' --data-binary @${tempFile} "http://data.zz.baidu.com/urls?site=${SITE_HOST}&token=${BAIDU_TOKEN}"`;

    // 执行curl命令
    exec(curlCommand, (error, stdout, stderr) => {
      // 删除临时文件
      fs.unlinkSync(tempFile);

      if (error) {
        reject(error);
        return;
      }

      try {
        const response = JSON.parse(stdout);
        resolve(response);
      } catch (e) {
        resolve(stdout);
      }
    });
  });
}

async function submitToBaidu() {
  try {
    // 获取sitemap内容
    const sitemapContent = await fetchSitemap(SITE_HOST);
    
    // 解析XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true
    });
    const result = parser.parse(sitemapContent);
    const allUrls = result.urlset.url.map(url => url.loc);

    console.log(`总共发现 ${allUrls.length} 个URL`);

    // 分批处理URL
    const batches = [];
    for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
      batches.push(allUrls.slice(i, i + BATCH_SIZE));
    }

    console.log(`将分 ${batches.length} 批提交`);

    // 逐批提交
    let totalSuccess = 0;
    let remainQuota = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n提交第 ${i + 1}/${batches.length} 批，包含 ${batch.length} 个URL`);
      
      try {
        const response = await submitUrlBatch(batch, i);
        
        if (typeof response === 'object') {
          console.log(`第 ${i + 1} 批提交成功！`);
          console.log(`成功推送: ${response.success} 条`);
          console.log(`剩余配额: ${response.remain} 条`);
          
          totalSuccess += response.success || 0;
          remainQuota = response.remain;

          if (response.not_same_site && response.not_same_site.length > 0) {
            console.log('非本站URL:', response.not_same_site);
          }
          if (response.not_valid && response.not_valid.length > 0) {
            console.log('无效的URL:', response.not_valid);
          }
        } else {
          console.log(`第 ${i + 1} 批响应:`, response);
        }

        // 添加延迟，避免请求过于频繁
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`第 ${i + 1} 批提交失败:`, error);
      }
    }

    console.log('\n提交完成！');
    console.log(`总成功提交: ${totalSuccess} 条`);
    console.log(`剩余配额: ${remainQuota} 条`);

  } catch (error) {
    console.error('脚本执行失败:', error);
  }
}

// 执行提交
submitToBaidu(); 