import CpisTreeContainer from '../../../../packages/cpis-ui/src/packages/tree-container/index.js'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  components: { CpisTreeContainer },
  title: '容器组件/树容器',
  component: CpisTreeContainer,
  tags: ['autodocs'],
  render: (args, { argTypes }) => {
    return {
      props: Object.keys(argTypes),
      components: {
        CpisTreeContainer
      },
      template: `
      <div style="height: 500px; padding: 16px; background-color: #f5f5f5;">
      <CpisTreeContainer :treeProps="treeProps" title="标题">
        <div>主内容</div>
      </CpisTreeContainer>
      </div>
      `
    }
  },
  argTypes: {
    treeProps: {
      description: '树的配置',
      control: 'object'
    }
  },
  args: {
    treeProps: {
      data: [
        {
          id: 1,
          label: '平台业务',
          children: [
            { id: 11, label: '业务分类' },
            { id: 12, label: '终端' },
            { id: 13, label: '服务分类' },
            { id: 14, label: '操作日志类型' },
            { id: 15, label: '日期类型' },
            { id: 16, label: '循环周期' },
            { id: 17, label: '设备技术参数类型' },
            { id: 18, label: '专业编码' },
            { id: 19, label: '计量单位' },
            { id: 110, label: '业务名称' },
            { id: 111, label: '组织机构' }
          ]
        },
        {
          id: 2,
          label: '告警管理',
          children: [{ id: 21, label: '业务告警对应的业务分类' }]
        },
        {
          id: 3,
          label: '人事用户管理',
          children: [
            { id: 31, label: '用户管理' },
            { id: 32, label: '角色管理' },
            { id: 33, label: '权限管理' }
          ]
        },
        {
          id: 4,
          label: '数据维护',
          children: [
            { id: 41, label: '数据字典1' },
            { id: 42, label: '数据字典2' },
            { id: 43, label: '数据字典3' }
          ]
        }
      ]
    }
  }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    title: '标题，主内容和页脚',
    layout: ['header', 'main', 'footer']
  },
  name: ''
}
