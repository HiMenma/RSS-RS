/**
 * 左侧边栏组件
 * 显示订阅源树形列表、分类、标签
 */

import { Box, ScrollArea, Text, ActionIcon, Tooltip, Divider } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { FeedTreeContainer } from '../feed/FeedTreeContainer';
import classes from './Sidebar.module.css';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  selectedFeedId?: string;
  onFeedSelect?: (feedId: string | null) => void;
  mobileOpened?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ 
  collapsed, 
  onToggle, 
  selectedFeedId, 
  onFeedSelect,
  mobileOpened,
  onCloseMobile
}: SidebarProps) {
  return (
    <>
      {/* 移动端遮罩层 */}
      {mobileOpened && (
        <Box
          className={classes.mobileOverlay}
          onClick={onCloseMobile}
        />
      )}
      
      <Box 
        className={classes.sidebar} 
        data-collapsed={collapsed}
        data-mobile-opened={mobileOpened}
      >
        {/* 折叠按钮 */}
        <Box className={classes.toggleContainer}>
          <Tooltip
            label={collapsed ? '展开侧边栏' : '收起侧边栏'}
            position="right"
            withArrow
          >
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={onToggle}
              className={classes.toggleButton}
            >
              {collapsed ? (
                <IconChevronRight size={16} />
              ) : (
                <IconChevronLeft size={16} />
              )}
            </ActionIcon>
          </Tooltip>
        </Box>

        {/* 侧边栏内容 */}
        {!collapsed && (
          <>
            {/* 标题 */}
            <Box className={classes.header}>
              <Text size="sm" fw={600} c="#3b5998">
                订阅源
              </Text>
            </Box>

            <Divider />

            {/* 订阅源树 */}
            <ScrollArea className={classes.scrollArea} type="scroll">
              <FeedTreeContainer
                selectedFeedId={selectedFeedId}
                onFeedSelect={onFeedSelect}
              />
            </ScrollArea>
          </>
        )}
      </Box>
    </>
  );
}
