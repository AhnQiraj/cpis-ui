import { CpisContainerHeader } from '../../../packages/cpis-ui/src/index'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/标题',
  component: CpisContainerHeader,
  tags: ['autodocs'],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: { CpisContainerHeader },
      template: `
      <div class="bg-gray-2 p-2">
      <CpisContainerHeader v-bind="$props">
      </CpisContainerHeader>
      </div>
      `
    }
  },
  argTypes: {
    title: {
      description: '标题',
      control: 'string'
    }
  },
  args: {
    title: '这里是标题'
  }
}

export const 标题 = {
  name: 'title',
  parameters: {
    docs: {
      source: {
        code: `
    <template>
      <CpisContainerHeader title="基础信息" columns="1">
      </CpisContainerHeader>
    </template>
`
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisContainerHeader
      },
      template: `
      <div>
        <CpisContainerHeader title="标题" />
      </div>
      `
    }
  }
}

export const CustomRightSlot = {
  name: '自定义右侧内容',
  parameters: {
    docs: {
      source: {
        code: `<template>
  <CpisFormSection title="基础信息" columns="1">
    <template #right>
      右侧内容
    </template>
  </CpisFormSection>
</template>
`
      }
    }
  },
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisContainerHeader
      },
      template: `
      <div>
        <CpisContainerHeader title="这里是标题">
          <template #right>
            右侧内容
          </template>
        </CpisContainerHeader>
      </div>
      `
    }
  }
}
