import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'ttrss_theme_mode';

/**
 * 主题切换 Hook
 * 管理应用的主题模式（亮色/暗黑）
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // 从 localStorage 获取保存的主题
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY) as ThemeMode;
      if (saved) {
        return saved;
      }
      // 否则使用系统偏好
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  // 保存主题到 localStorage
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // 切换主题
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 设置为亮色主题
  const setLight = () => {
    setTheme('light');
  };

  // 设置为暗黑主题
  const setDark = () => {
    setTheme('dark');
  };

  return {
    theme,
    toggleTheme,
    setLight,
    setDark,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
