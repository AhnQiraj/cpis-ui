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
export const Defaulta = {
  name: '这里是标题'
}
