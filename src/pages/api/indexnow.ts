import type { APIRoute } from 'astro';

interface IndexNowBody {
  host: string;
  urlList: string[];
}

export const POST: APIRoute = async ({ request }) => {
  const INDEXNOW_KEY = 'f752e4d6552a44d393697eb55bf849c1';
  
  try {
    const body = await request.json() as IndexNowBody;
    
    // 向 IndexNow API 提交 URL
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host: body.host,
        key: INDEXNOW_KEY,
        keyLocation: `https://${body.host}/${INDEXNOW_KEY}.txt`,
        urlList: body.urlList
      })
    });

    if (!response.ok) {
      throw new Error(`IndexNow API responded with ${response.status}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'URLs submitted successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};