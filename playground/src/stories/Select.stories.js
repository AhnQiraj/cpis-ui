/**
 * ## CpisSelect 的设计
 * 基于 Element-UI 的 Select 组件进行二次封装。解决了 border 跟随主题色变化和处理可点击事件。
 * 同时降低表格类组件的维护入口


 * ## CpisSelect 和 ElSelect 的不同
 * - 新增 `clickable` 属性，用于处理可点击事件。
 * - 新增 `bordered` 属性，用于处理无边框。
 * - 修改输入框的样式，使其跟随主题色变化。
 * 
 ## CpisSelect Attributes（只列举和Element-UI的不同）
  | 参数      | 说明          | 类型      | 可选值                           | 默认值  |
  |---------- |---------------- |---------- |--------------------------------  |-------- |
  | clickable  | 是否开启可点击，开启后，默认输入框后面会显示一个图标，点击后会触发 suffix-click 事件 | boolean   | true/false |  false |
  | bordered  | 是否开启无边框，开启后，输入框的边框会消失 | boolean   | true/false |  true |
 ### CpisSelect Events （只列举和Element-UI的不同）
  | 事件名      | 说明          | 回调参数      |
  |---------- |---------------- |---------- |
  | suffix-click  | 后缀点击事件 | — |
 */
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/选择框',
  tags: ['autodocs']
}

export const Clickable = {
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        code: `
<template>
    <CpisSelect
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
      data: () => ({
        inputValue: null,
        inputValue2: null,
        inputValue3: null,
        selectOptions: [
          {
            value: '1',
            label: '选项'
          }
        ]
      }),
      methods: {
        handleSuffixClick() {
          console.log('handle-suffix-click')
        }
      },
      template: `
        <div class="flex flex-col gap-2">
            大
            <CpisSelect size="large" @suffix-click="handleSuffixClick" clickable v-model="inputValue">
                <ElOption v-for="option in selectOptions" :key="option.value" :value="option.value" :label="option.label">选项</ElOption>
            </CpisSelect>
            中（默认）
            <CpisSelect size="medium" @suffix-click="handleSuffixClick" clickable v-model="inputValue2">
                <ElOption v-for="option in selectOptions" :key="option.value" :value="option.value" :label="option.label">选项</ElOption>
            </CpisSelect>   
            小
            <CpisSelect size="small" @suffix-click="handleSuffixClick" clickable v-model="inputValue3">
                <ElOption v-for="option in selectOptions" :key="option.value" :value="option.value" :label="option.label">选项</ElOption>
            </CpisSelect>
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
    <CpisSelect :bordered="false" />
</template>
          `
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      data: () => ({
        inputValue: null,
        inputValue2: null,
        inputValue3: null
      }),
      template: `
          <div class="flex flex-col gap-2">
              大<CpisSelect size="large" :bordered="false" v-model="inputValue"/>
              中（默认）<CpisSelect size="medium" :bordered="false" v-model="inputValue2" />
              小<CpisSelect size="small" :bordered="false" v-model="inputValue3" />
          </div>
                `
    }
  },
  name: 'Bordered'
}
