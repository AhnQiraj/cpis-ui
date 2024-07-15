<template>
  <span>
    <el-popover ref="pop" v-model="pop" :placement="placement" width="300" trigger="click">
      <div v-if="clearable" class="ibps-clearfix ibps-mb-10">
        <el-button type="info" icon="el-icon-delete" size="mini" class="ibps-fr" @click="selectIcon()"> 清空 </el-button>
      </div>
      <el-input v-model="searchText" :clearable="true" placeholder="搜索 比如 'plus'" prefix-icon="el-icon-search" />
      <el-row class="ibps-icon-svg-select--group">
        <el-col v-for="(item, index) in iconFilted" :key="index" :span="4" class="ibps-icon-svg-select--item" @click.native="selectIcon(item)">
          <ibps-icon-svg :name="item" />
        </el-col>
      </el-row>
    </el-popover>
    <!-- 允许用户输入 -->
    <el-input v-if="userInput" v-model="currentValue" v-bind="bind" style="max-width: 240px">
      <template v-if="value" slot="prepend">
        <ibps-icon-svg :name="value" class="ibps-icon-svg-select--input-preview" />
      </template>
      <el-button slot="append" v-popover:pop>
        <i class="fa fa-list" />
      </el-button>
    </el-input>
    <!-- 不允许用户输入 -->
    <el-button v-if="!userInput" v-popover:pop>
      <span flex="dir:left main:center cross:center">
        <ibps-icon-svg v-if="value" :name="value" class="ibps-icon-svg-select--input-preview ibps-mr-10" />
        <span>{{ value ? value : placeholder }}</span>
      </span>
    </el-button>
  </span>
</template>
<script>
export default {
  name: "IbpsIconSvgSelect",
  props: {
    // 值
    value: {
      type: String,
      required: false,
      default: ""
    },
    // 占位符
    placeholder: {
      type: String,
      required: false,
      default: "请选择"
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
    }
  },
  data() {
    return {
      // 绑定弹出框
      pop: false,
      // 组件内输入框的值
      currentValue: "",
      // 搜索的文字
      searchText: ""
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
    // 是否在搜索
    searchMode() {
      return !!this.searchText
    },
    // 过滤后的图标
    iconFilted() {
      return this.$IconSvg.filter(icon => icon.indexOf(this.searchText) >= 0)
    }
  },
  watch: {
    value(value) {
      this.currentValue = value
    }
  },
  created() {
    this.currentValue = this.value
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
.ibps-icon-svg-select--input-preview {
  height: 14px;
  width: 14px;
  display: block;
}
.ibps-icon-svg-select--group {
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-top: 10px;
}
.ibps-icon-svg-select--item {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 20px;
    width: 20px;
  }
  &:hover {
    background-color: $color-bg;
    border-radius: 4px;
    box-shadow: inset 0px 0px 0px 1px $color-border-1;
  }
}
</style>
