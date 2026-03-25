/**
 * OPML API 服务
 * 处理 OPML 文件的导入和导出
 */

import type { OpmlImportResult } from '../types';
import { authFetch, getAuthHeaders, handleResponseError } from '../utils/api';

const API_BASE_URL = '/api';

/**
 * 导入 OPML 文件
 *
 * @param file OPML 文件
 * @returns 导入结果
 * @throws 导入失败时抛出错误
 */
export async function importOpml(file: File): Promise<OpmlImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authFetch(`${API_BASE_URL}/opml/import`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  return response.json();
}

/**
 * 导出 OPML 文件
 *
 * @returns OPML 文件 Blob
 * @throws 导出失败时抛出错误
 */
export async function exportOpml(): Promise<Blob> {
  const response = await authFetch(`${API_BASE_URL}/opml/export`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    return handleResponseError(response);
  }

  const blob = await response.blob();
  return blob;
}

export const opmlApi = {
  importOpml,
  exportOpml,
};
