<template>
  <div class="cpis-table-toolbar">
    <template v-for="item in hasPermissionToolbar.slice(0, 6)">
      <el-dropdown
        v-if="Array.isArray(item.children) && item.children.length > 0"
        @command="handleToolbarClick"
        :key="item.key"
      >
        <CpisButton :type="item.type">
          {{ item.label }}
          <i class="el-icon-arrow-down el-icon--right" />
        </CpisButton>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :key="`dropdown-item-${item.key}`"
            v-for="item in item.children"
            :command="item.key"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <CpisButton
        v-else
        :key="`button-${item.key}`"
        @click="handleToolbarClick(item.key)"
        v-bind="item"
      >
        {{ item.label }}
      </CpisButton>
    </template>
    <el-dropdown
      v-if="hasPermissionToolbar.length > 6"
      @command="handleToolbarClick"
    >
      <CpisButton type="text">更多</CpisButton>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in hasPermissionToolbar.slice(6)"
          :command="item.key"
          :key="item.key"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import PermissionMixin from '../../../mixins/permission'
import CpisButton from '../../button/index'

export default {
  name: 'CpisToolbar',
  mixins: [PermissionMixin],
  components: {
    ElDropdown: Dropdown,
    ElDropdownMenu: DropdownMenu,
    ElDropdownItem: DropdownItem,
    CpisButton
  },
  props: {
    toolbar: {
      type: Array,
      default: () => [],
      comments: '工具栏按钮'
    },
    identity: {
      type: String,
      default: '',
      comments: '权限标识'
    }
  },
  computed: {
    hasPermissionToolbar() {
      return this.toolbar
        .map(item => {
          const newItem = { ...item }
          // 处理 disabled 属性，支持函数和布尔值
          if (typeof item.disabled === 'function') {
            newItem.disabled = item.disabled()
          }

          const children = Array.isArray(item.children) ? item.children : typeof item.children === 'function' ? item.children() : []
          // 如果有子菜单，处理子菜单的 disabled
          if (children.length > 0) {
            newItem.children = children.map(child => ({
              ...child,
              disabled:
                typeof child.disabled === 'function'
                  ? child.disabled()
                  : child.disabled
            }))
          }

          return newItem
        })
        .filter(item => this.hasPermission(this.getPermissionKey(item)))
    }
  },
  methods: {
    /**
     * 工具栏点击事件
     * @param {Object} key 工具栏按钮
     */
    handleToolbarClick(key) {
      this.$emit('handleToolbarClick', key)
    }
  }
}
</script>
<style>
.cpis-table-toolbar .el-button + .el-button {
  margin-left: 0px;
}
.cpis-table-toolbar {
  @apply flex flex-row items-center gap-2;
}
</style>
