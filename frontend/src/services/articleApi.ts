/**
 * 文章 API 服务
 *
 * 提供文章列表获取、详情获取、标记已读/星标等操作
 */

import type {
  Article,
  ArticleListParams,
  ArticleListResponse,
  BatchOperationParams,
} from '../types';
import { authFetch, getAuthHeaders, handleResponseError } from '../utils/api';

const API_BASE_URL = '/api';

/**
 * 获取文章列表
 *
 * @param params 查询参数
 * @returns 文章列表响应
 * @throws 获取失败时抛出错误
 */
export async function getArticles(params: ArticleListParams = {}): Promise<ArticleListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.pageSize !== undefined) searchParams.set('size', String(params.pageSize));
  if (params.feedId) searchParams.set('feedId', params.feedId);
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  // 前端 isRead=true 表示已读，后端 unread=true 表示未读，需要取反
  if (params.isRead !== undefined) searchParams.set('isRead', String(params.isRead));
  if (params.isStarred !== undefined) searchParams.set('isStarred', String(params.isStarred));
  if (params.search) searchParams.set('search', params.search);
  if (params.orderBy) searchParams.set('orderBy', params.orderBy);
  if (params.orderDirection) searchParams.set('orderDirection', params.orderDirection);

  const queryString = searchParams.toString();
  const url = queryString ? `${API_BASE_URL}/articles?${queryString}` : `${API_BASE_URL}/articles`;

  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 获取文章详情
 *
 * @param id 文章 ID
 * @returns 文章详情
 * @throws 获取失败时抛出错误
 */
export async function getArticle(id: string): Promise<Article> {
  const response = await authFetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('文章不存在');
    }
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 标记文章为已读/未读
 *
 * @param id 文章 ID
 * @param read 是否已读
 * @returns 操作结果
 * @throws 操作失败时抛出错误
 */
export async function markAsRead(id: string, read: boolean): Promise<{ success: boolean }> {
  const response = await authFetch(`${API_BASE_URL}/articles/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ read }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('文章不存在');
    }
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 标记文章为星标/取消星标
 *
 * @param id 文章 ID
 * @param starred 是否星标
 * @returns 操作结果
 * @throws 操作失败时抛出错误
 */
export async function markAsStarred(id: string, starred: boolean): Promise<{ success: boolean }> {
  const response = await authFetch(`${API_BASE_URL}/articles/${id}/star`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ starred }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('文章不存在');
    }
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 批量标记文章为已读/未读
 *
 * @param params 批量操作参数
 * @returns 操作结果
 * @throws 操作失败时抛出错误
 */
export async function batchMarkAsRead(params: BatchOperationParams): Promise<number> {
  const response = await authFetch(`${API_BASE_URL}/articles/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 批量标记文章为星标/取消星标
 *
 * @param params 批量操作参数
 * @returns 操作结果
 * @throws 操作失败时抛出错误
 */
export async function batchMarkAsStarred(params: BatchOperationParams): Promise<number> {
  const response = await authFetch(`${API_BASE_URL}/articles/star`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 删除单篇文章
 *
 * @param id 文章 ID
 * @returns 操作结果
 * @throws 删除失败时抛出错误
 */
export async function deleteArticle(id: string): Promise<{ success: boolean }> {
  const response = await authFetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('文章不存在');
    }
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 批量删除文章
 *
 * @param params 批量删除参数（包含 ids 列表）
 * @returns 删除成功的数量
 * @throws 删除失败时抛出错误
 */
export async function batchDeleteArticles(params: { ids: string[] }): Promise<number> {
  const response = await authFetch(`${API_BASE_URL}/articles/batch`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

export const articleApi = {
  getArticles,
  getArticle,
  markAsRead,
  markAsStarred,
  batchMarkAsRead,
  batchMarkAsStarred,
  deleteArticle,
  batchDeleteArticles,
  getUnreadCount,
  getStarredCount,
};

/**
 * 获取未读文章数量
 *
 * @returns 未读文章数量
 * @throws 获取失败时抛出错误
 */
export async function getUnreadCount(): Promise<number> {
  const response = await authFetch(`${API_BASE_URL}/articles/unread/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 获取星标文章数量
 *
 * @returns 星标文章数量
 * @throws 获取失败时抛出错误
 */
export async function getStarredCount(): Promise<number> {
  const response = await authFetch(`${API_BASE_URL}/articles/starred/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}
