import toolbar from '@cupu/framework/components/toolbar'
import table from '@cupu/framework/components/table'
import tree from '@cupu/framework/components/tree'
import comb from '@cupu/framework/components/comb'
import dialogTable from '@cupu/framework/components/dialogTable'
import Model from '@cupu/components/model/Model.vue'
import Crultoolbar from '@cupu/components/toolbar'
import InputUploadFile from '@cupu/components/input-upload-file/index'
import InputUploadFileset from '@cupu/components/input-upload-fileset/index'
import UserDialogSelect from '@cupu/components/cp-dialog-select/userDialogSel.vue'
import OrgDialogSelect from '@cupu/components/cp-dialog-select/orgDialogSel.vue'
import EqLocationDialogSelect from '@cupu/components/cp-dialog-select/eqLocationDialog.vue'
import EqManageObjectDialogSelect from '@cupu/components/cp-dialog-select/eqManageObjectDialog.vue'
import EqMeasurePointDialogSelect from '@cupu/components/cp-dialog-select/eqMeasurePointDialog.vue'
import IotAreaDeviceDialogSelect from '@cupu/components/cp-dialog-select/iotAreaDeviceDialog.vue'
import EqTypeDialogSelect from '@cupu/components/cp-dialog-select/eqTypeDialog.vue'
import SparePartsDialogSelect from '@cupu/components/cp-dialog-select/sparePartsDialogSelect.vue'
import MaterialDialogSelect from '@cupu/components/cp-dialog-select/materialDialogSel.vue'
import EqAreaDialogSelect from '@cupu/components/cp-dialog-select/eqAreaDialog.vue'
import EqAssetDialogSelect from '@cupu/components/cp-dialog-select/eqAssetDialog.vue'
import EqAssetTypeDialogSelect from '@cupu/components/cp-dialog-select/eqAssetTypeDialog.vue'
import EqManufacturerDialogSelect from '@cupu/components/cp-dialog-select/eqManufacturerDialog.vue'
import BizTagDialogSelect from '@cupu/components/cp-dialog-select/cpisBizTagDialog.vue'
import DeptTreeSelect from '@cupu/components/cp-dialog-select/depTreeSelect.vue'
import CpSelect from '@cupu/components/cp/cpSelect.vue'
import IssueWorkTicket from '@cupu/components/issueWorkTicket/issueWorkTicket.vue'
import ImportModelView from '@cupu/components/importModelView/index.vue'
import DangerSourceSelect from '@cupu/components/cp-dialog-select/dangerSourceDialog.vue'
import OrgSelect from '@cupu/components/org-select/index.vue'
import WorkTicketDialogSelect from '@cupu/components/cp-dialog-select/workTicketDialog.vue'
import OperaTicketDialogSelect from '@cupu/components/cp-dialog-select/operaTicketDialog.vue'
import TeamDialogSelect from '@cupu/components/cp-dialog-select/teamDialogSel.vue'
import CpQrCode from '@cupu/components/cp/cpQrCode.vue'
import CpAreaCode from '@cupu/components/cp/cpAreaCode.vue'
import EngrContractDialogSelect from '@cupu/components/cp-dialog-select/engrContractDialogSelect.vue'
import PositionDialogSelect from '@cupu/components/cp-dialog-select/positionDialogSel.vue'
import DefectDialogSelect from '@cupu/components/cp-dialog-select/defectDialog.vue'
// 存储组件列表
const components = [Crultoolbar, EqLocationDialogSelect, EqManageObjectDialogSelect, EqMeasurePointDialogSelect, EqTypeDialogSelect, InputUploadFile, InputUploadFileset, IotAreaDeviceDialogSelect, UserDialogSelect,OrgDialogSelect, SparePartsDialogSelect, MaterialDialogSelect, EqAreaDialogSelect, EqAssetDialogSelect, EqAssetTypeDialogSelect, EqManufacturerDialogSelect, BizTagDialogSelect, DeptTreeSelect, CpSelect, IssueWorkTicket, ImportModelView, DangerSourceSelect, OrgSelect, WorkTicketDialogSelect, OperaTicketDialogSelect, TeamDialogSelect, CpQrCode, CpAreaCode, EngrContractDialogSelect, PositionDialogSelect, DefectDialogSelect]
//install是让业务代码在main.js 引入之后 use(cupubase)  注册到全局用的
const install = app => {
  window.config = { I18N_FALLBACK_LOCALE: 'zh-CN', I18N_LOCALE: 'zh-CN', ...window.config }
  components.forEach(item => {
    app.component(item.name, item)
  })
  app.component('el-model', Model)
  app.component('z-toolbar', toolbar) // 搜索工具栏
  app.component('z-table', table) // 表格列表
  app.component('z-tree', tree) // 树控件
  app.component('z-comb', comb) // 组件组合
  app.component('z-dialog-table', dialogTable) // 弹出框模板
}
const base = {
  version: '1.0.0',
  install
}
export default base
