<template>
  <!-- :style="{ height: barHeight}" -->
  <div class="z-toolbar">
    <div class="search-area">
      <div class="search">
        <el-form ref="toolBarForm" :inline="true" :model="model" class="form-toolbar">
          <slot />
        </el-form>
        <vxe-form class="right-tools">
          <vxe-form-item class="toolbar-btns">
            <vxe-button status="primary" icon="el-icon-search" @click="onSearch">{{ $t("common.buttons.search") }}</vxe-button>
            <vxe-button icon="el-icon-refresh" @click="onResetForm">{{ $t("common.buttons.resetSearch") }}</vxe-button>
          </vxe-form-item>
          <vxe-form-item v-if="settingEnable" class="search-btn-area">
            <vxe-button v-if="addEnable && false" type="button" name="userAdd" icon="fa fa-plus" class="add-btn" @click="onAddNew" />
            <vxe-button v-if="$slots.default.length > 3" type="button" name="moreCon" icon="vxe-icon--funnel" class="select-btn" @click="onSwitchSearchCondition" />
            <vxe-button class="more-btn">
              <template #default />
              <template #dropdowns>
                <vxe-button style="width: auto; align: left; padding: 0" @click="onColSet">{{ $t("common.buttons.columnSettings") }}</vxe-button>
              </template>
            </vxe-button>
          </vxe-form-item>
        </vxe-form>
      </div>
    </div>
    <div v-if="optionEnable" class="btns">
      <!-- 一直显示的 -->
      <slot name="alwaysShowBtn" />
      <!-- 选中才显示的 -->
      <template v-if="optionBtnIsShow || true">
        <el-button v-if="addEnable" type="primary" @click="onAddNew">{{ $t('baseCommon.buttons.add', {title: ''}) }}</el-button>
        <el-button v-if="deleteEnable" type="primary" @click="onDelete">{{ $t('baseCommon.buttons.delete') }}</el-button>
        <el-button v-if="updateEnable" type="primary" @click="onUpdate">{{ $t('baseCommon.buttons.update', {title: ''}) }}</el-button>
        <el-button v-if="viewEnable" type="primary" @click="onView">{{ $t('baseCommon.buttons.view') }}</el-button>
        <!-- 选中后扩展的 -->
        <slot name="buttons" />
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "ZToolbar",
  props: {
    // 搜索条件数据
    model: {
      type: Object,
      default() {
        return {}
      }
    },
    // 启用新增
    addEnable: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 启用删除
    deleteEnable: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 启用修改
    updateEnable: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 启用浏览
    viewEnable: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 启用更多查询条件
    addMoreEnable: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 是否启用操作栏
    optionEnable: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 是否启用列设置操作栏
    settingEnable: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      searchIsShow: false, // 当前搜索条件是否显示或隐藏
      optionBtnIsShow: false
    }
  },
  computed: {
    barHeight() {
      if (!this.searchIsShow) {
        return "120px"
      }
      return "180px"
    }
  },
  mounted() {
    this.searchConditionShow(false)
  },
  methods: {
    /**
     * 重置搜索框
     */
    resetFields() {
      this.$refs.toolBarForm.resetFields()
    },
    // 搜索事件
    onSearch() {
      this.$emit("search", this.filterEmptyValue(this.model))
    },
    // 重置搜索条件，会触发搜索事件
    onResetForm() {
      this.$emit("reset")
      this.$refs.toolBarForm.resetFields()
      this.$emit("search", this.filterEmptyValue(this.model))
    },
    filterEmptyValue(obj) {
      let newValue = {}
      for (let key in obj) {
        const val = obj[key]
        if (val === null || val === "" || val === undefined) {
          continue
        }
        newValue[key] = val
      }
      return newValue
    },
    // 搜索大于3个条件显示或隐藏
    searchConditionShow(isShow) {
      const slots = this.$slots["default"]
      if (slots.length > 3) {
        for (let i = 3; i < slots.length; i++) {
          slots[i].elm.style.display = isShow ? "block" : "none"
        }
        this.searchIsShow = isShow
      }
      this.searchIsShow = isShow
    },
    // 切换搜索条件显示或隐藏事件
    onSwitchSearchCondition() {
      this.searchConditionShow(!this.searchIsShow)
    },
    // 省略号事件
    onEllipsis() {
      this.$emit("ellipsis")
    },
    // 列设置
    onColSet() {
      this.$emit("setColumn")
    },
    // 新增事件
    onAddNew() {
      this.$emit("addNew")
    },
    // 修改事件
    onUpdate() {
      this.$emit("update")
    },
    // 删除事件
    onDelete() {
      this.$emit("delete")
    },
    // 浏览事件
    onView() {
      this.$emit("view")
    },
    // 显示操作按钮
    showOptionBtns(isShow) {
      this.optionBtnIsShow = isShow
    }
  }
}
</script>
<style lang="scss">
.form-toolbar {
  .el-form-item__content {
    width: auto !important;
    vertical-align: middle;
  }
  .el-form-item--default {
    margin-bottom: 0;
  }
}
.z-toolbar {
  .search-area {
    float: none;
    padding: 8px;
  }
}
</style>
<style scoped lang="scss">
.z-toolbar {
  padding: 0;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  .search {
    display: flex;
    justify-content: space-between;
    .form-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      flex: 1;
    }
    .right-tools {
      display: flex;
      align-items: center;
      height: 40px;
      i {
        font-size: 24px;
        font-weight: 400;
        color: #909399;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  .btns {
    margin-top: 0px;
    display: flex;
  }
}
</style>
