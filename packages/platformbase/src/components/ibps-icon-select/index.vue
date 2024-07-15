<template>
  <span>
    <el-popover ref="pop" v-model="pop" :placement="placement" width="300" trigger="click">
      <template v-if="pop">
        <el-row v-if="clearable" type="flex" justify="end" class="ibps-mb-10">
          <el-button type="danger" icon="el-icon-delete" size="mini" class="ibps-fr" @click="selectIcon()"> 清空 </el-button>
        </el-row>
        <el-input v-model="searchText" :clearable="true" placeholder="搜索 比如 'logo'" prefix-icon="el-icon-search" />
        <el-collapse v-if="!searchMode" v-model="collapseActive" class="ibps-iconselect--group">
          <el-collapse-item v-for="(item, index) in fontIcon" :key="index" :title="item.title" :name="index" class="ibps-iconselect--class">
            <el-row class="ibps-iconselect--class-row">
              <el-col v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" class="ibps-iconselect--class-col" :span="4" @click.native="selectIcon(iconName)">
                <i :class="'ibps-icon ibps-icon-' + iconName" />
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <div v-if="searchMode" class="ibps-iconselect--group">
          <div v-for="(item, index) in iconFilted" :key="index" class="ibps-iconselect--class">
            <div class="ibps-iconselect--class-title">{{ item.title }}</div>
            <el-row class="ibps-iconselect--class-row">
              <el-col v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" class="ibps-iconselect--class-col" :span="4" @click.native="selectIcon(iconName)">
                <i :class="'ibps-icon ibps-icon-' + iconName" />
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 允许用户输入 -->
    <el-input v-if="userInput" v-model="currentValue" v-bind="bind" style="max-width: 240px">
      <template v-if="value" slot="prepend">
        <i :class="'ibps-icon ibps-icon-' + value" />
      </template>
      <el-button slot="append" v-popover:pop>
        <i class="ibps-icon ibps-icon-list" />
      </el-button>
    </el-input>
    <!-- 不允许用户输入 -->
    <el-button v-if="!userInput" v-popover:pop>
      <template v-if="value">
        <i :class="'ibps-icon ibps-icon-' + value" />
      </template>
      {{ value ? (showLabel ? value : "") : placeholder }}
    </el-button>
  </span>
</template>
<script>
import fontIcon from "./data/index"
import Emitter from "element-ui/lib/mixins/emitter"
import { isEqual } from "element-ui/lib/utils/util"
export default {
  name: "IbpsIconSelect",
  mixins: [Emitter],
  props: {
    // 值
    value: {
      type: String,
      required: false,
      default: ""
    },
    data: {
      type: Object
    },
    // 占位符
    placeholder: {
      type: String,
      required: false,
      default: "请选择"
    },
    icon: {
      type: String,
      default: 'el-icon-search"'
    },
    // 弹出界面的方向
    placement: {
      type: String,
      required: false,
      default: "right"
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否允许用户输入
    userInput: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否在选择后自动关闭
    autoClose: {
      type: Boolean,
      required: false,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 绑定弹出框
      pop: false,
      // 组件内输入框的值
      currentValue: "",
      // 搜索的文字
      searchText: "",
      // 不是搜索的时候显示的折叠面板绑定的展开数据
      collapseActive: []
      // collapseActive: [...Array(icon.length)].map((e, i) => i)
    }
  },
  computed: {
    // 输入框上绑定的设置
    bind() {
      return {
        placeholder: this.placeholder,
        clearable: this.clearable,
        ...this.$attrs
      }
    },
    fontIcon() {
      return this.data ? this.data : fontIcon
    },
    // 是否在搜索
    searchMode() {
      return !!this.searchText
    },
    // 过滤后的图标
    iconFilted() {
      return this.fontIcon
        .map(iconClass => ({
          title: iconClass.title,
          icon: iconClass.icon.filter(icon => icon.indexOf(this.searchText) >= 0)
        }))
        .filter(iconClass => iconClass.icon.length > 0)
    }
  },
  watch: {
    value(value, oldVal) {
      this.currentValue = value
      if (!isEqual(value, oldVal)) {
        this.dispatch("ElFormItem", "el.form.change", value)
      }
    }
  },
  created() {
    this.currentValue = this.value
  },
  beforeDestroy() {
    this.collapseActive = null
  },
  methods: {
    selectIcon(iconName = "") {
      this.$emit("input", iconName)
      if (iconName && this.autoClose) {
        this.pop = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@platform/assets/styles/public.scss";
.ibps-iconselect--group {
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  border-top: none;
  border-bottom: none;
  .ibps-iconselect--class {
    .ibps-iconselect--class-title {
      line-height: 30px;
      text-align: center;
      background-color: $color-bg;
      border-radius: 4px;
      margin: 10px 0px;
    }
    .ibps-iconselect--class-row {
      .ibps-iconselect--class-col {
        line-height: 40px;
        text-align: center;
        color: $color-text-sub;
        &:hover {
          color: $color-text-main;
          background-color: $color-bg;
          border-radius: 4px;
          font-size: 26px;
          box-shadow: inset 0px 0px 0px 1px $color-border-1;
        }
      }
    }
  }
}
</style>
