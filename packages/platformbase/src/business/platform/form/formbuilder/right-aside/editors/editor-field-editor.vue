<template>
  <div class="panel panel-default toolbars-panel">
    <div class="panel-heading">工具栏选项</div>
    <div class="panel-body">
      <el-button style="width:100%;" type="primary" @click="settingToolbars()">工具栏设置</el-button>
      <table class="el-table el-table--border ueidtor-builder">
        <template v-for="(tool,i) in toolbars">
          <tr v-if="i%5 === 0" :key="i">
            <td v-for="j in (i+5>toolbars.length?(toolbars.length-1)%5+1:5) " :key="j">
              <i :class="toolbars[i+j-1]==='|'?'separate':toolbars[i+j-1]" class="edui-icon " />
            </td>
          </tr>
        </template>
      </table>
    </div>
    <toolbars-setting
      :visible="dialogVisible"
      :toolbars="toolbars"
      @close="visible => dialogVisible = visible"
      @callback="callback"
    />
  </div>
</template>
<script>
import '@platform/assets/styles/ueditor/UBuilder.scss'
import { defaultToolbars } from '@platform/business/platform/form/constants/fieldOptions'
import ToolbarsSetting from '../components/toolbars-setting'
import EditorMixin from '../mixins/editor'
export default {
  components: {
    ToolbarsSetting
  },
  mixins: [EditorMixin],
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    toolbars: {
      get() {
        return this.fieldOptions.toolbars || defaultToolbars
      },
      set(value) {
        this.fieldOptions.toolbars = value
      }
    }
  },
  methods: {
    settingToolbars() {
      this.dialogVisible = true
    },
    callback(data) {
      this.toolbars = data
    }
  }
}
</script>
<style lang="scss">
</style>
