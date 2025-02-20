export default {
  title: '原子组件/TagGroupoup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '标签组'
      }
    }
  }
}

// 基础用法
export const Basic = () => ({
  data() {
    return {
      data: [
        {
          id: 1,
          name: 'Tag 1'
        },
        {
          id: 2,
          name: 'Tag 2'
        },
        {
          id: 3,
          name: 'Tag 3'
        }
      ]
    }
  },
  template: `<cpis-tag-group :data.sync="data" closable/>`
})
