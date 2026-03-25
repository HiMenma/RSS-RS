/**
 * 顶部导航栏组件
 * 包含 logo、搜索框、操作菜单、用户菜单
 */

import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Flex,
  Group,
  Menu,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconLogout,
  IconRss,
  IconSearch,
  IconSettings,
  IconUser,
  IconFileImport,
  IconFileExport,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/ThemeProvider';
import classes from './Header.module.css';

interface HeaderProps {
  onMenuToggle?: () => void;
  collapsed?: boolean;
  onMobileMenuToggle?: () => void;
  onOpmlImport?: () => void;
  onOpmlExport?: () => void;
  onFeedManage?: () => void;
}

export function Header({
  onMenuToggle,
  collapsed,
  onMobileMenuToggle,
  onOpmlImport,
  onOpmlExport,
  onFeedManage
}: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const { colorScheme, toggleColorScheme } = useTheme();

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  // 处理搜索
  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <Box className={classes.header}>
      <Flex align="center" h="100%" px="md" justify="space-between">
        {/* 左侧：Logo 和菜单按钮 */}
        <Group gap="xs">
          {/* 移动端汉堡菜单按钮 */}
          <Burger
            opened={false}
            onClick={onMobileMenuToggle}
            visibleFrom="sm"
            size="sm"
            color="white"
          />

          <Burger
            opened={false}
            onClick={onMenuToggle}
            hiddenFrom="sm"
            size="sm"
            color="white"
          />

          <Group gap="xs" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <IconRss size={24} color="#d96000" />
            {!collapsed && (
              <Text
                size="lg"
                fw={700}
                c="white"
                style={{ whiteSpace: 'nowrap' }}
                visibleFrom="sm"
              >
                Tiny Tiny RSS
              </Text>
            )}
          </Group>
        </Group>

        {/* 右侧：操作和用户菜单 */}
        <Group gap="sm">
          {/* 主题切换按钮 */}
          <Tooltip label={colorScheme === 'dark' ? '切换到亮色主题' : '切换到暗黑主题'} position="bottom">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={toggleColorScheme}
            >
              {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
          </Tooltip>

          {/* 搜索按钮 */}
          <Tooltip label="搜索文章" position="bottom">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={handleSearch}
            >
              <IconSearch size={20} />
            </ActionIcon>
          </Tooltip>

          {/* 设置菜单 */}
          <Tooltip label="设置" position="bottom">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => navigate('/preferences')}
            >
              <IconSettings size={20} />
            </ActionIcon>
          </Tooltip>

          {/* 用户菜单 */}
          <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            withArrow
          >
            <Menu.Target>
              <ActionIcon variant="light" color="blue" size="lg">
                <IconUser size={20} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <Avatar size={24} color="blue" radius="xl">
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                }
                disabled
              >
                <Text size="sm" fw={500}>{user?.username}</Text>
                <Text size="xs" c="dimmed">{user?.email}</Text>
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconFileImport size={16} />}
                onClick={onOpmlImport}
              >
                导入 OPML
              </Menu.Item>

              <Menu.Item
                leftSection={<IconFileExport size={16} />}
                onClick={onOpmlExport}
              >
                导出 OPML
              </Menu.Item>

              <Menu.Item
                leftSection={<IconRss size={16} />}
                onClick={onFeedManage}
              >
                订阅源管理
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => navigate('/preferences')}
              >
                偏好设置
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconLogout size={16} color="red" />}
                color="red"
                onClick={handleLogout}
              >
                退出登录
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
    </Box>
  );
}
