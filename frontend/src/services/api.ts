/**
 * API 服务基础配置
 */

import { getAuthHeaders } from '../utils/api';

const API_BASE_URL = '/api';

/**
 * 处理 API 响应错误
 */
async function handleResponseError(response: Response): Promise<never> {
  let errorData: { message: string } = { message: '请求失败' };

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    }
  } catch {
    // 忽略解析错误，使用默认错误信息
  }

  throw new Error('message' in errorData ? errorData.message : `HTTP error! status: ${response.status}`);
}

/**
 * 带认证的 fetch 包装器
 * 自动添加 Authorization 头
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

export const api = {
  // 示例 API 方法（实际使用中请使用具体的 api 服务）
  getFeeds: () => fetchApi<unknown[]>('/feeds'),
  getFeedItems: (feedId: string) => fetchApi<unknown[]>(`/feeds/${feedId}/items`),
};
