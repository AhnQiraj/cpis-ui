<template>
  <div class="cpis-table-toolbar">
    <template v-for="item in hasPermissionToolbar.slice(0, 6)">
      <template v-if="hasPermission(getPermissionKey(item))">
        <el-dropdown
          v-if="Array.isArray(item.children) && item.children.length > 0"
          @command="handleToolbarClick"
        >
          <CpisButton :type="item.type">
            {{ item.label }}
            <i class="el-icon-arrow-down el-icon--right" />
          </CpisButton>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in item.children" :command="item.key">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <CpisButton
          v-else
          :key="item.key"
          @click="handleToolbarClick(item.key)"
          v-bind="item"
        >
          {{ item.label }}
        </CpisButton>
      </template>
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
      return this.toolbar.filter(item =>
        this.hasPermission(this.getPermissionKey(item))
      )
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

<style scoped>
.cpis-table-toolbar {
  @apply flex flex-row items-center;
}
/* 解决按钮和下拉菜单之间的间距 */
::v-deep .el-button + .el-dropdown,
::v-deep .el-dropdown + .el-button {
  margin-left: 10px;
}
</style>
