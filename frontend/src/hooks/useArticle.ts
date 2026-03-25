import { useQuery } from '@tanstack/react-query';
import { articleApi } from '../services/articleApi';
import type { Article } from '../types';

/**
 * Query Keys
 */
export const articleQueryKeys = {
  all: ['articles'] as const,
  lists: () => [...articleQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...articleQueryKeys.lists(), filters] as const,
  details: () => [...articleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...articleQueryKeys.details(), id] as const,
};

/**
 * 单篇文章 Hook
 *
 * @param id 文章 ID
 */
export function useArticle(id: string) {
  return useQuery<Article, Error>({
    queryKey: articleQueryKeys.detail(id),
    queryFn: () => articleApi.getArticle(id),
    enabled: !!id,
  });
}
