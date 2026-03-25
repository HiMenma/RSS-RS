/**
 * 右侧栏组件
 * 显示文章详情内容
 */

import { useState } from 'react';
import { Box, ScrollArea, Text, Title, Group, Anchor, ActionIcon, Tooltip, Collapse, Divider } from '@mantine/core';
import { useArticle } from '../../hooks/useArticle';
import { useLabels, useArticleLabels } from '../../hooks/useLabels';
import { LabelPicker } from '../label/LabelPicker';
import { LabelManager } from '../label/LabelManager';
import { IconTag, IconChevronDown, IconChevronUp, IconPlus } from '@tabler/icons-react';
import type { Label } from '../../types';
import classes from './ContentColumn.module.css';

interface ContentColumnProps {
  articleId?: string;
}

export function ContentColumn({ articleId }: ContentColumnProps) {
  // 使用 article hook 获取文章详情
  const { data: article, isLoading } = useArticle(articleId || '');

  // 获取所有标签
  const { labels, createLabel } = useLabels();

  // 获取文章标签
  const intId = article?.intId ? parseInt(String(article.intId), 10) : undefined;
  const { labels: articleLabels, addLabels, removeLabel, isAdding, isRemoving } = useArticleLabels(intId || 0);

  // 标签管理对话框状态
  const [labelManagerOpened, setLabelManagerOpened] = useState(false);
  const [labelsExpanded, setLabelsExpanded] = useState(true);

  // 处理标签变化
  const handleLabelChange = async (newLabelIds: number[]) => {
    if (!intId) return;
    try {
      // 获取当前标签ID列表
      const currentLabelIds = articleLabels.map((l: Label) => l.id);
      const toAdd = newLabelIds.filter((id: number) => !currentLabelIds.includes(id));
      const toRemove = currentLabelIds.filter((id: number) => !newLabelIds.includes(id));

      // 添加新标签
      if (toAdd.length > 0) {
        await addLabels(toAdd);
      }

      // 移除旧标签
      for (const labelId of toRemove) {
        await removeLabel(labelId);
      }
    } catch (error) {
      console.error('更新标签失败:', error);
    }
  };

  // 处理创建新标签
  const handleCreateLabel = async (caption: string): Promise<Label> => {
    try {
      const newLabel = await createLabel({ caption });
      // 自动添加到当前文章
      if (intId) {
        await addLabels([newLabel.id]);
      }
      return newLabel;
    } catch (error) {
      console.error('创建标签失败:', error);
      throw error;
    }
  };

  if (!articleId) {
    return (
      <Box className={classes.column}>
        <Box className={classes.empty}>
          <Text c="dimmed" ta="center" mt="xl">
            请选择一篇文章查看详情
          </Text>
        </Box>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box className={classes.column}>
        <Box p="lg">
          <Text c="dimmed">加载中...</Text>
        </Box>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box className={classes.column}>
        <Box p="lg">
          <Text c="dimmed">文章不存在</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.column}>
      <ScrollArea className={classes.scrollArea} type="scroll">
        <Box p="lg">
          {/* 标题 */}
          <Title order={4} mb="md">
            {article.title}
          </Title>

          {/* 元信息 */}
          <Group gap="xs" mb="lg">
            {article.author && (
              <Text size="sm" c="dimmed">
                作者：{article.author}
              </Text>
            )}
            {article.updatedAt && (
              <Text size="sm" c="dimmed">
                更新：{new Date(article.updatedAt).toLocaleString('zh-CN')}
              </Text>
            )}
          </Group>

          {/* 标签区域 */}
          <Box mb="lg">
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <IconTag size={16} />
                <Text size="sm" fw={500}>标签</Text>
              </Group>
              <Group gap="xs">
                <Tooltip label="管理标签">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => setLabelManagerOpened(true)}
                  >
                    <IconPlus size={14} />
                  </ActionIcon>
                </Tooltip>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => setLabelsExpanded(!labelsExpanded)}
                >
                  {labelsExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                </ActionIcon>
              </Group>
            </Group>

            <Collapse in={labelsExpanded}>
              <LabelPicker
                value={articleLabels.map((l: Label) => l.id)}
                labels={labels}
                onChange={handleLabelChange}
                placeholder="为文章添加标签"
                allowCreate={true}
                onCreateLabel={handleCreateLabel}
                disabled={isAdding || isRemoving}
              />
            </Collapse>
          </Box>

          <Divider my="md" />

          {/* 原文链接 */}
          {article.link && (
            <Anchor
              href={article.link}
              target="_blank"
              size="sm"
              mb="lg"
              display="block"
            >
              阅读原文 →
            </Anchor>
          )}

          {/* 内容 */}
          <Box
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </Box>
      </ScrollArea>

      {/* 标签管理对话框 */}
      <LabelManager
        opened={labelManagerOpened}
        onClose={() => setLabelManagerOpened(false)}
        mode="manage"
      />
    </Box>
  );
}
