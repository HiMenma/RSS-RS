/**
 * API 工具函数
 * 提供通用的 API 请求处理方法，支持自动刷新 Token
 */

import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/authApi';
import type { ApiError } from '../types';

/**
 * 获取认证请求头
 */
export function getAuthHeaders(): HeadersInit {
  const accessToken = useAuthStore.getState().accessToken;
  return accessToken ? {
    'Authorization': `Bearer ${accessToken}`,
  } : {};
}

/**
 * 处理 API 响应错误
 */
export async function handleResponseError(response: Response): Promise<never> {
  let errorData: ApiError | { message: string } = { message: '请求失败' };

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    }
  } catch {
    // 忽略解析错误，使用默认错误信息
  }

  const errorMessage = 'message' in errorData ? errorData.message : `HTTP error! status: ${response.status}`;
  throw new Error(errorMessage);
}

/**
 * 带自动重试的 fetch 包装器
 * 当遇到 401 错误时，尝试刷新 Token 并重试
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { refreshToken, isTokenExpiring } = useAuthStore.getState();

  // 如果 Token 即将过期，先刷新 Token
  if (isTokenExpiring() && refreshToken) {
    try {
      const { setTokens } = useAuthStore.getState();
      const refreshResponse = await authApi.refreshToken(refreshToken);
      setTokens(refreshResponse.accessToken, refreshResponse.refreshToken, refreshResponse.expiresIn);
    } catch (error) {
      console.error('预刷新 Token 失败:', error);
      // 继续执行，让请求返回 401 后处理
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers as HeadersInit),
    },
  });

  // 如果是 401 错误，尝试刷新 Token
  if (response.status === 401) {
    const { refreshToken: currentRefreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (currentRefreshToken) {
      try {
        // 刷新 Token
        const refreshResponse = await authApi.refreshToken(currentRefreshToken);
        setTokens(refreshResponse.accessToken, refreshResponse.refreshToken, refreshResponse.expiresIn);

        // 使用新 Token 重试请求（确保 Authorization 头被正确设置）
        const retryOptions: RequestInit = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...(options.headers as HeadersInit),
          },
        };
        const retryResponse = await fetch(url, retryOptions);

        // 如果重试后仍然是 401，说明 Token 已无效，重定向到登录页
        if (retryResponse.status === 401) {
          clearTokens();
          window.location.href = '/login';
          return retryResponse;
        }

        return retryResponse;
      } catch (error) {
        console.error('刷新 Token 失败，清除认证信息:', error);
        clearTokens();
        // 重定向到登录页
        window.location.href = '/login';
        // 返回原始 401 响应
        return response;
      }
    } else {
      // 没有 refresh token，直接重定向到登录页
      window.location.href = '/login';
    }
  }

  return response;
}
