<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="setting-optional-scope-dialog"
    top="15vh"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-button
      v-if="buttonKey === 'add'"
      icon="ibps-icon-add"
      type="primary"
      size="mini"
      style="font-size:14px;"
      class="setting-optional-add-button"
      plain
      :disabled="(selectorType==='user'&&formData.selectorScopes.length===partyTypeOptionsLength)||(selectorType!=='user'&&formData.selectorScopes.length===1)"
      @click="addScope"
    >
      添加
    </el-button>
    <el-form
      :ref="formName"
      :inline="true"
      :model="formData"
      label-width="60px"
      @submit.native.prevent
    >
      <div v-for="(scope,index) in formData.selectorScopes" :key="index">
        <el-form-item v-if="type==='user'" label="类型:" prop="userType">
          <el-select
            v-model="scope.userType"
            :disabled="readonly"
            placeholder="请选择"
            @visible-change="() => selectFocusEven(scope.userType)"
            @change="(val) => changeUserType(val, index)"
            @focus="refreshScopes"
          >
            <el-option
              v-for="item in partyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="范围:" prop="descVal">
          <el-select
            v-model="scope.descVal"
            placeholder="请选择"
            @focus="(e)=>focusDescValSelect(e,index)"
            @change="(val)=>changeDescVal(val,scopeIndex)"
          >
            <el-option
              v-for="item in scopeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="scope.descVal==='script'||scope.descVal==='3'" :label="scope.descVal==='script'?'脚本:':'范围:'" prop="descVal">
          <el-button type="primary" class="el-icon-setting" size="mini" @click="settingJavascript(scope.userType,scope.descVal,index)">设置</el-button>
        </el-form-item>
        <el-form-item v-if="buttonKey==='add'">
          <el-button type="primary" class="el-icon-delete" size="mini" @click="remove(scope.userType,scope.descVal,index)">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <!-- 脚本 -->
    <dynamic-script
      :visible="dynamicScriptVisible"
      label="设置脚本"
      :bo-data="boData"
      :data="formData.selectorScopes[scopeIndex]?formData.selectorScopes[scopeIndex].scriptContent:''"
      type="hyperlink"
      @callback="(data)=>setDefaultValue(data,scopeIndex)"
      @close="visible => dynamicScriptVisible = visible"
    />
    <!-- 指定范围-组织 -->
    <ibps-org-dialog
      :visible="orgVisible"
      :value="selectorData[scopeIndex]"
      :multiple="multiple"
      @close="visible=>orgVisible=visible"
      @action-event="(buttonKey, data)=>handleSelectorActionEvent(buttonKey, data,scopeIndex)"
    />
    <!-- 指定范围-岗位 -->
    <ibps-position-selector-dialog
      :visible="positionVisible"
      :value="selectorData[scopeIndex]"
      :multiple="multiple"
      @close="visible=>positionVisible=visible"
      @action-event="(buttonKey, data)=>handleSelectorActionEvent(buttonKey, data,scopeIndex)"
    />
    <!-- 指定范围-角色 -->
    <ibps-role-selector-dialog
      :visible="roleVisible"
      :value="selectorData[scopeIndex]"
      :multiple="multiple"
      @close="visible=>roleVisible=visible"
      @action-event="(buttonKey, data)=>handleSelectorActionEvent(buttonKey, data,scopeIndex)"
    />
    <!-- 指定范围-用户组 -->
    <ibps-group-selector-dialog
      :visible="groupVisible"
      :value="selectorData[scopeIndex]"
      :multiple="multiple"
      @close="visible=>groupVisible=visible"
      @action-event="(buttonKey, data)=>handleSelectorActionEvent(buttonKey, data,scopeIndex)"
    />
  </el-dialog>
</template>
<script>
import DynamicScript from './dynamic-script'
import IbpsPositionSelectorDialog from '@platform/business/platform/org/position/dialog'
import IbpsRoleSelectorDialog from '@platform/business/platform/org/role/dialog'
import IbpsGroupSelectorDialog from '@platform/business/platform/org/group/dialog'
import { partyTypeOptions } from '@platform/business/platform/org/employee/constants'
import { selectorScopeOption } from '@platform/business/platform/form/constants/fieldOptions'
import { load } from '@platform/api/platform/org/employee'
export default {
  components: {
    DynamicScript,
    IbpsPositionSelectorDialog,
    IbpsGroupSelectorDialog,
    IbpsRoleSelectorDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '添加范围'
    },
    columns: {
      type: Array
    },
    data: {
      type: Object
    },
    boData: {
      type: Array
    },
    fields: {
      type: Array
    },
    selectorType: {
      type: String,
      default: ''
    },
    existingTypeScope: {
      type: Array
    },
    buttonKey: {
      type: String,
      default: 'add'
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      positionVisible: false,
      orgVisible: false,
      groupVisible: false,
      roleVisible: false,
      loadGttypeId: false,
      dynamicScriptVisible: false,
      hasRemoveAction: false,
      removeScopes: [],
      dialogVisible: this.visible,
      formName: 'form',
      scopeIndex: 0,
      scopeOption: selectorScopeOption,
      partyTypeOptions: partyTypeOptions,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: {
        selectorScopes: []
      },
      selectorData: [],
      dialogData: '',
      focusData: '',
      onceAction: true,
      partyTypeOptionsLength: 0
    }
  },
  computed: {
    type() {
      return this.selectorType
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.partyTypeOptions = this.buttonKey === 'add' ? this.$utils.isNotEmpty(this.existingTypeScope) ? this.existingTypeScope : [] : JSON.parse(JSON.stringify(partyTypeOptions))
        if (this.buttonKey === 'setting') {
          const partyTypeOptions = []
          const existingTypeScope = []
          const indexs = []
          this.partyTypeOptions.forEach(p => {
            partyTypeOptions.push(p.value)
          })
          this.existingTypeScope.forEach(e => {
            existingTypeScope.push(e.value)
          })
          for (let i = 0; i < partyTypeOptions.length; i++) {
            if (existingTypeScope.indexOf(partyTypeOptions[i]) === -1) {
              indexs.push(partyTypeOptions[i])
            }
          }
          this.partyTypeOptions.forEach(p => {
            indexs.forEach(i => {
              if (p.value === i) {
                p.disabled = true
              }
            })
          })
        }
        this.partyTypeOptionsLength = this.partyTypeOptions.length
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.removeScopes = null
    this.scopeOption = null
    this.partyTypeOptions = null
    this.selectorData = null
    this.toolbars = null
    this.formData = null
  },
  methods: {
    handleActionEvent({ key }) {
      if (this.loadGttypeId) {
        this.$message({
          message: '正在从后台获取参数中,请勿操作过快！',
          type: 'warning'
        })
        return
      }
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
    remove(userType, descVal, index) {
      const options = JSON.parse(JSON.stringify(this.removeScopes))
      this.formData.selectorScopes.splice(index, 1)
      if (this.$utils.isNotEmpty(userType)) {
        const index = partyTypeOptions.findIndex(p => p.value === userType)
        options.push(partyTypeOptions[index])
      }
      this.partyTypeOptions = partyTypeOptions
      this.removeScopes = JSON.parse(JSON.stringify(options))
      this.hasRemoveAction = true
    },
    refreshScopes() {
      if (this.hasRemoveAction) {
        this.partyTypeOptions = this.removeScopes
      }
      this.hasRemoveAction = false
    },
    handleConfirm() {
      const data = JSON.parse(JSON.stringify(this.formData))
      data.selectorScopes.forEach((s, i) => {
        s.old = s.userType
        s.type = this.type
        if (s.descVal === '3') {
          const partyId = []
          const partyName = []
          this.selectorData[i].forEach((d, l) => {
            partyId.push(d.id)
            partyName.push(d.name)
          })
          s.partyId = partyId.join(',')
          s.partyName = partyName.join(',')
        }
      })
      let isSave = true
      for (let i = 0, scopesDatas = data.selectorScopes; i < scopesDatas.length; i++) {
        if (this.$utils.isEmpty(scopesDatas[i].userType) && this.type === 'user') {
          this.$message({
            message: '第' + (i + 1) + '行得类型不能为空',
            type: 'warning'
          })
          isSave = false
          break
        } else if (scopesDatas[i].userType !== '') {
          if (this.$utils.isEmpty(scopesDatas[i].descVal)) {
            this.$message({
              message: '第' + (i + 1) + '行得范围不能为空',
              type: 'warning'
            })
            isSave = false
            break
          } else if (scopesDatas[i].descVal === 'script' && scopesDatas[i].scriptContent === '') {
            this.$message({
              message: '第' + (i + 1) + '行得脚本不能为空',
              type: 'warning'
            })
            isSave = false
            break
          } else if (scopesDatas[i].descVal === '3' && scopesDatas[i].partyId === '') {
            this.$message({
              message: '第' + (i + 1) + '行得指定范围值不能为空',
              type: 'warning'
            })
            isSave = false
            break
          }
        } else if (this.type !== 'user') {
          if (scopesDatas[i].descVal === '') {
            this.$message({
              message: '第' + (i + 1) + '行得范围不能为空',
              type: 'warning'
            })
            isSave = false
            break
          } else {
            if (scopesDatas[i].descVal === 'script' && scopesDatas[i].scriptContent === '') {
              this.$message({
                message: '第' + (i + 1) + '行得脚本不能为空',
                type: 'warning'
              })
              isSave = false
              break
            } else if (scopesDatas[i].descVal === '3' && scopesDatas[i].partyId === '') {
              this.$message({
                message: '第' + (i + 1) + '行得指定范围值不能为空',
                type: 'warning'
              })
              isSave = false
              break
            }
          }
        }
      }
      if (!isSave) {return}
      this.$emit('callback', data.selectorScopes)
      this.closeDialog()
    },
    addScope() {
      const form = {
        userType: '',
        descVal: '',
        includeSub: true,
        scriptContent: '',
        partyName: '',
        partyId: []
      }
      this.formData.selectorScopes.push(form)
    },
    // 关闭当前窗口
    closeDialog() {
      this.onceAction = true
      this.formData.selectorScopes = []
      this.selectorData = []
      this.$emit('close', false)
    },
    // 关闭关闭选择器弹窗窗口
    closeSelectorDialog(index) {
      switch (this.formData.selectorScopes[index].userType || this.type) {
        case 'org':
          this.orgVisible = false
          break
        case 'position':
          this.positionVisible = false
          break
        case 'role':
          this.roleVisible = false
          break
        case 'group':
          this.groupVisible = false
          break
      }
    },
    settingJavascript(userType, descVal, index) {
      this.scopeIndex = index
      if (this.$utils.isEmpty(userType) && this.type === 'user') {
        this.$message({
          message: '范围类型不能为空，请重现选择!',
          type: 'warning'
        })
        return
      }
      if (descVal === 'script') {
        this.dynamicScriptVisible = true
      } else {
        if (descVal === '3') {
          if (userType === 'org' || this.type === 'org') {
            this.orgVisible = true
          } else if (userType === 'position' || this.type === 'position') {
            this.positionVisible = true
          } else if (userType === 'role' || this.type === 'role') {
            this.roleVisible = true
          } else if (userType === 'group' || this.type === 'group') {
            this.groupVisible = true
          }
        }
      }
    },
    selectFocusEven(value) {
      this.focusData = value
    },
    changeUserType(val, index) {
      this.selectorData[index] = []
      this.formData.selectorScopes[index].partyId = []
      // 存储已选得用户类型
      const arr = []
      this.formData.selectorScopes.forEach(s => {
        arr.push(s.userType)
      })
      // 当允许选择得类型范围未上限时，切换同个数据得范围相互替换。
      if (this.$utils.isNotEmpty(this.focusData)) {
        const index = partyTypeOptions.findIndex(p => p.value === this.focusData)
        const exchangePartyType = partyTypeOptions[index]
        if (this.buttonKey === 'setting' && this.onceAction) {
          const sameTypeIndex = this.partyTypeOptions.findIndex(p => p.value === this.focusData)
          // 去除相同得类型
          this.partyTypeOptions.splice(sameTypeIndex, 1)
          this.onceAction = false
        }
        arr.forEach(a => {
          this.partyTypeOptions.forEach((e, i) => {
            if (a === e.value) {
              this.partyTypeOptions.splice(i, 1, exchangePartyType)
            }
          })
        })
        // 类型数值为所在范围时，从后台获取参数
        if (this.buttonKey === 'setting' && this.formData.selectorScopes[0].descVal === '2') {
          this.gettypeId(this.$store.getters.userId, val, 0)
        }
        return
      }
      // 正常添加，去除已经添加得类型,更新option。
      arr.forEach(a => {
        this.partyTypeOptions.forEach((e, i) => {
          if (a === e.value) {
            this.partyTypeOptions.splice(i, 1)
          }
        })
      })
      // 类型数值为所在范围时，从后台获取参数
      if (this.formData.descVal === '2') {
        this.gettypeId(this.$store.getters.userId, val)
      }
    },
    changeDescVal(val, index) {
      this.selectorData[index] = []
      this.formData.selectorScopes[index] ? this.formData.selectorScopes[index].scriptContent = '' : null
      if (val === '2' || (this.type !== 'user' && val === '2')) {
        this.gettypeId(this.$store.getters.userId, this.type === 'user' ? this.formData.selectorScopes[index].userType : this.type, index)
      }
    },
    focusDescValSelect(e, index) {
      this.scopeIndex = index
    },
    gettypeId(id, type, index) {
      this.loadGttypeId = true
      load({
        employeeId: id
      }).then(response => {
        let currentOrgId
        if (type === 'org') { // 用户组暂时处理
          currentOrgId = response.data.groupID
        }
        if (type === 'group') {
          const arr = []
          if (this.$utils.isNotEmpty(response.variables.partyGroups)) {
            response.variables.partyGroups.forEach(g => {
              arr.push(g.id)
            })
            currentOrgId = arr.join(',')
          } else {
            currentOrgId = ''
          }
        }
        if (type === 'role') {
          const arr = []
          if (this.$utils.isNotEmpty(response.variables.partyRoles)) {
            response.variables.partyGroups.forEach(r => {
              arr.push(r.id)
            })
            currentOrgId = arr.join(',')
          } else {
            currentOrgId = ''
          }
        }
        if (type === 'position') {
          currentOrgId = response.data.positions
        }
        this.formData.selectorScopes[index].partyId = currentOrgId
        this.loadGttypeId = false
      }).catch((err) => {
        this.loadGttypeId = false
        console.error(err)
      })
    },
    handleSelectorActionEvent(buttonKey, data, index) {
      if (buttonKey === 'cancel') {return}
      if (this.$utils.isEmpty(data)) {return}
      if (this.$utils.isNotEmpty(data)) {
        const selectorData = data.map(d => {
          return {
            id: d.id,
            name: d.name
          }
        })
        if (this.selectorData[index]) {
          this.selectorData[index] = selectorData
        } else {
          this.selectorData.push(selectorData)
        }
      } else {
        this.selectorData = []
      }
      this.closeSelectorDialog(index)
    },
    setDefaultValue(value, index) {
      this.formData.selectorScopes[index].scriptContent = value
    },
    getPoint(v1, v2) {
      const id = v1
      const name = v2
      return { id, name }
    },
    getFormData() {
      if (this.$utils.isEmpty(this.data)) {
        if (this.selectorType === 'user') {
          this.formData.selectorScopes = []
        } else {
          this.formData.selectorScopes = [{
            userType: '',
            descVal: '',
            includeSub: true,
            scriptContent: '',
            partyName: '',
            partyId: []
          }]
        }
        return
      }
      const data = JSON.parse(JSON.stringify(this.data))
      this.formData.selectorScopes.push(data)
      const partyId = data.descVal === '3' ? data.partyId.split(',') : []
      const partyName = data.descVal === '3' ? data.partyName.split(',') : []
      if (data.descVal === '3') {
        const arr = []
        partyId.forEach((p1, i) => {
          arr.push(this.getPoint(partyId[i], partyName[i]))
        })
        this.selectorData.push(arr)
      }
    }
  }
}
</script>
<style lang="scss">
.setting-optional-scope-dialog{
  .el-dialog__body{
    padding: 20px 15px;
    .setting-optional-add-button{
      margin-bottom: 10px;
    }
  }
}
</style>
