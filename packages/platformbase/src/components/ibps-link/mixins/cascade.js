import { cloneDeep } from 'lodash'
import { mapState, mapMutations } from 'vuex'
import layoutHeaderAside from '@platform/layout/header-aside'
import { frameInRoutes } from '@platform/router/routes'
import { getCascadeDynamicData } from '@platform/business/platform/form/utils/formCascadeUtil'
const _import = require('@platform/utils/util.import.' + process.env.NODE_ENV)
/**
 * 临时菜单
 */
export default {
  computed: {
    ...mapState(
      'ibps/menu', [
        'header',
        'routers'
      ]
    )
  },
  methods: {
    ...mapMutations({
      pageInit: 'ibps/page/init',
      headerSet: 'ibps/menu/headerSet'
    }),
    runCascadeAction(config, formData) {
      getCascadeDynamicData(config, formData).then(({ data, params }) => {
        this.cascadeDynamicData = data
        this.cascadeDynamicParams = params
        if (config.required && this.$utils.isEmpty(this.cascadeDynamicData)) {
          this.$message({
            message: config.requiredMsg ? config.requiredMsg : '必填',
            type: 'warning'
          })
          return
        }
        setTimeout(() => {
          switch (config.openType) {
            case 'dialog':
            case 'fullscreen':
              this.runCascadeDialog(config)
              break
            case 'tab':
            case 'url':
              this.runCascadeUrl(config, config.openType)
              break
            default:
              break
          }
        }, 100)
      }).catch(() => {
      })
    },
    setMenu(route, { name, title }) {
      this.$router.addRoute(route[0])
      const routers = this.routers
      const routes = [...frameInRoutes, ...routers, ...route]
      // 更新标签页池
      this.pageInit(routes)
      const menu = {
        alias: name,
        name: title,
        displayInMenu: 'N'
      }
      const header = cloneDeep(this.header)
      const menuIndex = header.findIndex(e => e.alias === menu.alias)
      if (menuIndex >= 0) {
        header[menuIndex] = menu
      } else {
        header.push(menu)
      }
      // 菜单缓存也
      this.headerSet(header)
    },
    /**
     * 新页面
     */
    runCascadeUrl(config, openType) {
      let url
      const title = config.title || ''
      const alias = '-' + config.id
      if (openType === 'tab') {
        // TODO:暂时先不做对路由已经存在的判断
        const meta = {
          name: alias,
          title: title
        }
        const route = [{
          path: '/form/linkPage',
          component: layoutHeaderAside,
          children: [
            {
              path: 'index',
              name: alias,
              component: _import('/platform/form/formrender/linkPage'),
              meta: meta
            }
          ]
        }]
        this.setMenu(route, meta)
        const itemId = '_' + config.id
        const data = JSON.stringify({
          config: config,
          dynamicData: this.cascadeDynamicData,
          dynamicParams: this.cascadeDynamicParams
        })
        localStorage.setItem(itemId, data)
        // 跳转
        this.$router.push({
          path: '/form/linkPage/index',
          query: {
            _itemId: itemId
          }
        })
      } else {
        if (openType === 'url' && config.type === 'fixed') {
          url = this.cascadeDynamicData
        } else {
          const itemId = '_' + config.id
          const { href } = this.$router.resolve({
            path: '/platform/linkPage',
            meta: {
              title: title,
              name: alias
            },
            query: {
              _itemId: itemId
            }
          })
          const data = JSON.stringify({
            config: config,
            dynamicData: this.cascadeDynamicData,
            dynamicParams: this.cascadeDynamicParams
          })
          localStorage.setItem(itemId, data)
          url = href
        }
        this.$utils.open(url, '_blank')
      }
    },
    /**
     * 弹窗模式
     */
    runCascadeDialog(config) {
      const height = this.$utils.isNotEmpty(config.height) ? config.height : ''
      const width = this.$utils.isNotEmpty(config.width) ? config.width : ''
      this.customComponents = {
        openType: config.openType,
        fullscreen: config.openType === 'fullscreen',
        height: height,
        width: width,
        title: config.title
      }
      if (config.type === 'fixed') {
        this.customComponents.url = this.cascadeDynamicData
        this.cascadeDialogVisible = true
      } else if (config.type === 'form' || config.type === 'detail') { // 在线表单
        this.cascadeDialogVisible = true
      } else if (config.type === 'dataTemplate') { // 数据模版
        this.cascadeDialogVisible = true
      }
    }
  }
}
