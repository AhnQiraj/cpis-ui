<template>
  <CpisPageContainer :layout="['aside', 'main']">
    <div
      class="h-full overflow-hidden flex flex-col transition-all duration-100 overflow-x-hidden"
      :class="{ 'w-[20px]': collapse, 'w-[280px]': !collapse }"
      slot="aside"
    >
      <div
        class="border-b-2 border-b-solid border-gray-2"
        :class="{ 'px-0': collapse, 'px-4': !collapse }"
      >
        <span class="text-base font-bold leading-[46px]" v-show="!collapse">{{
          title
        }}</span>
        <i
          class="el-icon-d-arrow-left float-right cursor-pointer transition-transform duration-300 leading-[46px]"
          :class="{ 'rotate-180': collapse }"
          @click="handleCollapse"
        />
      </div>
      <div class="p-y-4 p-x-2 flex flex-col gap-2 flex-1 overflow-hidden">
        <slot name="search">
          <div class="search-box flex" v-show="!collapse">
            <el-input placeholder="请输入" v-model="searchValue" size="small">
            </el-input>
            <el-dropdown @command="handleCommand">
              <CpisButton
                type="primary"
                @click="handleSetting"
                icon="el-icon-setting"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="collapseAll">
                  折叠所有
                </el-dropdown-item>
                <el-dropdown-item command="expandAll">
                  展开所有
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </slot>
        <div class="overflow-auto">
          <CpisTree
            v-show="!collapse"
            :filter-node-method="filterNodeMethod"
            class="flex-1"
            ref="tree"
            v-bind="{
              'expand-on-click-node': false,
              'highlight-current': true,
              ...treeProps
            }"
            v-on="$listeners"
          />
        </div>
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
      if (command === 'collapseAll') {
        // debugger
        // // 获取所有节点数据
        // const nodes = this.getTree().getCheckedNodes(false, true)
        // // 遍历所有节点并展开
        // nodes.forEach(node => {
        //   this.getTree().setChecked(node, true)
        // })
        this.getTree().collapseAll()
      } else if (command === 'expandAll') {
        this.getTree().expandAll()
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
