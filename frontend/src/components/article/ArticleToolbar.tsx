/**
 * 文章工具栏组件
 * 提供批量操作功能：标记已读、标记星标、删除等
 */

import { Group, ActionIcon, Tooltip, Text, Box } from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconStar,
  IconStarOff,
  IconTrash,
} from '@tabler/icons-react';
import classes from './ArticleToolbar.module.css';

interface ArticleToolbarProps {
  selectedCount: number;
  isAllSelected?: boolean;
  onToggleSelectAll?: () => void;
  onMarkSelectedAsRead?: (read: boolean) => void;
  onMarkSelectedAsStarred?: (starred: boolean) => void;
  onDeleteSelected?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  loadingType?: any;
}

export function ArticleToolbar({
  selectedCount,
  isAllSelected: _isAllSelected,
  onToggleSelectAll: _onToggleSelectAll,
  onMarkSelectedAsRead,
  onMarkSelectedAsStarred,
  onDeleteSelected,
  onRefresh,
  isLoading: _isLoading,
  loadingType: _loadingType,
}: ArticleToolbarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <Box className={classes.toolbar}>
      <Group justify="space-between" wrap="nowrap">
        {/* 左侧：选中状态提示 */}
        {hasSelection ? (
          <Text size="sm" fw={500}>
            已选择 {selectedCount} 篇文章
          </Text>
        ) : (
          <Text size="sm" c="dimmed">
            未选择文章
          </Text>
        )}

        {/* 右侧：操作按钮 */}
        <Group gap="xs">
          {/* 刷新按钮 */}
          <Tooltip label="刷新" position="top">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={onRefresh}
            >
              <IconCheck size={20} />
            </ActionIcon>
          </Tooltip>

          {/* 标记已读 */}
          <Tooltip label="标记已读" position="top">
            <ActionIcon
              variant="subtle"
              color="blue"
              size="lg"
              disabled={!hasSelection}
              onClick={() => onMarkSelectedAsRead?.(true)}
            >
              <IconCheck size={20} />
            </ActionIcon>
          </Tooltip>

          {/* 标记未读 */}
          <Tooltip label="标记未读" position="top">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              disabled={!hasSelection}
              onClick={() => onMarkSelectedAsRead?.(false)}
            >
              <IconX size={20} />
            </ActionIcon>
          </Tooltip>

          {/* 标记星标 */}
          <Tooltip label="标记星标" position="top">
            <ActionIcon
              variant="subtle"
              color="yellow"
              size="lg"
              disabled={!hasSelection}
              onClick={() => onMarkSelectedAsStarred?.(true)}
            >
              <IconStar size={20} />
            </ActionIcon>
          </Tooltip>

          {/* 取消星标 */}
          <Tooltip label="取消星标" position="top">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              disabled={!hasSelection}
              onClick={() => onMarkSelectedAsStarred?.(false)}
            >
              <IconStarOff size={20} />
            </ActionIcon>
          </Tooltip>

          {/* 删除 */}
          <Tooltip label="删除" position="top">
            <ActionIcon
              variant="subtle"
              color="red"
              size="lg"
              disabled={!hasSelection}
              onClick={onDeleteSelected}
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Box>
  );
}
