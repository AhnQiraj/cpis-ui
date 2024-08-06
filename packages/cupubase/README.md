# CuPuBase
0.0.1为初版，0.0.1可以使用npm，从0.1.0 开始使用pnpm
## Getting Started

### Install
```bash
touch .npmrc
echo "@cpis:registry=http://172.169.50.40:5000/" > .npmrc
pnpm add @cpis/cupubase # or npm install @cpis/cupubase
```
### 依赖删除
```diff
- @riophae/vue-treeselect 项目中没有使用 用来选择树形结构
- vuex 项目中没有使用 用来状态管理
- xss 项目中没有使用 用来防止xss攻击
- echarts 项目中没有使用 用来生成图表
- vue-router 项目中没有使用 用来路由
- element-resize-detector 项目中没有使用 用来监听元素大小变化
- js-cookie 项目中没有使用 用来操作cookie
- @vue/cli-plugin-router 组件库不需要
- @vue/cli-plugin-vuex 组件库不需要
- @vue/cli-plugin-eslint 组件库不需要
- eslint 组件库不需要
- eslint-config-prettier 组件库不需要
- eslint-plugin-prettier 组件库不需要
- eslint-plugin-vue 组件库不需要
- @vue/cli-service 组件库不需要
- webpack 组件库改用vite
- webpack-cli  组件库改用vit
```
