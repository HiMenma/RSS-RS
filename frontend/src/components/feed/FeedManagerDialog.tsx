/**
 * 订阅源管理对话框
 * 支持添加、编辑、删除订阅源
 */

import { useState } from 'react';
import {
  Modal,
  Group,
  Stack,
  Text,
  ActionIcon,
  Tooltip,
  Divider,
  Loader,
  Button,
  ScrollArea,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconRefresh } from '@tabler/icons-react';
import { useFeeds } from '../../hooks/useFeeds';
import { FeedForm } from './FeedForm';
import type { FeedFormData } from './FeedForm';
import classes from './FeedManagerDialog.module.css';

interface FeedManagerDialogProps {
  opened: boolean;
  onClose: () => void;
}

export function FeedManagerDialog({ opened, onClose }: FeedManagerDialogProps) {
  const { feeds, isLoading, refetchFeeds, createFeed, updateFeed, isCreating, isUpdating, deleteFeed } = useFeeds();
  const [feedFormOpened, setFeedFormOpened] = useState(false);
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [editingFeedData, setEditingFeedData] = useState<FeedFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 打开添加订阅源对话框
  const handleOpenAdd = () => {
    setEditingFeedId(null);
    setEditingFeedData(null);
    setSubmitError(null);
    setFeedFormOpened(true);
  };

  // 打开编辑订阅源对话框
  const handleOpenEdit = (feed: FeedFormData, feedId: string) => {
    setEditingFeedId(feedId);
    setEditingFeedData(feed);
    setSubmitError(null);
    setFeedFormOpened(true);
  };

  // 订阅源表单成功提交
  const handleFormSuccess = async (data: FeedFormData) => {
    try {
      setSubmitError(null);
      if (editingFeedId) {
        // 编辑模式
        await updateFeed(editingFeedId, data);
      } else {
        // 创建模式
        await createFeed(data);
      }
      setFeedFormOpened(false);
      refetchFeeds();
    } catch (error: any) {
      setSubmitError(error.message || '操作失败');
    }
  };

  // 删除订阅源
  const handleDelete = async (feedId: string) => {
    if (window.confirm('确定要删除这个订阅源吗？')) {
      try {
        await deleteFeed(feedId);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="订阅源管理"
        size="lg"
        centered
      >
        <Stack gap="md">
          {/* 标题和操作按钮 */}
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              我的订阅（{feeds.length}）
            </Text>
            <Group gap="xs">
              <Tooltip label="刷新列表" position="left">
                <ActionIcon variant="subtle" color="gray" size="md" onClick={() => refetchFeeds()}>
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="添加订阅源" position="left">
                <Button
                  variant="filled"
                  color="blue"
                  size="sm"
                  leftSection={<IconPlus size={18} />}
                  onClick={handleOpenAdd}
                >
                  添加订阅
                </Button>
              </Tooltip>
            </Group>
          </Group>

          <Divider />

          {/* 订阅源列表 */}
          {isLoading ? (
            <Loader />
          ) : feeds.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              暂无订阅源，点击右上角按钮添加
            </Text>
          ) : (
            <ScrollArea className={classes.feedList} type="scroll">
              <Stack gap="xs">
                {feeds.map((feed) => (
                  <Group key={feed.id} justify="space-between" wrap="nowrap">
                    <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate>
                        {feed.title}
                      </Text>
                      <Text size="xs" c="dimmed" truncate>
                        {feed.url}
                      </Text>
                    </Stack>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="md"
                        onClick={() => handleOpenEdit({ title: feed.title, feedUrl: feed.url, siteUrl: feed.description || '', categoryId: null }, feed.id)}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="md"
                        onClick={() => handleDelete(feed.id)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                ))}
              </Stack>
            </ScrollArea>
          )}
        </Stack>
      </Modal>

      {/* 添加/编辑订阅源表单 */}
      <Modal
        opened={feedFormOpened}
        onClose={() => setFeedFormOpened(false)}
        title={editingFeedId ? '编辑订阅源' : '添加订阅源'}
        size="lg"
        centered
      >
        <FeedForm
          initialData={editingFeedData}
          onSubmit={handleFormSuccess}
          onCancel={() => setFeedFormOpened(false)}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </Modal>
    </>
  );
}
