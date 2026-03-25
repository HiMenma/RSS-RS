/**
 * 标签 API 服务
 */

import type { Label } from '../types';
import type { LabelFormData } from '../types';
import { authFetch, getAuthHeaders, handleResponseError } from '../utils/api';

const API_BASE_URL = '/api';

/**
 * 获取标签列表
 *
 * @returns 标签列表
 * @throws 获取失败时抛出错误
 */
export async function getLabels(): Promise<Label[]> {
  const response = await authFetch(`${API_BASE_URL}/labels`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 获取单个标签
 *
 * @param id 标签 ID
 * @returns 标签详情
 * @throws 获取失败时抛出错误
 */
export async function getLabel(id: number): Promise<Label> {
  const response = await authFetch(`${API_BASE_URL}/labels/${id}`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('标签不存在');
    }
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 创建标签
 *
 * @param data 标签数据
 * @returns 创建的标签
 * @throws 创建失败时抛出错误
 */
export async function createLabel(data: LabelFormData): Promise<Label> {
  const response = await authFetch(`${API_BASE_URL}/labels`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('标签数据无效');
    }
    if (response.status === 409) {
      throw new Error('该标签已存在');
    }
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 更新标签
 *
 * @param id 标签 ID
 * @param data 更新的标签数据
 * @returns 更新后的标签
 * @throws 更新失败时抛出错误
 */
export async function updateLabel(
  id: number,
  data: Partial<LabelFormData>
): Promise<Label> {
  const response = await authFetch(`${API_BASE_URL}/labels/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('标签不存在');
    }
    if (response.status === 400) {
      throw new Error('标签数据无效');
    }
    if (response.status === 409) {
      throw new Error('该标签名已存在');
    }
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 删除标签
 *
 * @param id 标签 ID
 * @returns void
 * @throws 删除失败时抛出错误
 */
export async function deleteLabel(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/labels/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('标签不存在');
    }
    return handleResponseError(response);
  }
}

/**
 * 获取文章的标签列表
 *
 * @param articleId 文章 ID
 * @returns 标签列表
 * @throws 获取失败时抛出错误
 */
export async function getLabelsByArticleId(articleId: number): Promise<Label[]> {
  const response = await authFetch(`${API_BASE_URL}/labels/articles/${articleId}`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 为文章添加标签
 *
 * @param articleId 文章 ID
 * @param labelIds 标签 ID 列表
 * @returns void
 * @throws 添加失败时抛出错误
 */
export async function addLabelsToArticle(
  articleId: number,
  labelIds: number[]
): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/labels/articles/${articleId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(labelIds),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('标签数据无效');
    }
    return handleResponseError(response);
  }
}

/**
 * 从文章移除标签
 *
 * @param articleId 文章 ID
 * @param labelId 标签 ID
 * @returns void
 * @throws 移除失败时抛出错误
 */
export async function removeLabelFromArticle(
  articleId: number,
  labelId: number
): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/labels/articles/${articleId}/${labelId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('标签不存在');
    }
    if (response.status === 400) {
      throw new Error('无权限操作标签');
    }
    return handleResponseError(response);
  }
}

export const labelApi = {
  getLabels,
  getLabel,
  createLabel,
  updateLabel,
  deleteLabel,
  getLabelsByArticleId,
  addLabelsToArticle,
  removeLabelFromArticle,
};
