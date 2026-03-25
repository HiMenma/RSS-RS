# Claude Code 插件安装与使用指南

本文档介绍如何安装和使用 Claude Code 插件来增强开发工作流程。

## 📦 已安装的插件

### 1. pyright-lsp

**功能**: Python 语言服务器，提供静态类型检查和代码智能

**安装状态**: ✅ 已安装
- 版本: `pyright 1.1.408`
- 安装方式: `npm install -g pyright`

**使用方法**:

```bash
# 检查单个文件
pyright src/module/auth/service/UserService.java

# 检查整个目录
pyright src/

# 使用配置文件
pyright --tsconfig pyrightconfig.json
```

### 2. feature-dev

**功能**: 功能开发工作流，提供 7 阶段开发流程

**安装状态**: ✅ 已安装
- 位置: `~/.claude/plugins/repos/feature-dev`
- 功能:
  - `/feature-dev` 命令启动完整工作流
  - 3 个专用代理进行代码探索、架构设计和代码审查

**7 阶段工作流程**:

1. **Discovery** - 发现和理解需求
2. **Codebase Exploration** - 代码库探索（并行运行 2-3 个探索代理）
3. **Clarifying Questions** - 澄清问题
4. **Architecture Design** - 架构设计（多个方案对比）
5. **Implementation** - 实现（等待批准后开始）
6. **Quality Review** - 质量审查（3 个审查代理）
7. **Summary** - 总结

**代理**:

- **code-explorer**: 深度分析代码库，追踪执行路径
- **code-architect**: 设计功能架构和实现蓝图
- **code-reviewer**: 审查 Bug、质量问题和代码约定

**使用方法**:

在 Claude Code 中运行：

```bash
# 启动完整工作流
/feature-dev 添加用户通知功能

# 或者交互式启动
/feature-dev
```

## 🧪 自动化测试

### 运行插件测试

项目包含一个自动化测试脚本，用于验证插件安装和基本功能：

```bash
# 运行测试脚本
bash scripts/test-plugins.sh
```

测试内容包括：

1. ✅ Pyright 安装和功能测试
2. ✅ Feature-dev 插件安装验证
3. ✅ 前端和后端构建测试
4. ✅ E2E 测试环境检查

### 查看使用指南

```bash
# 查看 feature-dev 插件详细使用指南
bash scripts/feature-dev-guide.sh
```

## 📋 示例工作流

### 使用 feature-dev 开发新功能

1. **启动工作流**:
   ```
   /feature-dev 添加文章分享功能
   ```

2. **工作流将引导你完成**:
   - 理解需求和约束
   - 探索代码库寻找相似实现
   - 澄清未明确的需求
   - 设计多个架构方案
   - 等待批准后实现
   - 质量审查
   - 总结和下一步建议

### 手动使用代理

如果你只想使用特定代理，可以直接说：

```
"Launch code-explorer to trace how authentication works"
"Launch code-architect to design the caching layer"
"Launch code-reviewer to check my recent changes"
```

## 🔧 故障排除

### Pyright 相关问题

**问题**: `pyright: command not found`

**解决方案**:
```bash
npm install -g pyright
```

**问题**: Pyright 报告大量类型错误

**解决方案**:
- 这是正常的开发过程
- 使用 `pyright --skipLibCheck` 跳过库检查
- 逐步修复关键类型错误

### Feature-dev 相关问题

**问题**: `/feature-dev` 命令不可用

**解决方案**:
```bash
# 检查插件是否正确安装
ls -la ~/.claude/plugins/repos/feature-dev/

# 如果没有安装，手动安装
git clone https://github.com/anthropics/claude-plugins-official.git /tmp/claude-plugins
mkdir -p ~/.claude/plugins/repos
cp -r /tmp/claude-plugins/plugins/feature-dev ~/.claude/plugins/repos/
```

**问题**: 代理运行时间过长

**解决方案**:
- 这在大型代码库中是正常的
- 代理会并行运行以加快速度
- 详细探索能带来更好的理解

## 📚 更多资源

- Claude Code 官方文档: https://docs.anthropic.com/en/docs/claude-code
- Feature-Dev 插件源码: `~/.claude/plugins/repos/feature-dev/README.md`
- Pyright 文档: https://github.com/microsoft/pyright

## 🤝 贡献

如果你想添加更多插件或改进测试脚本：

1. Fork 项目仓库
2. 创建功能分支
3. 添加插件或测试
4. 提交 Pull Request

## 📄 许可证

本文档和测试脚本遵循项目主许可证。
