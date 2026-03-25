import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import '@mantine/core/styles.css';

import App from './App.tsx';
import { lightTheme, darkTheme } from './theme/theme.ts';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppProviders({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useTheme();

  return (
    <MantineProvider
      theme={colorScheme === 'dark' ? darkTheme : lightTheme}
      defaultColorScheme={colorScheme}
    >
      {children}
    </MantineProvider>
  );
}

function Root() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppProviders>
              <App />
            </AppProviders>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
