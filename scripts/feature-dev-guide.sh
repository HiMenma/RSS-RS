#!/bin/bash

# Feature-Dev 插件使用示例
# 展示如何使用 feature-dev 插件进行功能开发

cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║          Feature-Dev 插件使用指南                               ║
╚════════════════════════════════════════════════════════════════╝

📦 已安装插件

1. pyright-lsp
   - 版本: pyright 1.1.408
   - 功能: Python 语言服务器，提供静态类型检查和代码智能
   - 使用: pyright <文件路径>

2. feature-dev
   - 功能: 功能开发工作流，提供 7 阶段开发流程
   - 代理:
     * code-explorer: 代码探索
     * code-architect: 架构设计
     * code-reviewer: 代码审查

═══════════════════════════════════════════════════════════════════

🚀 快速开始

在 Claude Code 中使用以下命令启动功能开发工作流：

/feature-dev 添加用户通知功能

═══════════════════════════════════════════════════════════════════

📋 7 阶段工作流程

阶段 1: Discovery（发现）
  - 理解需求
  - 识别约束
  - 确认理解

阶段 2: Codebase Exploration（代码库探索）
  - 并行运行 2-3 个 code-explorer 代理
  - 探索相似功能、架构、UI 模式
  - 生成关键文件列表

阶段 3: Clarifying Questions（澄清问题）
  - 识别未指定方面
  - 列出边缘情况
  - 等待回答后继续

阶段 4: Architecture Design（架构设计）
  - 运行 2-3 个 code-architect 代理
  - 提供多种实现方案
  - 选择最佳方案

阶段 5: Implementation（实现）
  - 等待明确批准后开始
  - 严格遵循代码库约定
  - 持续跟踪进度

阶段 6: Quality Review（质量审查）
  - 运行 3 个 code-reviewer 代理
  - 检查简单性、DRY、优雅性
  - 检查 Bug 和正确性
  - 检查约定和抽象

阶段 7: Summary（总结）
  - 标记所有待办完成
  - 总结完成的工作
  - 建议下一步

═══════════════════════════════════════════════════════════════════

💡 使用示例

1. 启动完整功能开发工作流:
   /feature-dev 添加深色模式支持

2. 手动启动代理:
   "Launch code-explorer to trace how authentication works"
   "Launch code-architect to design the caching layer"
   "Launch code-reviewer to check my recent changes"

3. 使用 Pyright 进行 Python 类型检查:
   pyright src/backend/module/auth/service/*.py

═══════════════════════════════════════════════════════════════════

🔧 可用命令

在 Claude Code 中:

  /feature-dev [功能描述]    启动功能开发工作流
  /feature-dev              交互式启动工作流

自动化脚本:

  bash scripts/test-plugins.sh    运行插件测试

═══════════════════════════════════════════════════════════════════

📚 更多资源

- Feature-Dev 插件文档: ~/.claude/plugins/repos/feature-dev/README.md
- Claude Code 文档: https://docs.anthropic.com/en/docs/claude-code

═══════════════════════════════════════════════════════════════════

EOF

exit 0
