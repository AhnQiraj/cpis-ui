export default {
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: { search: { open: 'Ctrl+Q', close: 'Esc' }, lock: { open: 'Ctrl+L' } },
  // 侧边栏默认配置
  menu: {
    activeHeader: '1',
    asideCollapse: false,
    asideTransition: true,
    openTarget: '_tab' // 规定在哪个窗口或框架中加载被链接文档。_blank：新页面，_tab:标签页
  },
  // 在读取持久化数据失败时默认页面
  page: { opened: [{ name: 'dashboard', fullPath: '/dashboard', meta: { title: '首页', auth: true } }] },
  // 默认菜单
  menus: [{ path: '/dashboard', name: '首页', alias: 'dashboard', icon: 'home' }],
  // 版本
  releases: {
    D2AdminVersion: '1.22.0', // 感谢D2 Admin 同步更新下D2版本(https://github.com/d2-projects/d2-admin/releases)
    version: window.config ? window.config.VUE_APP_VERSION : '',
    api: '' // 更新版本的api
  },
  // 全局key
  globalKey: 'ibps-' + (window.config ? window.config.VUE_APP_VERSION : ''),
  // 系统默认值设置
  system: {
    size: 'small',
    language: window.config ? window.config.VUE_APP_LOCALE : 'zh-CN',
    languageList: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'zh-TW', label: '繁体中文' },
      { value: 'en', label: 'English' },
      { value: 'ja', label: '日本語' }
    ]
  },
  // 主题色
  color: { predefine: ['#242D38', '#f5222d', '#fa541c', '#faad14', '#13c2c2', '#409EFF', '#52c41a', '#1890ff', '#2f54eb', '#722ed1'] },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      { title: '经典', name: 'ibps', preview: 'images/theme/ibps/preview_2x.png' },
      { title: 'Chester', name: 'chester', preview: 'images/theme/chester/preview_2x.png' },
      { title: 'Element', name: 'element', preview: 'images/theme/element/preview_2x.png' },
      { title: '紫罗兰', name: 'violet', preview: 'images/theme/violet/preview_2x.png' },
      { title: '简约线条', name: 'line', backgroundImage: 'images/theme/line/bg.jpg', preview: 'images/theme/line/preview_2x.png' },
      { title: '流星', name: 'star', backgroundImage: 'images/theme/star/bg.jpg', preview: 'images/theme/star/preview_2x.png' },
      { title: 'Tomorrow Night Blue (vsCode)', name: 'tomorrow-night-blue', preview: 'images/theme/tomorrow-night-blue/preview_2x.png' }
    ]
  },
  // 在读取持久化数据失败时默认用户信息
  userInfo: { user: { name: 'ghost', photo: 'images/lc.png' } },
  // 是否默认开启页面切换动画
  transition: { active: true },
  fileUploadAction: 'https://www.bpmhome.cn/post',
  // 最长请求时间
  requestTimeout: 40 * 1000,
  // 白名单，不重定向白名单，不经过token校验的路由
  whiteRouterList: ['/login', '/loginSSO', '/register', '/forget', '/forgetUsual', '/reset', '/tenantRegister', '/tenantForget', '/authredirect', '/screen', '/controlBreed'],
  // 白名单，匿名请求的URL
  whiteRequestList: ['/user/captcha', '/user/login', '/user/loginSSO', '/user/login/apply', '/authorize', '/authorize/apply', '/authentication', '/authentication/apply', '/user/open', '/user/register', '/user/open/tenant', '/user/reset/passwd', '/user/send/sms', '/saas/tenant/register', '/common/info/system', '/controlBreed']
}
