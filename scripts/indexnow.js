const { XMLParser } = require('fast-xml-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

const INDEXNOW_KEY = 'f752e4d6552a44d393697eb55bf849c1';

async function fetchSitemap(host) {
  return new Promise((resolve, reject) => {
    https.get(`https://${host}/sitemap-0.xml`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function submitToIndexNow() {
  try {
    const host = 'rifx.online';
    const sitemapContent = await fetchSitemap(host);
    
    // 解析 XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true
    });
    const result = parser.parse(sitemapContent);
    const urls = result.urlset.url.map(url => url.loc);
    
    // 准备 IndexNow 请求数据
    const indexNowData = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
      urlList: urls
    };

    // 发送到 IndexNow API
    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`Successfully submitted ${urls.length} URLs`);
          console.log('URLs:', urls);
        } else {
          console.error(`Failed with status ${res.statusCode}:`, data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error submitting URLs:', error);
    });

    req.write(JSON.stringify(indexNowData));
    req.end();

  } catch (error) {
    console.error('Failed to submit sitemap:', error);
  }
}

submitToIndexNow(); 