<template>
  <div>
    <div>
      <template v-if="enableCommon">
        <template v-if="!disabled && commonStatments && commonStatments.length > 0">
          <el-dropdown placement="bottom-start" @command="handleCommonStatment">
            <el-link class="el-dropdown-link" type="primary" :underline="false"> 常用语<i class="el-icon-arrow-down el-icon--right" /> </el-link>
            <el-dropdown-menu slot="dropdown" style="width: 500px">
              <template v-if="commonStatments && commonStatments.length > 0">
                <template v-for="(item, index) in commonStatments">
                  <el-dropdown-item :key="index" :command="item">{{ item.value }}&nbsp;</el-dropdown-item>
                </template>
                <el-dropdown-item v-if="totalCount > 5" divided command="more">
                  <span class="el-dropdown-link">>>更多...</span>
                </el-dropdown-item>
              </template>
              <template v-else>
                <el-dropdown-item command="none">
                  <span>未设置常用语</span>
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <span v-else class="el-dropdown-link" @click="handleNoData"> 常用语<i class="el-icon-arrow-down el-icon--right" /> </span>
        <!--快捷常用语
         <el-link
        v-for="(shortcut,i) in shortcutTags"
        :key="i"
        :type="shortcut.type"
        @click="handleShortcut(shortcut)"
      >{{ shortcut.label }}</el-link> -->
      </template>
      <div class="ibps-pl-10" style="display: inline-block">
        <el-checkbox v-if="directSign" v-model="directHandlerSign" @change="handleDirectHandlerSign">
          <el-tooltip content="您拥有会签特权，可以对会签任务进行直接处理" placement="bottom">
            <div>特权：直接处理</div>
          </el-tooltip>
        </el-checkbox>
      </div>
    </div>
    <el-input ref="input" v-model="data" type="textarea" rows="4" maxlength="2000" show-word-limit :disabled="disabled" :placeholder="placeholder" />
    <common-statment-dialog :visible="commonStatmentVisible" :title="title" :action="action" label-key="value" @close="visible => (commonStatmentVisible = visible)" @action-event="handleActionEvent" />
  </div>
</template>
<script>
import { isEqual } from 'element-ui/lib/utils/util'
import emitter from 'element-ui/lib/mixins/emitter'
import ActionUtils from '@platform/utils/action'
import CommonStatmentDialog from './common-statment/dialog.vue'
export default {
  name: 'FlowApproveOpinion',
  components: {
    CommonStatmentDialog
  },
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: String
    },
    action: {
      type: String
    },
    enableCommon: {
      type: Boolean,
      default: true
    },
    directSign: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入审批意见'
    }
  },
  data() {
    return {
      commonStatmentVisible: false,
      title: '',
      shortcutTags: [
        {
          type: 'success',
          label: '同意'
        },
        {
          type: 'danger',
          label: '反对'
        },
        {
          type: 'warning',
          label: '拒绝'
        }
      ],
      commonStatments: [],
      directHandlerSign: false,
      totalCount: 0
    }
  },
  computed: {
    data: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        if (!isEqual(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', val)
        }
      },
      immediate: true
    },
    action: {
      handler(val, oldVal) {
        if (this.enableCommon && !this.disabled) {
          this.$nextTick(() => {
            this.loadCommonStatment()
          })
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.shortcutTags = null
    this.commonStatments = null
  },
  methods: {
    loadCommonStatment() {
      this.commonStatments = []
      let action = this.action
      if (action === 'endProcess' || this.action === 'stop') {
        action = 'manualend'
      }
      window.apiList['bpmn/bpmCommonStatment']
        .queryIncludeNull(
          ActionUtils.formatParams(
            {
              'Q^ACTION_^S': action,
              'Q^CREATE_BY_^S': JSON.parse(window.sessionStorage.getItem('INFO')).user.id
            },
            {
              limit: 5
            }
          )
        )
        .then(response => {
          const data = response.data
          this.commonStatments = data.dataResult || []
          this.totalCount = data.pageResult ? data.pageResult.totalCount : 0
        })
    },
    handleShortcut({ label }) {
      if (this.disabled) {
        return
      }
      this.data = label
    },
    handleCommonStatment(command) {
      if (this.disabled) {
        return
      }
      if (this.$utils.isString(command) && command === 'none') {
        return
      }
      if (this.$utils.isString(command) && command === 'more') {
        this.commonStatmentVisible = true
        this.title = '常用语列表'
        return
      }
      this.data = command.value
    },
    handleNoData() {
      ActionUtils.warning('未有更多常用语！')
    },
    getCursorPos(pTextArea) {
      let cursurPosition = -1
      if (pTextArea.selectionStart) {
        // 非IE浏览器
        cursurPosition = pTextArea.selectionStart
      } else {
        // IE
        let range = document.selection.createRange()
        range.moveStart('character', -pTextArea.value.length)
        cursurPosition = range.text.length
      }
      return cursurPosition
    },
    handleActionEvent(key, data) {
      // console.log(key, data)
      if (key === 'confirm') {
        this.data = data.value
        this.commonStatmentVisible = false
      }
    },
    handleDirectHandlerSign(val) {
      this.$emit('direct-handler-sign', val)
    }
  }
}
</script>
