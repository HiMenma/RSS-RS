/**
 * 中间栏组件
 * 显示文章标题列表
 */

import { useMemo } from 'react';
import { Box, ScrollArea, Text } from '@mantine/core';
import { ArticleList } from '../article/ArticleList';
import classes from './ArticleColumn.module.css';

interface ArticleColumnProps {
  feedId?: string | null;
  onArticleSelect?: (articleId: string) => void;
}

export function ArticleColumn({ feedId, onArticleSelect }: ArticleColumnProps) {
  // 根据 feedId 构建查询参数
  const articleParams = useMemo(() => {
    if (!feedId) {
      return {};
    }

    if (feedId === 'unread') {
      return { isRead: false };
    }

    if (feedId.startsWith('cat-')) {
      const categoryId = feedId.replace('cat-', '');
      return { categoryId };
    }

    return { feedId };
  }, [feedId]);

  return (
    <Box className={classes.column}>
      {/* 标题栏 */}
      <Box className={classes.header}>
        <Text size="sm" fw={600} c="#3b5998">
          文章列表
        </Text>
      </Box>

      {/* 文章列表 */}
      <ScrollArea className={classes.scrollArea} type="scroll">
        <ArticleList params={articleParams} onArticleClick={onArticleSelect} />
      </ScrollArea>
    </Box>
  );
}
