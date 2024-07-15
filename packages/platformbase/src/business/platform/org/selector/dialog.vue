<template>
  <div>
    <!--用户选择器-->
    <ibps-employee-selector-dialog v-if="type === 'employee' || type === 'user'" :visible="employeeSelectorVisible" :value="selectorValue" :value-key="valueKey" :multiple="multiple" :label-key="labelKey" :store="store" :form-data="formData" :custom-party-type-options="customPartyTypeOptions" :current-org-id="currentOrgId" :party-type-id="partyTypeId" :script="script" :party-type-scope="partyTypeScope" :is-use-scope="true" @close="closeDialog" @change-party-type="changePartyType" @action-event="handleSelectorActionEvent" />
    <!--组织选择器-->
    <ibps-org-selector-dialog v-else-if="type === 'org'" :visible="orgSelectorVisible" :current-org-id="currentOrgId" :party-type-id="partyTypeId" :script="script" :form-data="formData" :is-use-scope="true" :value="selectorValue" :value-key="valueKey" :multiple="multiple" :label-key="labelKey" :store="store" @close="closeDialog" @action-event="handleSelectorActionEvent" />
    <!--岗位选择器-->
    <ibps-position-selector-dialog v-else-if="type === 'position'" :visible="positionSelectorVisible" :current-org-id="currentOrgId" :party-type-id="partyTypeId" :script="script" :form-data="formData" :is-use-scope="true" :value="selectorValue" :value-key="valueKey" :multiple="multiple" :label-key="labelKey" :store="store" @close="closeDialog" @action-event="handleSelectorActionEvent" />
    <!--角色选择器-->
    <ibps-role-selector-dialog v-else-if="type === 'role'" :visible="roleSelectorVisible" :current-org-id="currentOrgId" :party-type-id="partyTypeId" :script="script" :form-data="formData" :is-use-scope="true" :value="selectorValue" :value-key="valueKey" :multiple="multiple" :label-key="labelKey" :store="store" @close="closeDialog" @action-event="handleSelectorActionEvent" />
  </div>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@platform/business/platform/org/employee/dialog'
import IbpsOrgSelectorDialog from '@platform/business/platform/org/org/dialog'
import IbpsPositionSelectorDialog from '@platform/business/platform/org/position/dialog'
import IbpsRoleSelectorDialog from '@platform/business/platform/org/role/dialog'
import { partyTypeOptions } from '../employee/constants'
export default {
  components: {
    IbpsEmployeeSelectorDialog,
    IbpsOrgSelectorDialog,
    IbpsPositionSelectorDialog,
    IbpsRoleSelectorDialog
  },
  inject: ['store'],
  props: {
    filter: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      // 展示的值
      type: [String, Function],
      default: 'name'
    },
    visible: {
      type: Boolean
    },
    type: {
      type: String
    },
    value: {
      type: [String, Number, Array, Object]
    },
    multiple: {
      type: Boolean,
      default: false
    },
    formData: Object
  },
  data() {
    return {
      employeeSelectorVisible: false,
      orgSelectorVisible: false,
      positionSelectorVisible: false,
      roleSelectorVisible: false,
      partyTypeOptions: partyTypeOptions,
      customPartyTypeOptions: [],
      // 用户选择器条件
      condition: {
        org: {
          partyTypeId: '',
          currentOrgId: '',
          script: ''
        },
        position: {
          partyTypeId: '',
          currentOrgId: '',
          script: ''
        },
        role: {
          partyTypeId: '',
          currentOrgId: '',
          script: ''
        },
        group: {
          partyTypeId: '',
          currentOrgId: '',
          script: ''
        }
      },
      // 传递参数
      partyTypeId: '',
      currentOrgId: '',
      script: '',
      partyTypeScope: ''
    }
  },
  computed: {
    selectorValue() {
      return this.value
    }
  },
  watch: {
    visible(value) {
      this.dialogVisible(value)
    },
    filter: {
      handler(val, oldVal) {
        this.filterScope(val)
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    this.partyTypeOptions = null
    this.customPartyTypeOptions = null
    this.condition = null
  },
  methods: {
    dialogVisible(visible = false) {
      this.filterScope(this.filter)
      if (this.type === 'employee' || this.type === 'user') {
        this.employeeSelectorVisible = visible
      } else if (this.type === 'org') {
        this.orgSelectorVisible = visible
      } else if (this.type === 'position') {
        this.positionSelectorVisible = visible
      } else if (this.type === 'role') {
        this.roleSelectorVisible = visible
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleSelectorActionEvent(buttonKey, data) {
      this.$emit('action-event', buttonKey, data, this.type)
    },
    changePartyType(val) {
      const params = this.condition[val]
      this.partyTypeScope = val
      this.partyTypeId = params.partyTypeId
      this.currentOrgId = params.currentOrgId
      this.script = params.script
    },
    filterScope(val) {
      const existingTypeScope = []
      const typeScope = []
      val.forEach(v => {
        existingTypeScope.push(v.userType)
        this.filterSelectorType(v)
      })
      // 根据设置得范围类型切换选择器左树（或右树）下拉类型数据
      const partyTypeOptions = JSON.parse(JSON.stringify(this.partyTypeOptions))
      partyTypeOptions.forEach((f, i) => {
        if (existingTypeScope.includes(f.value)) {
          typeScope.push(f)
        }
      })
      this.customPartyTypeOptions = typeScope
      // 初始化查询范围条件
      if (this.$utils.isNotEmpty(typeScope)) {
        this.currentOrgId = this.condition[typeScope[0].value].currentOrgId
        this.partyTypeId = this.condition[typeScope[0].value].partyTypeId
        this.script = this.condition[typeScope[0].value].script
      }
    },
    // 根据选择器类型分发筛选条件并储存
    filterSelectorType(val) {
      switch (val.type) {
        case 'user':
          this.getUserSelectorCondition(val, val.userType)
          break
        case 'org':
          this.getOrgSelectorCondition(val)
          break
        case 'position':
          this.getPositionSelectorCondition(val)
          break
        case 'role':
          this.getRoleSelectorCondition(val)
          break
      }
    },
    getUserSelectorCondition(val, type) {
      this.condition[type] ? (this.condition[type].partyTypeId = val.descVal) : null
      const userInfo = this.$store.getters.userInfo
      switch (val.descVal) {
        case '1':
          break
        case '2':
          let currentOrgId
          if (type === 'org') {
            currentOrgId = userInfo.employee.groupID
          } else if (type === 'position') {
            currentOrgId = userInfo.employee.positions
          } else if (type === 'role') {
            const roleId = []
            userInfo.role.forEach(r => {
              roleId.push(r.id)
            })
            currentOrgId = roleId.join(',')
          } else {
            // TODO: 后端补充上下文信息用户组信息
            const groupId = []
            userInfo.group.forEach(r => {
              groupId.push(r.id)
            })
            currentOrgId = groupId.join(',')
          }
          this.condition[type].currentOrgId = currentOrgId
          break
        case '3':
          this.condition[type].currentOrgId = val.partyId
          break
        case 'script':
          this.condition[type].script = val.scriptContent
          break
      }
    },
    // 获取组织选择器条件
    getOrgSelectorCondition(val) {
      this.partyTypeId = val.descVal
      switch (val.descVal) {
        case '1':
          break
        case '2':
          this.currentOrgId = this.$store.getters.userInfo.employee.groupID
          break
        case '3':
          this.currentOrgId = val.partyId
          break
        case 'script':
          this.script = val.scriptContent
          break
      }
    },
    // 获取岗位选择器条件
    getPositionSelectorCondition(val) {
      this.partyTypeId = val.descVal
      switch (val.descVal) {
        case '1':
          break
        case '2':
          this.currentOrgId = this.$store.getters.userInfo.employee.positions
          break
        case '3':
          this.currentOrgId = val.partyId
          break
        case 'script':
          this.script = val.scriptContent
          break
      }
    },
    // 获取角色选择器条件
    getRoleSelectorCondition(val) {
      this.partyTypeId = val.descVal
      switch (val.descVal) {
        case '1':
        case '2':
          break
        case '3':
          this.currentOrgId = val.partyId
          break
        case 'script':
          this.script = val.scriptContent
          break
      }
    }
  }
}
</script>
