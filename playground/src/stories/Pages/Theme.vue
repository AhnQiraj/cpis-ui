<template>
  <div class="flex flex-col gap-4">
    <div class="bg-gray-2 p-4">
        <ElSelect @change="onThemeChange" placeholder="请选择主题">
            <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
    </div>
    <CpisTable v-bind="$props" :columns="columns" :data="data">
    <template #toolbar>
      <CpisButton type="primary">新增</CpisButton>
      <CpisButton>修改</CpisButton>
      <CpisButton>删除</CpisButton>
    </template>
  </CpisTable>
  </div>
</template>

<script>
import CpisTable from '../../../../packages/cpis-ui/src/packages/table/index'
import CpisButton from '../../../../packages/cpis-ui/src/packages/button/index'
import { Select, Option } from 'element-ui'

export default {
  name: 'my-page',
  components: { CpisTable, CpisButton, ElSelect: Select, ElOption: Option },
  data() {
    return {
      options: [
        {
          label: '科技蓝',
          value: 'theme-cpisblue'
        },
        {
          label: '翡翠绿',
          value: 'theme-cpis-green'
        },
        {
          label: '中国红',
          value: 'theme-cpis-red'
        },
        {
          label: '活力橙',
          value: 'theme-cpis-orange'
        },
        {
          label: '中性灰',
          value: 'theme-cpis-gray'
        }
      ],
      columns: [
        {
          label: '序号',
          prop: 'id',
          type: 'index',
          width: '100px'
        },
        {
          label: '姓名',
          prop: 'name',
          valueType: 'text',
          width: '100px',
          search: {
            label: '姓名',
            placeholder: '请输入姓名'
          }
        },
        {
          label: '年龄',
          prop: 'age',
          valueType: 'number',
          width: '100px',
          search: {
            label: '年龄',
            placeholder: '请输入年龄'
          }
        },
        {
          label: '工龄',
          prop: 'workAge',
          valueType: 'number',
          width: '100px',
          search: {
            label: '工龄',
            placeholder: '请输入工龄'
          }
        }
      ],
      data: [
        {
          id: 1,
          name: '张三',
          age: 18,
          workAge: 1
        },
        {
          id: 2,
          name: '李四',
          age: 20,
          workAge: 1
        },
        {
          id: 3,
          name: '王五',
          age: 22,
          workAge: 3
        },
        {
          id: 4,
          name: '赵六',
          age: 24,
          workAge: 5
        },
        {
          id: 5,
          name: '孙七',
          age: 26
        },
        {
          id: 6,
          name: '周八',
          workAge: 9
        }
      ]
    }
  },

  methods: {
    onThemeChange(value) {
      document.body.classList.remove('theme-cpisblue', 'theme-cpis-green', 'theme-cpis-red', 'theme-cpis-orange', 'theme-cpis-gray')
      document.body.classList.add(value)
    },
    onLogin() {
      this.user = { name: 'Jane Doe' }
    },
    onLogout() {
      this.user = null
    },
    onCreateAccount() {
      this.user = { name: 'Jane Doe' }
    }
  }
}
</script>
