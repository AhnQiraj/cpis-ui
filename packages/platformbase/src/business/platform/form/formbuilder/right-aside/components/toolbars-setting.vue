<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="toolbars-setting-dialog"
    top="5vh"
    width="60%"
    append-to-body
    @close="closeDialog"
  >
    <div v-if="dialogVisible" class="ueidtor-builder ">
      <div id="toolbarsSection" class="section">
        <h3>工具栏(双击图标可以添加(或删除)，拖动图标可以排序；双击TAB标签可以添加该标签下的功能)</h3>
        <div id="J_funAll" class="funAll config">
          <div id="J_funSelect" class="funSelect">
            <div id="J_selectHead" class="selectHead" />
            <div id="J_selectBody" class="selectBody" />
          </div>
          <div class="funTip">
            <span id="J_funCount" class="funCount" />
            <span id="J_fullScreenTip" style="display: none">(全屏按钮将始终处于工具栏右上角)</span>
            <span id="J_delFun" name="减少一行" class="delFun">减少一行</span>
            <span id="J_addFun" name="增加一行" class="addFun">增加一行</span>
            <span id="J_clearFun" class="clearFun">清空选择</span>
            <span id="J_addAllFun" class="addAllFun">选择全部</span>
          <!-- <span id="J_addSeparate" name="增加分割线" class="addSeparate">|</span> -->
          </div>
          <div id="J_dragCon" class="section dragCon" />
        </div>
      </div>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import '@platform/assets/styles/ueditor/UBuilder.scss'
// 分割符有问题
import UBuilder from './uedit-builder/UBuilder.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '工具栏设置'
    },
    toolbars: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      dialogVisible: false,
      actions: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.$nextTick(() => {
            UBuilder.main.init(JSON.parse(JSON.stringify(this.toolbars)))
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    handleConfirm() {
      const tools = UBuilder.main._getToolsByOrder()
      const data = []
      tools.forEach((d) => {
        d.map((o) => {
          data.push((o === 'separate') ? '|' : o)
        })
      })
      this.$emit('callback', data)
      this.closeDialog()
    }
  }
}
</script>
