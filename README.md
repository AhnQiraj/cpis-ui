# CPIS-Front-Lib

前端组件库和工具库

## 目录结构

```
cpis-front-lib/
├── .changeset/           # Changesets 配置目录，用于管理版本和发布
├── packages/             # 各个包目录
│   ├── cpis-ui/          # UI，目前2.0中所有 cpis 开头的组件都在这里
│   ├── cupubase/         # 基础功能包，1.0遗留的组件库
│   ├── platformbase/     # 平台基础包，1.0遗留的组件库
│   ├── prettier-config/  # Prettier 配置包，统一代码格式化配置
│   ├── tools/            # 公共工具库，自动检测更新脚本；公共的筛选器；公共方法；
│   └── uno-preset/       # UnoCSS 预设包，基于unocss的css样式预设；主题预设；
├── playground/           # 示例和测试项目，http://172.169.50.28:5002/ 看到的 demo 都在这个下面都在这个下面
├── template/             # 模版
├── .gitignore            # Git 忽略配置
├── .npmrc                # NPM 配置
├── package.json          # 项目配置
├── pnpm-lock.yaml        # pnpm 依赖锁定文件
├── pnpm-workspace.yaml   # pnpm 工作区配置
├── README.md             # 项目说明文档
└── uno.config.js         # UnoCSS 配置文件
```

## 开发指南

### 环境准备

- Node.js >= 18
- pnpm >= 9.5.0

### 安装依赖

```bash
pnpm install

```

### 开发流程

1. 在 `packages` 目录下开发对应的包
2. 使用 `playground` 进行调试和测试
3. 使用 changesets 管理版本和发布

### 发布流程

发布流程参考 Confluence #

