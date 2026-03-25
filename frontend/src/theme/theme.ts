/**
 * 主题配置
 * 定义亮色和暗黑主题
 */

import { createTheme, MantineColorsTuple } from '@mantine/core';

// 主色调：蓝灰色
const primaryColor: MantineColorsTuple = [
  '#e7e9f0',
  '#d0d4e2',
  '#9da6c6',
  '#6775a8',
  '#3b5998', // 主色
  '#2d4475',
  '#223359',
  '#16223d',
  '#0a1222',
  '#00030d',
];

// 强调色：橙色
const accentColor: MantineColorsTuple = [
  '#fff4e6',
  '#ffe9d0',
  '#ffd09e',
  '#ffb566',
  '#d96000', // 主色
  '#b84f00',
  '#8a3b00',
  '#5c2600',
  '#2f1100',
  '#000000',
];

export const lightTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: primaryColor,
    accent: accentColor,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  radius: {
    lg: '8px',
  },
  defaultGradient: {
    from: '#3b5998',
    to: '#2d4475',
    deg: 135,
  },
});

export const darkTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: [
      '#2d3748',
      '#2a3441',
      '#1f2937',
      '#1a2230',
      '#2d4475',
      '#3b5998', // 亮一些
      '#4a67a8',
      '#5a78c0',
      '#6a8bd8',
      '#7a9ff0',
    ],
    accent: [
      '#4a2f00',
      '#5c3b00',
      '#754a00',
      '#8f5a00',
      '#d96000',
      '#f07000',
      '#ff8010',
      '#ff9030',
      '#ffa050',
      '#ffb070',
    ],
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  radius: {
    lg: '8px',
  },
  defaultGradient: {
    from: '#2d4475',
    to: '#3b5998',
    deg: 135,
  },
});

export type ThemeMode = 'light' | 'dark';
