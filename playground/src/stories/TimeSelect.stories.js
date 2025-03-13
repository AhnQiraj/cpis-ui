/**
 *
 * CPIS DatePicker 是一个基于 element-ui 的日期选择器组件，除了统一解决了一下的样式问题外，其余和 Element-ui 的 DatePicker 组件一致。
 * 1. 日期图标位置放在后面，当存在清楚图标时候，隐藏日期图标
 * 2. 调整了输入框的 padding-left 为 10px
 * 3. border 会随着主题色变更而变更
 * 更多详情请参考 [DatePicker](https://element.eleme.cn/#/zh-CN/component/date-picker)

 **/
export default {
  title: '原子组件/时间选择器',
  tags: ['autodocs'],
  args: {
    size: 'default'
  },
  render: (args, { argTypes }) => {
    return {
      data() {
        return {
          value: ''
        }
      },
      template: `
        <template>
          <CpisTimeSelect v-model="value" type="date" clearable />
          <CpisTimeSelect v-model="value" type="date" clearable />
          <CpisTimeSelect v-model="value" type="date" clearable />
        </template>
      `
    }
  }
}

// 基础日期选择器
export const Basic = () => ({
  template: `
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h3 class="text-gray-600 font-medium">日期选择器</h3>
        <div class="flex items-center gap-2">
          <div class="w-16 text-gray-500">小号</div>
          <CpisTimeSelect :bordered="false" size="small" v-model="value"  clearable />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-16 text-gray-500">中号</div>
          <CpisTimeSelect :bordered="false" size="medium" v-model="value"  clearable />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-16 text-gray-500">大号</div>
          <CpisTimeSelect :bordered="false" size="large" v-model="value" clearable />
        </div>
      </div>


      <div class="flex flex-col gap-2">
        <h3 class="text-gray-600 font-medium">日期范围选择器</h3>
        <div class="flex items-center gap-2">
          <div class="w-16 text-gray-500">小号</div>
          <CpisTimeSelect :bordered="false" size="small" v-model="value" clearable />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-16 text-gray-500">中号</div>
          <CpisTimeSelect :bordered="false" size="medium" v-model="value"  clearable />
        </div>
        <div class="flex items-center gap-2">
          <div class="w-16 text-gray-500">大号</div>
          <CpisTimeSelect :bordered="false" size="large" v-model="value" clearable />
        </div>
      </div>
      </div>
    </div>
  `,
  data() {
    return {
      value: ''
    }
  }
})
