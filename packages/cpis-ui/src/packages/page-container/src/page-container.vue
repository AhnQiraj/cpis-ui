<template>
  <div
    class="bg-gray-2 gap-2 flex box-border h-full"
    :class="layout.includes('aside') ? 'flex-row' : 'flex-col'"
    :style="{ height }"
  >
    <template v-for="item in layout">
      <template v-if="Array.isArray(item)">
        <div class="flex flex-col gap-2 flex-1">
          <template v-for="subItem in item">
            <component
              :is="getComponent(subItem)"
              v-bind="subItem === 'header' ? { title } : {}"
            >
              <slot :name="subItem" />
            </component>
          </template>
        </div>
      </template>
      <template v-else>
        <component
          :is="getComponent(item)"
          v-bind="item === 'header' ? { title } : {}"
        >
          <template v-if="item === 'header'" #right>
            <slot name="header-right" />
          </template>
          <slot :name="item" />
        </component>
      </template>
    </template>
  </div>
</template>

<script>
import Header from '../../container-header/index.js'
import Main from '../../container-main/index.js'
import Footer from '../../container-footer/index.js'
import Aside from '../../container-aside/index.js'
export default {
  name: 'CpisPageContainer',
  componentName: 'CpisPageContainer',
  components: {
    Header,
    Main,
    Footer,
    Aside
  },
  methods: {
    getComponent(name) {
      return {
        header: Header,
        main: Main,
        footer: Footer,
        aside: Aside
      }[name]
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '100%'
    },
    layout: {
      type: Array,
      default: () => ['header', 'main', 'footer']
    }
  }
}
</script>
