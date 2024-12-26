<template>
  <CpisPageContainer :layout="['aside', 'main']">
    <div
      class="h-full overflow-hidden flex flex-col transition-all duration-100 overflow-x-hidden"
      :class="{ 'w-[20px]': collapse, 'w-[280px]': !collapse }"
      slot="aside"
    >
      <div
        class="flex items-center h-[46px] border-b-2 border-b-solid border-gray-2"
        :class="{ 'px-0': collapse, 'px-4': !collapse }"
      >
        <span class="text-base font-bold" v-show="!collapse">{{ title }}</span>
        <i
          class="el-icon-d-arrow-left ml-auto cursor-pointer transition-transform duration-300"
          :class="{ 'rotate-180': collapse }"
          @click="handleCollapse"
        />
      </div>
      <div class="p-y-4 p-x-2 flex flex-col gap-2">
        <slot name="search">
          <div class="search-box flex" v-show="!collapse">
            <el-input placeholder="请输入" v-model="searchValue" size="small">
            </el-input>
            <el-dropdown>
              <CpisButton
                type="primary"
                @click="handleSetting"
                icon="el-icon-setting"
              />
              <el-dropdown-menu slot="dropdown" @command="handleCommand">
                <el-dropdown-item command="expandAll"
                  >展开所有</el-dropdown-item
                >
                <el-dropdown-item command="collapseAll">
                  折叠所有
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </slot>
        <CpisTree
          v-show="!collapse"
          :filter-node-method="filterNodeMethod"
          class="flex-1"
          ref="tree"
          v-bind="treeProps"
          v-on="$listeners"
        />
      </div>
    </div>
    <template #main>
      <slot />
    </template>
  </CpisPageContainer>
</template>

<script>
import { Input, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import CpisTree from '../../tree/index'
import CpisPageContainer from '../../page-container/index'
import CpisButton from '../../button/index'
export default {
  name: 'CpisTreeContainer',
  components: {
    CpisTree,
    CpisPageContainer,
    ElInput: Input,
    ElDropdown: Dropdown,
    ElDropdownMenu: DropdownMenu,
    ElDropdownItem: DropdownItem,
    CpisButton
  },
  watch: {
    searchValue(val) {
      this.getTree().filter(val)
    }
  },
  data() {
    return {
      searchValue: '',
      collapse: false
    }
  },
  props: {
    treeProps: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '树容器'
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'expandAll') {
        this.getTree().expandAll()
      } else if (command === 'collapseAll') {
        this.getTree().setExpandedKeys([])
      }
    },
    handleCollapse() {
      this.collapse = !this.collapse
    },
    handleSearch() {
      this.getTree().filter(node => {
        return node.label.includes(this.searchValue)
      })
    },
    filterNodeMethod(query, data) {
      return data.label.indexOf(query) > -1
    },

    getTree() {
      return this.$refs.tree
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-group__append {
  border: none;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
