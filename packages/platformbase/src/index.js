import FlowApproveMessage from '@platform/components/flow-approve-message/flowApproveMessage'
import FlowApproveOpinion from '@platform/components/flow-approve-opinion/index'
import FlowDiagramDialog from '@platform/components/flow-diagram/dialog.vue'
import IbpsContainer from '@platform/components/ibps-container/index'
import IbpsContainerFrame from '@platform/components/ibps-container-frame'
import IbpsLinkBtn from '@platform/components/ibps-link-btn'
import IbpsCheckbox from '@platform/components/ibps-checkbox'
// import IbpsHighlight from '@platform/components/ibps-highlight/index'
import IbpsIcon from '@platform/components/ibps-icon'
import IbpsIconSvg from '@platform/components/ibps-icon-svg/index.vue'
import IbpsIconSelect from '@platform/components/ibps-icon-select/index.vue'
import IbpsIconSvgSelect from '@platform/components/ibps-icon-svg-select/index.vue'
import IbpsEmpty from '@platform/components/ibps-empty/index.vue'
import IbpsScrollbar from '@platform/components/ibps-scrollbar/index.vue'
import IbpsToolbar from '@platform/components/ibps-toolbar/index.vue'
import IbpsCrud from '@platform/components/ibps-crud/index.vue'
import IbpsLayout from '@platform/components/ibps-layout/index.vue'
import IbpsTree from '@platform/components/ibps-tree/index.vue'
import IbpsList from '@platform/components/ibps-list/list.vue'
import IbpsListItem from '@platform/components/ibps-list/list-item.vue'
import IbpsListItemMeta from '@platform/components/ibps-list/list-item-meta.vue'
// import IbpsHyperlink from "@platform/components/ibps-link/index.vue"
import IbpsHelp from '@platform/components/ibps-help/index.vue'
import IbpsTextEllipsis from '@platform/components/ibps-text-ellipsis/index.vue'
import IbpsEllipsis from '@platform/components/ibps-ellipsis/index.vue'
import IbpsSteps from '@platform/components/ibps-steps/steps'
import IbpsStepPane from '@platform/components/ibps-steps/step-pane'
import IbpsQrCode from '@platform/components/ibps-qr-code/index.vue'
import IbpsUeditor from '@platform/components/ibps-ueditor/index.vue'
// import IbpsTinymce from '@platform/components/ibps-tinymce/index.vue'
import IbpsSelectorDialog from '@platform/components/ibps-selector/dialog'
import IbpsSelector from '@platform/components/ibps-selector/selector'
import IbpsContextmenu from '@platform/components/ibps-contextmenu/index.vue'
import IbpsEditor from '@platform/components/ibps-editor/index.vue'
import IbpsEditorFile from '@platform/components/ibps-editor-file/index.vue'
import IbpsEditorFileDialog from '@platform/components/ibps-editor-file/editorDialog.vue'
import IbpsFileViewer from '@platform/components/ibps-file-viewer/index.vue'
import IbpsSearchForm from '@platform/components/ibps-crud/components/search-form/index.vue'
import IbpsEmployeeSelector from '@platform/components/ibps-employee-selector/selector.vue'
import IbpsEmployeeSelectorDialog from '@platform/components/ibps-employee-selector/dialog.vue'
import IbpsGroupSelector from '@platform/components/ibps-group-selector/selector.vue'
import IbpsGroupSelectorDialog from '@platform/components/ibps-group-selector/dialog.vue'
import IbpsOrgSelector from '@platform/components/ibps-org-selector/selector.vue'
import IbpsOrgSelectorDialog from '@platform/components/ibps-org-selector/dialog.vue'
import IbpsOrgExtendSelector from '@platform/components/ibps-org-extend-selector/selector.vue'
import IbpsOrgExtendSelectorDialog from '@platform/components/ibps-org-extend-selector/dialog.vue'
// import IbpsPositionSelector from '@platform/business/platform/org/position/selector.vue'
// import IbpsRoleSelector from '@platform/business/platform/org/role/selector.vue'
import IbpsFileUploader from '@platform/components/ibps-file-uploader/index.vue'
import IbpsImage from '@platform/components/ibps-image/index.vue'
import IbpsAddressCascader from '@platform/components/ibps-address/cascader.vue'
// 存储组件列表
const components = [
  FlowApproveMessage,
  FlowApproveOpinion,
  FlowDiagramDialog,
  IbpsContainer,
  IbpsContainerFrame,
  IbpsLinkBtn,
  IbpsCheckbox,
  // IbpsHighlight,
  IbpsIcon,
  IbpsIconSvg,
  IbpsIconSelect,
  IbpsIconSvgSelect,
  IbpsEmpty,
  IbpsScrollbar,
  IbpsToolbar,
  IbpsCrud,
  IbpsLayout,
  IbpsTree,
  IbpsList,
  IbpsListItem,
  IbpsListItemMeta,
  // IbpsHyperlink,
  IbpsHelp,
  IbpsTextEllipsis,
  IbpsEllipsis,
  IbpsSteps,
  IbpsStepPane,
  IbpsQrCode,
  IbpsUeditor,
  // IbpsTinymce,
  IbpsSelectorDialog,
  IbpsSelector,
  IbpsContextmenu,
  IbpsEditor,
  IbpsEditorFile,
  IbpsEditorFileDialog,
  IbpsFileViewer,
  IbpsSearchForm,
  IbpsEmployeeSelector,
  IbpsEmployeeSelectorDialog,
  IbpsGroupSelector,
  IbpsGroupSelectorDialog,
  IbpsOrgSelector,
  IbpsOrgSelectorDialog,
  IbpsOrgExtendSelector,
  IbpsOrgExtendSelectorDialog,
  // IbpsPositionSelector,
  // IbpsRoleSelector,
  IbpsFileUploader,
  IbpsImage,
  IbpsAddressCascader
]
//install是让业务代码在main.js 引入之后 use(platformbase)  注册到全局用的
const install = app => {
  window.config = { I18N_FALLBACK_LOCALE: 'zh-CN', I18N_LOCALE: 'zh-CN', ...window.config }
  components.forEach(item => {
    app.component(item.name, item)
  })
}
const base = {
  version: '1.0.0',
  install
}
export default base
