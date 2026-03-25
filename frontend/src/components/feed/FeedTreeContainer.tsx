/**
 * FeedTree 容器组件
 * 集成 useFeeds hook，将数据转换为 FeedTree 所需的格式
 */

import { useState, useMemo, useCallback } from 'react';
import { FeedTree } from './FeedTree';
import { useFeeds } from '../../hooks/useFeeds';
import type { FeedTreeNodeData } from '../../types';

interface FeedTreeContainerProps {
  selectedFeedId?: string;
  onFeedSelect?: (feedId: string | null) => void;
}

/**
 * 将订阅源和分类数据转换为树形结构
 */
function buildFeedTreeData(
  feeds: any[],
  categories: any[]
): FeedTreeNodeData[] {
  const tree: FeedTreeNodeData[] = [];

  // 添加"全部"节点
  tree.push({
    value: 'all',
    label: '全部',
    type: 'category',
    id: 'all',
    unreadCount: feeds.reduce((sum, feed) => sum + (feed.unreadCount || 0), 0),
    children: [],
  });

  // 添加"未读"节点
  tree.push({
    value: 'unread',
    label: '未读',
    type: 'category',
    id: 'unread',
    unreadCount: feeds.reduce((sum, feed) => sum + (feed.unreadCount || 0), 0),
    children: [],
  });

  // 按分类组织订阅源
  const categoryMap = new Map<number, FeedTreeNodeData>();

  // 先创建所有分类节点
  categories.forEach((category) => {
    const categoryNode: FeedTreeNodeData = {
      value: `cat-${category.id}`,
      label: category.title,
      type: 'category',
      id: `cat-${category.id}`,
      categoryId: String(category.id),
      unreadCount: 0,
      children: [],
    };
    categoryMap.set(category.id, categoryNode);
    tree.push(categoryNode);
  });

  // 将订阅源添加到对应分类
  feeds.forEach((feed) => {
    const feedNode: FeedTreeNodeData = {
      value: `feed-${feed.id}`,
      label: feed.title,
      type: 'feed',
      id: `feed-${feed.id}`,
      feedId: String(feed.id),
      unreadCount: feed.unreadCount || 0,
    };

    if (feed.catId && categoryMap.has(feed.catId)) {
      const categoryNode = categoryMap.get(feed.catId)!;
      categoryNode.children!.push(feedNode);
      categoryNode.unreadCount! += feed.unreadCount || 0;
    } else {
      // 没有分类的订阅源放到"全部"下
      const allNode = tree.find((node) => node.id === 'all');
      if (allNode && allNode.children) {
        allNode.children.push(feedNode);
      }
    }
  });

  return tree;
}

export function FeedTreeContainer({
  selectedFeedId,
  onFeedSelect,
}: FeedTreeContainerProps) {
  const { feeds = [], categories = [] } = useFeeds();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // 构建树形数据
  const treeData = useMemo(
    () => buildFeedTreeData(feeds, categories),
    [feeds, categories]
  );

  // 处理节点选择
  const handleSelect = useCallback(
    (nodeId: string) => {
      if (nodeId === 'all') {
        onFeedSelect?.(null);
      } else if (nodeId === 'unread') {
        onFeedSelect?.('unread');
      } else if (nodeId?.startsWith('feed-')) {
        onFeedSelect?.(nodeId.replace('feed-', ''));
      } else if (nodeId?.startsWith('cat-')) {
        const categoryId = nodeId.replace('cat-', '');
        onFeedSelect?.(`cat-${categoryId}`);
      }
    },
    [onFeedSelect]
  );

  return (
    <FeedTree
      data={treeData}
      selectedId={selectedFeedId ? `feed-${selectedFeedId}` : 'all'}
      onSelect={handleSelect}
      expandedIds={expandedIds}
      onExpandChange={setExpandedIds}
    />
  );
}
