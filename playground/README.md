# CPIS UI 组件展示平台

这是 CPIS UI 组件库的展示和测试环境。它使用 Storybook 来展示和测试 CPIS-Front-Lib 项目中的所有组件。

## 用途

该展示平台用作：
- 所有可用 UI 组件的可视化展示
- 新组件的开发和测试环境
- 组件使用的文档资源
- 组件变更的预览环境

## 开始使用

### 前提条件

- Node.js >= 18
- pnpm >= 9

### 运行展示平台

```bash
# 安装依赖
pnpm install

# 启动 Storybook 开发服务器
pnpm storybook
```

这将在 http://localhost:6006 启动 Storybook 服务器

### 构建生产版本

```bash
# 构建静态 Storybook 站点
pnpm build-storybook
```

构建好的静态站点将位于 `storybook-static` 目录中。目前部署在 `172.169.50.28` 环境下 `/home/storebook`

## 目录结构

```
playground/
├── .storybook/          # Storybook 配置
├── src/                 # 源代码
│   ├── stories/         # 组件故事
│   └── img/             # 故事中使用的图片
├── public/              # 静态资源
├── assets/              # 附加资源
├── package.json         # 包配置
└── vite.config.js       # Vite 配置
```

## 创建新的故事

要创建新的组件故事，请在 `src/stories` 目录中添加一个新文件，遵循命名约定 `ComponentName.stories.js`。同时可以参考 `Demo.stories.js` 这是一个模版。

## 在线演示

最新版本的展示平台可在以下地址访问：http://172.169.50.28:5002/
