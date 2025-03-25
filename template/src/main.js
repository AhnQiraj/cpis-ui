import './public-path.js'
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import cupubase from '@cpis/cupubase'
import platformbase from '@cpis/platformbase'
import CpisUI from '@cpis/cpis-ui'
import ElementUI from 'element-ui'
import D2CrudX from 'd2-crud-x'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import actions from '@/qiankun/actions.js'
import cpisBusinessOpLog from '@/utils/cpUtils/cpisBusinessOpLog'
import ibps from './plugins/ibps'
import localRoutes from '@/router/index'
import i18n from './i18n'
// import VueI18n from 'vue-i18n'
import * as echarts from 'echarts'
import * as axios from './utils/axios'
import messager from '@/utils/cpUtils/message'
import 'uno.css'
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.use(cupubase)
Vue.use(platformbase)
Vue.use(CpisUI)
Vue.use(ibps)
Vue.use(ElementUI, { size: 'small' })
Vue.use(VXETable)
Vue.use(D2CrudX, { name: 'd2-crud-x' })
Vue.use(VueRouter)
Vue.prototype.$CpisBusinessOpLog = cpisBusinessOpLog
Vue.config.productionTip = false
Vue.prototype.$message = messager // 重写message提示框  一定要放在Vue.use(ElementUI)之后
// 对message功能的补充
Vue.prototype.$message.close = function (id, userOnClose) {
  return ElementUI.Message.close(id, userOnClose)
}
Vue.prototype.$message.closeAll = function () {
  return ElementUI.Message.closeAll()
}
let router = null
let instance = null
let onlineRoutes = []
function addRouter(route, routePath) {
  let defaultUrl = route.defaultUrl || route.meta.defaultUrl
  defaultUrl = defaultUrl.replace('/cpViews', 'cpViews')
  if (defaultUrl.indexOf('cpViews') !== -1 && routePath === route.path) {
    let myRoute = {
      meta: route.meta,
      path: route.path,
      name: route.name,
      component: require('@/views/' + defaultUrl)['default']
    }
    onlineRoutes.push(myRoute)
  }
}
function render(props = {}) {
  const { container, routePath, query, mainWindow, store, apiList } = props
  onlineRoutes = []
  if (store) {
    window.apiList = apiList
    Vue.prototype.store = store
    window.queryFromQianKun = query
    window.parent.pageType = 'mainRoute'
    window.parent.formParams = null
    window.routePathFromQianKun = routePath
    window.config = mainWindow.config
    let routes = [
      ...store.state.ibps.menu.qiankunRoutes,
      ...store.state.ibps.menu.dynamicsRoutes,
      ...mainWindow.__microRoutes
    ]
    routes.map(routes => {
      if (routes.children) {
        routes.children.map(route => {
          if (route.meta.defaultUrl) {
            //todo 修改成对应项目名
            if (route.meta.defaultUrl.indexOf('cpViews/RPOJECTNAME/') !== -1) {
              if (route.path.indexOf(routes.name + '/') === -1) {
                route.path = `/${routes.name}/${route.path}`
              }
              addRouter(route, routePath)
            }
          }
        })
      } else if (routes.microName === 'RPOJECTNAME') {
        //todo 修改成对应项目名
        addRouter(routes, routePath)
      }
    })
  } else {
    if (window.parent.config) {
      window.config = window.parent.config
      if (window.parent.info) {
        sessionStorage.setItem('INFO', window.parent.info)
      }
      window.apiList = window.parent.apiList
    }
  }
  router = new VueRouter({
    //todo 修改成对应项目名
    base: window.__POWERED_BY_QIANKUN__ ? '/cpis-provider-RPOJECTNAME/' : '/',
    scrollBehavior: () => ({ y: 0 }),
    mode: window.__POWERED_BY_QIANKUN__ ? (routePath ? 'abstract' : 'history') : 'hash', // 如果有routePath从qiankun注入，说明当前是需要手动加载，路由模式为abstract
    routes: [...onlineRoutes, ...localRoutes]
  })
  if (
    window.__POWERED_BY_QIANKUN__ &&
    window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__ &&
    store.state.ibps.page.readCache
  ) {
    const cachedInstance = window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__
    // 从最初的Vue实例上获得_vnode
    const cachedNode = cachedInstance._vnode
    // 让当前路由在最初的Vue实例上可用
    router.apps.push(...cachedInstance.catchRoute.apps)
    instance = new Vue({
      store,
      i18n,
      router,
      render: () => cachedNode
    })
    // 缓存最初的Vue实例
    instance.cachedInstance = cachedInstance
    router.onReady(() => {
      const { path } = router.currentRoute
      const { path: oldPath } = cachedInstance.$router.currentRoute
      if (path !== oldPath) {
        cachedInstance.$router.push(path)
      }
    })
    instance.$mount(container ? container.querySelector('#app') : '#app')
  } else {
    // 正常实例化
    instance = new Vue({
      el: container ? container.querySelector('#app') : '#app', // 如果有container从qiankun注入，要把dom绑定到qiankun提供的dom内。因为qiankun体系中dom是隔离状态
      store,
      i18n,
      router,
      render: h => h(App)
    })
  }
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {}

export async function mount(props) {
  actions.setActions(props)
  Vue.prototype.$addMainRouter = routeParams => {
    actions.setGlobalState({
      appName: 'subapp',
      eventType: routeParams.eventType ? routeParams.eventType : 'NAVIGATETO',
      routeParams
    })
  }
  render(props)
}
//每次切换路由时都会调用，不管切换的路由是本项目的路由还是其它项目的路由，在这里我们用它来实现替代keepalive来实现缓存作用
export async function unmount(props) {
  //不需要缓存：no，需要缓存：need，清除缓存：clear
  if (props.store.state.ibps.page.cacheType === 'need') {
    const cachedInstance = instance.cachedInstance || instance
    window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__ = cachedInstance
    const cachedNode = cachedInstance._vnode
    if (!cachedNode.data.keepAlive) {
      cachedNode.data.keepAlive = true
    }
    cachedInstance.catchRoute = { apps: [...instance.$router.apps] }
    instance.$destroy()
    instance = null
    router = null
  } else if (props.mainWindow.refreshFlag) {
    //双击刷新的时候
    delete window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__
    instance.$destroy()
    instance = null
    router = null
    Vue.prototype.$addMainRouter({
      path: props.mainWindow.curTo.path,
      fullPath: props.mainWindow.curTo.fullPath,
      meta: props.mainWindow.curTo.meta,
      name: props.mainWindow.curTo.name,
      query: props.mainWindow.curTo.query,
      params: props.mainWindow.curTo.params,
      kind: 'refresh'
    })
  } else {
    if (props.store.state.ibps.page.cacheType === 'clear') {
      delete window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__
    }
    instance.$destroy()
    instance.$el.innerHTML = ''
    instance = null
    router = null
  }
}
//keepalive重新被激活
export async function update(props) {
  console.log('sub app updated')
}
