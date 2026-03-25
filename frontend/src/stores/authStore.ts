import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null; // Token 过期时间戳（毫秒）
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string, expiresIn?: number) => void;
  clearTokens: () => void;
  setUser: (user: User | null) => void;
  login: (user: User, accessToken: string, refreshToken: string, expiresIn?: number) => void;
  logout: () => void;
  isTokenExpiring: () => boolean; // 检查 Token 是否即将过期（5 分钟内）
}

const ACCESS_TOKEN_KEY = 'rss_access_token';
const REFRESH_TOKEN_KEY = 'rss_refresh_token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'rss_access_token_expires_at';

//  Token 过期前多少毫秒开始刷新（5 分钟）
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000;

// 从 localStorage 初始化状态
function getStoredToken(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getStoredNumber(key: string): number | null {
  try {
    const value = localStorage.getItem(key);
    return value ? parseInt(value, 10) : null;
  } catch {
    return null;
  }
}

function removeStoredTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  } catch {
    // ignore
  }
}

function storeTokens(accessToken: string, refreshToken: string, expiresAt: number | null): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (expiresAt !== null) {
      localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
    }
  } catch {
    // ignore
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: getStoredToken(ACCESS_TOKEN_KEY),
  refreshToken: getStoredToken(REFRESH_TOKEN_KEY),
  accessTokenExpiresAt: getStoredNumber(ACCESS_TOKEN_EXPIRES_AT_KEY),
  isAuthenticated: !!getStoredToken(ACCESS_TOKEN_KEY),

  setTokens: (accessToken, refreshToken, expiresIn = 900000) => {
    const expiresAt = Date.now() + expiresIn;
    storeTokens(accessToken, refreshToken, expiresAt);
    set({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: expiresAt,
      isAuthenticated: true,
    });
  },

  clearTokens: () => {
    removeStoredTokens();
    set({
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  login: (user, accessToken, refreshToken, expiresIn = 900000) => {
    const expiresAt = Date.now() + expiresIn;
    storeTokens(accessToken, refreshToken, expiresAt);
    set({
      user,
      accessToken,
      refreshToken,
      accessTokenExpiresAt: expiresAt,
      isAuthenticated: true,
    });
  },

  logout: () => {
    removeStoredTokens();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      isAuthenticated: false,
    });
  },

  isTokenExpiring: () => {
    const expiresAt = get().accessTokenExpiresAt;
    if (!expiresAt) return true;
    // 如果 Token 已过期或即将在 5 分钟内过期，返回 true
    return Date.now() + TOKEN_REFRESH_THRESHOLD >= expiresAt;
  },
}));
