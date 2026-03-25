/**
 * 搜索 API 服务
 *
 * 提供文章搜索、关键词高亮等功能
 */

import type { SearchParams, SearchResponse } from '../types';
import { authFetch, getAuthHeaders, handleResponseError } from '../utils/api';

const API_BASE_URL = '/api';

/**
 * 搜索文章
 *
 * @param params 搜索参数
 * @returns 搜索结果响应
 * @throws 搜索失败时抛出错误
 */
export async function searchArticles(params: SearchParams = {}): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set('q', params.query);
  if (params.feedId) searchParams.set('feedId', params.feedId);
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.pageSize !== undefined) searchParams.set('size', String(params.pageSize));

  const queryString = searchParams.toString();
  const url = queryString ? `${API_BASE_URL}/articles/search?${queryString}` : `${API_BASE_URL}/articles/search`;

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

export const searchApi = {
  searchArticles,
};
