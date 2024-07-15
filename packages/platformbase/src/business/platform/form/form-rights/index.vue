<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
    top="3vh"
    class="rigths-dialog"
    append-to-body
    @close="closeDialog"
  >
    <span slot="title">
      <label style="font-size:18px;">{{ title }}</label>
      <i class="el-icon-warning" style="font-size:12px;margin-left:5px;color:#E6A23C;">如果同时设置只读、编辑、必填、隐藏，则以隐藏为准。</i>
    </span>
    <div>
      <table v-loading="dialogLoading" width="100%" class="table" :element-loading-text="$t('common.loading')">
        <colgroup>
          <col v-for="(v,i) in rigthGroup" :key="i" :style="{width:`${100/rigthGroup.length}%`}">
        </colgroup>
        <thead>
          <tr class="table-header">
            <th v-for="(v,i) in rigthGroup" :key="i">
              {{ v.label }}
            </th>
          </tr>
          <tr class="table-buttons">
            <td v-for="(rigth,rigthIndex) in rigthGroup" :key="rigthIndex" align="center">
              <el-button
                v-for="(button,buttonIndex) in rigth.buttonGroup"
                :key="buttonIndex"
                :type="button.type"
                size="mini"
                @click="buttonActions(button,rigthGroup,rigthIndex,buttonIndex,button.key)"
              >{{ button.label }}</el-button>
            </td>
          </tr>
        </thead>
      </table>
    </div>
    <div style="max-height:668px;overflow-y: auto;">
      <table width="100%" class="table">
        <colgroup>
          <col v-for="(v,i) in rigthGroup" :key="i" :style="{width:`${100/rigthGroup.length}%`}">
        </colgroup>
        <tbody v-for="(table,i) in rightsFormData" :key="i" class="table-body" :class="'isMain-'+table.isMain">
          <!-- 为主表时 -->
          <tr v-if="table.isMain==='Y'">
            <td :colspan="rigthGroup.length" class="main-head">
              <span class="title">{{ table.label }}</span>
            </td>
          </tr>
          <!-- 为子表时 -->
          <template v-if="table.isMain==='N'">
            <!-- 子表权限 -->
            <tr class="sublist-head">
              <td>&nbsp;&nbsp;
                <el-tag class="tag">{{ 'table'|optionsFilter(controlTypes,'label') }}</el-tag>
                <span class="title">{{ table.label }}</span>
              </td>
              <td v-for="sublistRightsType in rightsList" :key="sublistRightsType" class="tr-list-td">
                <div v-if="table[sublistRightsType]" class="settings">
                  <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit',sublistRightsType,table,table.name)" />
                  <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset',sublistRightsType,table,table.name)" />
                </div>
                <rights-label
                  :value="table[sublistRightsType]"
                  :name="table.name"
                  :type-key="sublistRightsType"
                  :item="table"
                  @remove="handleRemove"
                />
              </td>
            </tr>
            <!-- 子表按钮 -->
            <tr class="sublist-body">
              <td :colspan="rigthGroup.length">
                <table>
                  <thead>
                    <tr>
                      <th>按钮权限</th>
                      <th>显示权限</th>
                    </tr>
                  </thead>
                  <tbody v-if="table.buttons&&table.buttons.length>0">
                    <tr v-for="(button,j) in table.buttons" :key="j">
                      <td>
                        <el-tag class="tag">{{ button.type|optionsFilter(subButtonTypeOptions,'label') }}</el-tag>
                        {{ button.label }}
                      </td>
                      <td>
                        <div v-if="button['show']" class="settings">
                          <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit','read',button,table.name)" />
                          <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset','read',button,table.name)" />
                        </div>
                        <rights-label :value="button.show" :name="table.name" :item="button" @remove="handleRemove" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
          <!-- 权限列表 -->
          <tr v-for="(field,l) in table.fields" :key="l" class="tr-list">
            <td>
              <el-tag>{{ field.field_type|optionsFilter(controlTypes,'label') }}</el-tag>
              {{ field.label }}
            </td>
            <td v-for="rightsType in getRightsList(field)" :key="rightsType" class="tr-list-td">
              <div v-if="field[rightsType]" class="settings">
                <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit',rightsType,field,table.name)" />
                <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset',rightsType,field,table.name)" />
              </div>
              <rights-label :value="field[rightsType]" :name="table.name" :type-key="rightsType" :item="field" @remove="handleRemove" />
            </td>
          </tr>
        </tbody>
        <!-- 审批意见 -->
        <tfoot v-if="opinion && opinion.length >0" class="table-tfoot">
          <tr>
            <td :colspan="rigthGroup.length">
              <h4 class="title">流程意见</h4>
            </td>
          </tr>
          <tr v-for="(field,n) in opinion" :key="n" class="tr-list">
            <td>{{ field.label }}</td>
            <td v-for="opinionRightsType in getRightsList(field)" :key="opinionRightsType" class="tr-list-td">
              <div v-if="field[opinionRightsType]" class="settings">
                <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit',opinionRightsType,field,'opinion')" />
                <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset',opinionRightsType,field,'opinion')" />
              </div>
              <rights-label
                :value="field[opinionRightsType]"
                :type-key="opinionRightsType"
                name="opinion"
                :item="field"
                @remove="handleRemove"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
    </div>
    <rights-config
      :visible="dialogRightsVisible"
      :data="rightsTypeList"
      title="表单授权"
      @callback="handleRightsConfirm"
      @close="visible => dialogRightsVisible = visible"
    />
  </el-dialog>
</template>
<script>
import {
  savePermission,
  resetRights,
  // resetFlowPermission,
  saveFlowPermission
} from '@platform/api/platform/form/formRights'
import { rigthGroup, tableFieldTypes } from './constants'
import { subButtonTypeOptions } from '@platform/business/platform/form/constants/tableButtonTypes'
import ActionUtils from '@platform/utils/action'
import RightsConfig from '@platform/business/platform/rights/config'
import RightsLabel from '@platform/business/platform/rights/config/label'
import getData from './mixin/getData'
import buttonControl from './mixin/buttonControl'
export default {
  components: {
    RightsConfig,
    RightsLabel
  },
  mixins: [getData, buttonControl],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    type: {
      type: String,
      default: 'form'
    }
  },
  data() {
    return {
      rigthGroup: rigthGroup,
      rigthsTypes: [],
      subButtonTypeOptions: subButtonTypeOptions,
      controlTypes: tableFieldTypes,
      dialogVisible: this.visible,
      dialogRightsVisible: false,
      dialogLoading: false,
      default: [],
      rightsFormData: [], // 表单权限列表数据
      rightsFields: '',
      rightsList: ['read', 'edit', 'required', 'hide'],
      opinion: [], // 审批意见
      formParams: {}, // 编辑传递的单格详细数据
      rightsTypeList: []
    }
  },
  computed: {
    toolbars() {
      let toolbars = []
      if (this.isSave) {
        toolbars = [{
          key: 'save'
        },
        {
          key: 'undo',
          icon: 'ibps-icon-undo',
          type: 'success',
          label: '重置'
        },
        {
          key: 'cancel'
        }
        ]
      } else {
        toolbars = [{
          key: 'confirm'
        },
        {
          key: 'undo',
          icon: 'ibps-icon-undo',
          type: 'success',
          label: '重置'
        },
        {
          key: 'cancel'
        }
        ]
      }
      return toolbars
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  created() {
    this.default = JSON.parse(JSON.stringify(this.rigthsTypes))
  },
  beforeDestroy() {
    this.rightsFormData = null
    this.opinion = null
    this.formParams = null
    this.rightsTypeList = null
  },
  methods: {
    handleActionEvent({
      key
    }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'confirm':
          this.handleConfirm()
          break
        case 'undo':
          this.handleUndo()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      this.$emit('callback', this.getSaveData())
    },
    handleSave() {
      if (this.type === 'form' || this.rightsType === 'data') {
        savePermission({
          permission: JSON.stringify(this.getSaveData()),
          formKey: this.formKey,
          flowKey: '',
          nodeId: '',
          parentflowKey: '',
          dataTemplateKey: this.dataTemplateKey || null,
          rightsType: this.rightsType,
          isInst: false,
          rightsScope: this.rightsType
        }).then(response => {
          const str = this.rightsType === 'form' ? '字段权限属于页面加载权限，表单权限属于运行时的权限，请注意两者权限设置时不要出现冲突。' : ''
          ActionUtils.saveSuccessMessage(response.message + str, (rtn) => {
            if (rtn) {
              this.closeDialog()
            }
          })
        })
      } else {
        saveFlowPermission({
          permission: JSON.stringify(this.getSaveData())
        }).then(response => {
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (rtn) {
              this.closeDialog()
            }
          })
        })
      }
    },
    handleUndo() {
      this.$confirm('确认重置表单权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogLoading = true
        if (this.isSave) {
          if (this.type === 'form') {
            resetRights({
              permission: JSON.stringify(this.getRightsParams()),
              formKey: this.formKey,
              flowKey: '',
              nodeId: '',
              parentflowKey: '',
              rightsType: this.rightsType,
              isInst: false,
              rightsScope: this.rightsType
            }).then(response => {
              this.$message.closeAll()
              this.$message({
                type: 'success',
                message: '重置表单权限成功!'
              })
              this.getFormData()
            })
          } else {
            this.init = true
            this.getFormData()
            // resetFlowPermission({
            //   permission: JSON.stringify(this.getRightsParams())
            // }).then(response => {
            //   this.$message.closeAll()
            //   this.$message({
            //     type: 'success',
            //     message: this.type === 'dataTemplate' ? '重置模板表单权限成功!' : '重置流程表单权限成功!'
            //   })
            // this.getFormData()
            // })
          }
          this.dialogLoading = false
          this.initButtonType()
        } else {
          setTimeout(() => {
            this.$emit('callback', null)
            this.$message.closeAll()
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.dialogLoading = false
            this.getFormData()
          }, 100)
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    closeDialog() {
      this.$emit('close', false)
      this.initButtonType()
    }
  }
}
</script>
<style lang="scss">
  @import "./rights.scss";
</style>
