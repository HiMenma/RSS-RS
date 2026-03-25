/**
 * 主布局组件
 * 三栏布局：侧边栏 + 文章列表 + 内容详情
 */

import { useState } from 'react';
import { Box, Flex } from '@mantine/core';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ArticleColumn } from './ArticleColumn';
import { ContentColumn } from './ContentColumn';
import classes from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
  onOpmlImport?: () => void;
  onOpmlExport?: () => void;
  onFeedManage?: () => void;
}

export function MainLayout({
  onOpmlImport,
  onOpmlExport,
  onFeedManage,
  children
}: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [mobileSidebarOpened, setMobileSidebarOpened] = useState(false);

  return (
    <Box className={classes.layout}>
      {/* 顶部导航栏 */}
      <Header
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        collapsed={sidebarCollapsed}
        onMobileMenuToggle={() => setMobileSidebarOpened(!mobileSidebarOpened)}
        onOpmlImport={onOpmlImport}
        onOpmlExport={onOpmlExport}
        onFeedManage={onFeedManage}
      />

      {/* 主内容区 - 三栏布局 */}
      <Flex className={classes.main}>
        {/* 左侧栏：订阅源 */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          selectedFeedId={selectedFeedId || undefined}
          onFeedSelect={(feedId) => {
            setSelectedFeedId(feedId);
            setSelectedArticleId(null); // 切换订阅源时清除文章选择
            setMobileSidebarOpened(false); // 移动端关闭侧边栏
          }}
          mobileOpened={mobileSidebarOpened}
          onCloseMobile={() => setMobileSidebarOpened(false)}
        />

        {/* 中间栏：文章列表 */}
        <ArticleColumn
          feedId={selectedFeedId}
          onArticleSelect={setSelectedArticleId}
        />

        {/* 右侧栏：文章内容 */}
        <ContentColumn articleId={selectedArticleId || undefined} />
      </Flex>

      {/* 渲染对话框等子组件 */}
      {children}
    </Box>
  );
}
