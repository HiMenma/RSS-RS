import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuthStore } from './stores/authStore';
import { MainLayout } from './components/layout';
import { OpmlDialog } from './components/opml/OpmlDialog';
import { FeedManagerDialog } from './components/feed/FeedManagerDialog';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import AuthCallback from './components/auth/AuthCallback';
import type { OpmlImportResult } from './types';

function HomePage() {
  const [opmlDialogOpened, setOpmlDialogOpened] = useState(false);
  const [opmlDialogMode, setOpmlDialogMode] = useState<'import' | 'export'>('import');
  const [feedManagerOpened, setFeedManagerOpened] = useState(false);

  // OPML 导入成功回调
  const handleImportSuccess = (result: OpmlImportResult) => {
    console.log('OPML 导入成功:', result);
  };

  // OPML 导出成功回调
  const handleExportSuccess = () => {
    console.log('OPML 导出成功');
  };

  return (
    <MainLayout
      onOpmlImport={() => {
        setOpmlDialogMode('import');
        setOpmlDialogOpened(true);
      }}
      onOpmlExport={() => {
        setOpmlDialogMode('export');
        setOpmlDialogOpened(true);
      }}
      onFeedManage={() => setFeedManagerOpened(true)}
    >
      {/* OPML 对话框 */}
      <OpmlDialog
        opened={opmlDialogOpened}
        mode={opmlDialogMode}
        onClose={() => setOpmlDialogOpened(false)}
        onImportSuccess={handleImportSuccess}
        onExportSuccess={handleExportSuccess}
      />

      {/* 订阅源管理对话框 */}
      <FeedManagerDialog
        opened={feedManagerOpened}
        onClose={() => setFeedManagerOpened(false)}
      />
    </MainLayout>
  );
}

/**
 * 认证守卫组件
 * 未登录时重定向到登录页
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/search" element={<SearchPage />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App;
