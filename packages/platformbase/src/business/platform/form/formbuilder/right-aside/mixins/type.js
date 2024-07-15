import EditorBase from '../editors/editor-base'
import EditorRules from '../editors/editor-rules'
import EditorRights from '../editors/editor-rights'
import EditorLayout from '../editors/editor-layout'
import EditorOptions from '../editors/editor-options'
import EditorAttribute from '../editors/editor-attribute'
import EditorGrouping from '../editors/editor-grouping'
import EditorFieldInputNumber from '../editors/editor-field-input-number'
import EditorFieldEditor from '../editors/editor-field-editor'
import EditorFieldTable from '../editors/editor-field-table'
import EditorFieldSelector from '../editors/editor-field-selector'
import EditorFieldDictionary from '../editors/editor-field-dictionary'
import EditorFieldAutonumber from '../editors/editor-field-autonumber'
import EditorFieldAttachment from '../editors/editor-field-attachment'
import EditorFieldCustomDialog from '../editors/editor-field-custom-dialog'
import EditorFieldLinkdata from '../editors/editor-field-linkdata'
import EditorFieldLinkquery from '../editors/editor-field-linkquery'
import EditorFieldAddress from '../editors/editor-field-address'
import EditorFieldImage from '../editors/editor-field-image'
import EditorFieldHyperlink from '../editors/editor-field-hyperlink'
import EditorFieldSwitch from '../editors/editor-field-switch'
import EditorFieldNumber from '../editors/editor-field-number'
import EditorFieldInstHis from '../editors/editor-field-inst-his'
import EditorFieldBpmLink from '../editors/editor-field-bpm-link'
import EditorFieldApprovalOpinion from '../editors/editor-field-approval-opinion'
import EditorFieldAlert from '../editors/editor-field-alert'
import EditorFieldTag from '../editors/editor-field-tag'
export default {
  components: {
    EditorBase,
    EditorRules,
    EditorRights,
    EditorLayout,
    EditorOptions,
    EditorAttribute,
    EditorGrouping,
    EditorFieldInputNumber,
    EditorFieldEditor,
    EditorFieldTable,
    EditorFieldDictionary,
    EditorFieldAutonumber,
    EditorFieldSelector,
    EditorFieldAttachment,
    EditorFieldCustomDialog,
    EditorFieldLinkdata,
    EditorFieldLinkquery,
    EditorFieldAddress,
    EditorFieldImage,
    EditorFieldHyperlink,
    EditorFieldSwitch,
    EditorFieldNumber,
    EditorFieldInstHis,
    EditorFieldBpmLink,
    EditorFieldApprovalOpinion,
    EditorFieldAlert,
    EditorFieldTag
  },
  props: {
    fieldItem: {
      type: Object,
      required: true
    },
    boData: {
      type: Array
    },
    formType: {
      type: String,
      default: 'form'
    },
    fields: {
      type: Array
    }
  },
  computed: {
    fieldOptions() {
      return this.fieldItem.field_options || {}
    },
    fieldType() {
      return this.fieldItem.field_type
    }
  },
  methods: {
    handleSelect(field) {
      this.$emit('select', field)
    }
  }
}
