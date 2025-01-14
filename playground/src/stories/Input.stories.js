import CpisInput from '../../../packages/cpis-ui/src/packages/input/index'
import { Input } from 'element-ui'

/**
 * ## CpisInput 的设计
 * 基于 Element-UI 的 Input 组件进行二次封装。解决了 border 跟随主题色变化，处理可点击事件。
 * 同时降低表格类组件的维护入口


 * ## CpisInput 和 ElInput 的不同
 * - 新增 `clickable` 属性，用于处理可点击事件。
 * - 新增 `bordered` 属性，用于处理无边框。
 * - 修改输入框的样式，使其跟随主题色变化。
 * 
 ## CpisInput Attributes（只列举和Element-UI的不同）
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | clickable  | 是否开启可点击，开启后，默认输入框后面会显示一个图标，点击后会触发 suffix-click 事件 | boolean   | true/false |  false |
  | bordered  | 是否开启无边框，开启后，输入框的边框会消失 | boolean   | true/false |  true |
 ### CpisInput Events （只列举和Element-UI的不同）
  | 事件名      | 说明          | 回调参数      |
  |---------- |---------------- |---------- |
  | suffix-click  | 后缀点击事件 | — |
 */
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/输入框',
  component: CpisInput,
  tags: ['autodocs']
}

export const Clickable = {
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        code: `
<template>
    <CpisInput
        @suffix-click="handleSuffixClick"
        :clickable="true"
        v-model="inputValue"
    />
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    handleSuffixClick() {
      console.log('suffix clicked')
    }
  }
}
</script>
        `
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisInput, ElInput: Input },
      data: () => ({
        inputValue: null,
        inputValue2: null,
        inputValue3: null
      }),
      methods: {
        handleSuffixClick() {
          console.log('handle-suffix-click')
        }
      },
      template: `
        <div class="flex flex-col gap-2">
            大<CpisInput size="large" @suffix-click="handleSuffixClick" clickable v-model="inputValue" />
            中（默认）<CpisInput size="medium" @suffix-click="handleSuffixClick" clickable v-model="inputValue2" />
            小<CpisInput size="small" @suffix-click="handleSuffixClick" clickable v-model="inputValue3" />
        </div>
              `
    }
  },
  name: 'Clickable'
}

export const NoBorder = {
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        code: `
<template>
    <CpisInput :bordered="false" />
</template>
          `
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisInput, ElInput: Input },
      data: () => ({
        inputValue: null,
        inputValue2: null,
        inputValue3: null
      }),
      template: `
          <div class="flex flex-col gap-2">
              大<CpisInput size="large" :bordered="false" v-model="inputValue"/>
              中（默认）<CpisInput size="medium" :bordered="false" v-model="inputValue2" />
              小<CpisInput size="small" :bordered="false" v-model="inputValue3" />
          </div>
                `
    }
  },
  name: 'Bordered'
}
