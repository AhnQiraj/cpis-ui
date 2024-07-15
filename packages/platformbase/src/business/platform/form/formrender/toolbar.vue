<template>
  <ibps-affix v-if="(actions && actions.length >0) || hasStepButton" ref="affix" :offset-top="offsetTop" :offset-bottom="offsetBottom" :mode="mode" :class="formToolbarClass" :style="formToolbarStyle" class="ibps-form-toolbar hidden-print">
    <div :class="['ibps-form-toolbar--' +$ELEMENT.size,mode === 'dialog' && !isTop?'ibps-form-toolbar--dialog':null ]" class="ibps-form-toolbar__buttons">
      <div v-if="hasPrevStepButton " class="buttons ibps-pr-10 ibps-fl-important">
        <el-button v-for="button in prevStepButtons" :key="button.key" :size="button.size||size" :icon="'ibps-icon-'+button.icon" :autofocus="false" :disabled="disabledStepButton(button.key)" :loading="stepLoading" @click="()=>{ handleStepButtonEvent(button)}">{{ button.label }}
        </el-button>
      </div>
      <ibps-toolbar ref="toolbar" :actions="actions" style="flex: 1;" :class="toolbarClass" @action-event="handleActionEvent" />
      <template v-if="hasStepButton">
        <div class="buttons ibps-fr-important ibps-pl-5" :class="isTop?'ibps-pr-25':'ibps-pr-10'">
          <el-button v-for="button in newStepButtons" :key="button.key" :size="button.size||size" :icon="'ibps-icon-'+button.icon" :autofocus="false" :disabled="disabledStepButton(button.key)" :loading="stepLoading" @click="()=>{ handleStepButtonEvent(button)}">{{ button.label }}
          </el-button>
        </div>
      </template>
    </div>
  </ibps-affix>
</template>
<script>
import ActionUtils from '@platform/utils/action'
import IbpsAffix from '@platform/components/ibps-affix'
export default {
  components: {
    IbpsAffix
  },
  props: {
    /**
     * @description 按钮位置
     */
    buttonPosition: {
      type: String
    },
    size: {
      type: String
    },
    /**
     * @description 工具栏
     */
    actions: {
      type: Array
    },
    mode: String,
    width: [Number, String],
    marginTop: {
      type: [Number, String]
    },
    offsetTop: Number,
    offsetBottom: Number,
    /**
     *  @description 步骤条按钮
     */
    stepButtons: {
      type: Array
    },
    curActiveStep: {
      type: Number
    },
    stepNum: {
      type: Number
    }
  },
  data() {
    return {
      curTime: new Date().getTime(),
      stepLoading: false
    }
  },
  computed: {
    isTop() {
      return this.judgePosition('top', false)
    },
    isCenter() {
      return this.judgePosition('center')
    },
    formToolbarClass() {
      return this.$utils.isNotEmpty(this.buttonPosition) ? this.judgePosition('Left') ? 'ibps-tl' : this.judgePosition('Right') ? 'ibps-tr' : 'ibps-tc' : 'ibps-tl'
    },
    formToolbarStyle() {
      const style = {
        width: this.width || '100%'
      }
      if (this.mode === 'default') {
        return style
      } else if (this.mode === 'dialog') {
        style.position = 'fixed'
        return style
      } else {
        style.position = 'fixed'
      }
      if (this.isTop) {
        style.top = 0
      } else {
        style.bottom = 70
      }
      return style
    },
    toolbarClass() {
      if (this.hasStepButton) {
        return null
      }
      return this.isTop && this.judgePosition('Right') ? 'ibps-pr-25' : null
    },
    hasStepButton() {
      return this.$utils.isNotEmpty(this.stepButtons)
    },
    hasPrevStepButton() {
      return this.hasStepButton && this.isCenter && this.$utils.isNotEmpty(this.prevStepButtons)
    },
    prevStepButtons() {
      return this.getStepButtonByKey('prev')
    },
    nextStepButtons() {
      return this.getStepButtonByKey('next')
    },
    newStepButtons() {
      if (!this.isCenter) {
        return this.stepButtons
      } else {
        return this.$utils.isNotEmpty(this.nextStepButtons) ? this.nextStepButtons : []
      }
    }
  },
  watch: {
    actions: {
      handler(val, oldVal) {
        this.actions = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updatePosition() {
      return this.$refs.affix.updatePosition()
    },
    judgePosition(position, defaultVal = false) {
      return this.$utils.isNotEmpty(this.buttonPosition) ? this.buttonPosition.includes(position) : defaultVal
    },
    handleActionEvent(actionKey, args = {}) {
      this.$emit('action-event', actionKey, args)
    },
    /**
     * 获取表单验证
     */
    validate(callback) {
      this.$emit('validate', callback)
    },
    // 处理表单提交验证
    formSubmitVerify(callback) {
      this.$emit('form-submit-verify', callback)
    },
    /**
     * 获取审批意见验证
     */
    formOpinionValidate(callback) {
      this.$emit('form-opinion-validate', callback)
    },
    formErrorToast(msg) {
      ActionUtils.saveErrorMessage(msg)
    },
    disabledStepButton(key) {
      if (key === 'prev') {
        return this.curActiveStep === 0
      } else {
        return this.stepNum - 1 === this.curActiveStep
      }
    },
    getStepButtonByKey(key) {
      if (!this.hasStepButton) {
        return null
      }
      const buttons = []
      for (let i = 0; i < this.stepButtons.length; i++) {
        const button = this.stepButtons[i]
        if (button.key === key) {
          buttons.push(button)
          return buttons
        }
      }
    },
    handleStepButtonEvent({ key }) {
      if (key === 'next' && this.curActiveStep === this.stepNum - 1) {
        ActionUtils.warning('没有更多')
        return
      }
      if (key === 'prev' && this.curActiveStep === 0) {
        ActionUtils.warning('没有上一步')
        return
      }
      this.stepLoading = true
      const curDate = new Date().getTime()
      let time = 0
      if (this.curTime + 1500 >= curDate) {
        time = 1000
      }
      this.curTime = curDate
      setTimeout(() => {
        if (key === 'next') {
          this.validate((valid) => {
            if (valid) {
              this.$emit('step-event', this.curActiveStep + 1)
            } else {
              this.formErrorToast()
            }
          })
        } else {
          this.$emit('step-event', this.curActiveStep - 1)
        }
        this.stepLoading = false
      }, time)
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-pr-25 {
  padding-right: 25px !important;
}
.ibps-form-toolbar {
  box-sizing: border-box;
  z-index: 2000;
  .ibps-form-toolbar__buttons {
    /*background-color: #f5f5f7;*/
    /*border: 1px solid #e6e6e6;*/
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }
  .ibps-form-toolbar--dialog {
    background-color: #ffffff;
  }
  .el-button + .el-button {
    margin-left: 5px;
  }
}
@media print {
  .hidden-print {
    padding: 0;
    margin: 0;
  }
}
</style>
