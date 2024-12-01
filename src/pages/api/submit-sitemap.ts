import type { APIRoute } from 'astro';
import { XMLParser } from 'fast-xml-parser';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface SitemapData {
  urlset: {
    url: SitemapUrl[];
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 获取网站域名
    const host = new URL(request.url).host;
    const INDEXNOW_KEY = 'f752e4d6552a44d393697eb55bf849c1';
    
    // 获取 sitemap 内容
    const sitemapUrl = `https://${host}/sitemap-0.xml`;
    const sitemapResponse = await fetch(sitemapUrl);
    const sitemapContent = await sitemapResponse.text();
    
    // 解析 XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true
    });
    const result = parser.parse(sitemapContent) as SitemapData;
    const urls = result.urlset.url.map(url => url.loc);
    
    // 准备 IndexNow 请求数据
    const indexNowData = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
      urlList: urls
    };

    // 发送到 IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indexNowData)
    });

    if (!response.ok) {
      throw new Error(`IndexNow API responded with ${response.status}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully submitted ${urls.length} URLs`,
      urls
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 