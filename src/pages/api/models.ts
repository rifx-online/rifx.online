import type { APIRoute } from 'astro';
import { FurzSDK } from '@hypier/furz-sdk';

export const GET: APIRoute = async ({ request, locals }) => {
  const db = locals.runtime.env.DB;
  console.log('DB object:', db); // 添加这行来检查 db 对象

  const furz = new FurzSDK(db);

  const url = new URL(request.url);
  const query = url.searchParams.get('query') || undefined;
  const sortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = 20;

  try {
    const { total, items: models } = await furz.publicModelService.search({
      query,
      sortBy: 'created',
      sortOrder,
      limit: pageSize,
      offset: (page - 1) * pageSize
    });

    const totalPages = Math.ceil(total / pageSize);

    return new Response(JSON.stringify({ models, totalPages, currentPage: page }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取模型失败, ' + error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export {};