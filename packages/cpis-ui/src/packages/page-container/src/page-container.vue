<template>
  <multipane
    v-if="layout.includes('aside')"
    class="bg-gray-2 gap-2 p-4 flex flex-row"
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
          <slot :name="item" />
        </component>
        <template v-if="item === 'aside'">
          <multipane-resizer
            class="before:(block content-[''] w-[3px] h-[40px] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-x border-[#ccc] border-x-solid)"
          ></multipane-resizer>
        </template>
      </template>
    </template>
  </multipane>
  <div v-else class="bg-gray-2 gap-2 p-4 flex flex-col" :style="{ height }">
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
          <slot :name="item" />
        </component>
      </template>
    </template>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'

import Header from '../../container-header/index.js'
import Main from '../../container-main/index.js'
import Footer from '../../container-footer/index.js'
import Aside from '../../container-aside/index.js'
export default {
  name: 'PageContainer',
  componentName: 'PageContainer',
  components: {
    Header,
    Main,
    Footer,
    Aside,
    Multipane,
    MultipaneResizer
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
