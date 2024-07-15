<template>
  <div class="form-editor-grouping">
    <!--列表分组-->
    <div class="panel panel-default">
      <div class="panel-heading">
        <span>列表分组</span><help-tip prop="grouping" />
  &nbsp;<el-tooltip :content="'列表是否分组'" placement="bottom">
         <el-switch v-model="fieldOptions.grouping" @change="initGrouping" />
         </el-tooltip>
        <div v-if="fieldOptions.grouping" class="ibps-fr">
          <span class="el-dropdown-link" @click="openGroupingSetting()">
            <i class="el-icon-circle-plus-outline" />
            添加配置
          </span>
        </div>
      </div>
      <div v-if="fieldOptions.grouping" class="panel-body">
        <!-- 分组配置的数据 -->
        <div class="choices">
          <vuedraggable v-model="fieldOptions.groupingSettings" v-bind="draggableOptions" @start="isDragging = true" @end="()=>{isDragging= false}">
            <div v-for="(item,i) in fieldOptions.groupingSettings" :key="i" class="option draggable">
              <div class="actions-left">
                <span>{{ item.label }}</span>
              </div>
              <el-button-group class="button-actions">
                <el-tooltip content="设置" placement="top">
                  <el-button size="small" type="text" icon="el-icon-setting" @click="openGroupingSetting(i)" />
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button size="small" type="text" icon="el-icon-delete" @click="removeGroupingSetting(i)" />
                </el-tooltip>
                <el-button data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" class="draggable" />
              </el-button-group>
            </div>
          </vuedraggable>
        </div>
        <div v-if="$utils.isNotEmpty(fieldOptions.groupingSettings)" style="padding-top: 10px;">
          <el-form-item>
            <template slot="label">默认显示<help-tip prop="defaultShow" /></template>
            <el-select v-model="fieldOptions.defaultShow">
              <el-option
                v-for="(item,index) in settingOptions"
                :key="index"
                :value="item.id"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </div>
        <div
          v-if="$utils.isEmpty(fieldOptions.groupingSettings)
            || fieldOptions.groupingSettings.length===0"
          class="el-table__empty-block"
        >
          <span class="el-table__empty-text">未进行分组配置</span>
        </div>
      </div>
    </div>
    <!-- 分组配置弹窗 -->
    <grouping-setting
      v-if="dialogVisible"
      :visible="dialogVisible"
      :title="groupingTitle"
      :bo-data="subFields"
      :current-fields="currentFields"
      :data="groupingData"
      @callback="handlerGroupingSetting"
      @close="visible => dialogVisible = visible"
    />
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
import GroupingSetting from '@platform/business/platform/form/formbuilder/right-aside/components/grouping-setting'
import Ids from 'ids'
export default {
  components: {
    GroupingSetting
  },
  mixins: [EditorMixin],
  data() {
    return {
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        axis: 'y'
      },
      dialogVisible: false, // 分组配置弹窗显示
      groupingData: {}, // 传入到分组配置的数据
      groupingTitle: '添加分组配置', // 传入到分组配置的标题
      editIndex: -1 // 当分组配置编辑时赋值
    }
  },
  computed: {
    // 将分组配置设置成默认显示的选项
    settingOptions() {
      let options = [{
        id: '',
        label: '无'
      }]
      if (this.$utils.isNotEmpty(this.fieldOptions.groupingSettings)) {
        options = options.concat(this.fieldOptions.groupingSettings)
      }
      return options
    },
    // 子表单的子字段
    currentFields() {
      if (this.$utils.isEmpty(this.boData)) {
        return []
      }
      const isClob = this.fieldType === 'bpmInstHis'
      if (this.isSub) {
        if (this.$utils.isNotEmpty(this.code)) {
          return this.boData.filter((bo) => {
            return (bo.attrType === 'subField' && bo.tableName === this.code && (isClob ? bo.type === 'clob' : true)) || bo.key === this.code
          })
        } else {
          return []
        }
      } else {
        return this.boData.filter((bo) => {
          return bo.attrType === 'field' && (isClob ? bo.type === 'clob' : true)
        })
      }
    },
    // 子表单的子字段
    subFields() {
      if (this.$utils.isEmpty(this.boData)) {
        return []
      }
      const isClob = this.fieldType === 'bpmInstHis'
      if (this.isSub) {
        if (this.$utils.isNotEmpty(this.code)) {
          return this.boData.filter((bo) => {
            return bo.attrType === 'subField' && bo.tableName === this.code && (isClob ? bo.type === 'clob' : true)
          })
        } else {
          return []
        }
      } else {
        return this.boData.filter((bo) => {
          return bo.attrType === 'field' && (isClob ? bo.type === 'clob' : true)
        })
      }
    }
  },
  mounted() {
    if (!this.$utils.isArray(this.fieldOptions.groupingSettings)) {
      this.fieldOptions.groupingSettings = []
    } else {
      for (let i = 0; i < this.fieldOptions.groupingSettings.length; i++) {
        if (this.$utils.isEmpty(this.fieldOptions.groupingSettings[i].id)) {
          this.fieldOptions.groupingSettings[i].id = new Ids([32, 36, 1]).next()
        }
      }
    }
  },
  beforeDestroy() {
    this.draggableOptions = null
    this.groupingData = null
  },
  methods: {
    // 开启分组配置弹窗 - 参数data不为空则为修改分组配置
    openGroupingSetting(index) {
      if (this.$utils.isNotEmpty(index)) {
        this.groupingTitle = '修改分组配置'
        this.groupingData = JSON.parse(JSON.stringify(this.fieldOptions.groupingSettings[index]))
        this.editIndex = index
      } else {
        this.groupingTitle = '添加分组配置'
        this.groupingData = {}
        this.editIndex = -1
      }
      this.dialogVisible = true
    },
    // 根据下标删除分组配置项
    removeGroupingSetting(index) {
      if (this.$utils.isNotEmpty(this.fieldOptions.defaultShow) && this.fieldOptions.defaultShow === this.fieldOptions.groupingSettings[index].id) {
        this.fieldOptions.defaultShow = ''
      }
      this.fieldOptions.groupingSettings.splice(index, 1)
    },
    // 分组配置弹窗返回的数据
    handlerGroupingSetting(data) {
      if (this.editIndex === -1) {
        this.fieldOptions.groupingSettings.push(data)
      } else {
        this.fieldOptions.groupingSettings.splice(this.editIndex, 1, data)
        this.editIndex = -1
      }
    },
    // 改变是否分组选项的值
    initGrouping(val) {
      if (!val) {
        this.fieldOptions.informationScript = null
        this.fieldOptions.calculationFormula = null
        this.fieldOptions.headInformation = null
        this.fieldOptions.groupingCondition = null
        this.fieldOptions.additionalFormat = null
        this.fieldOptions.groupingSettings = []
      }
    }
  }
}
</script>
<style lang="scss">
.form-editor-grouping {
  .choices {
    .option {
      position: relative;
      margin-bottom: 5px;
      border: 1px solid transparent;
      background-color: #f5f7fa;
      padding: 5px 0 5px 20px;
      .actions-left{
        height: 24px;
        line-height: 24px;
      }
      .el-input {
        display: inline-block;
        width: 35%;
        vertical-align: middle;
      }
      .el-checkbox{
          margin-right: 10px;
      }
      .button-actions {
        position: absolute;
        width: 60px;
        top: 0;
        right: 0;
        line-height: 20px;
        padding-left: 5px;
        background: #e7f1f1;
        .el-button {
          padding-right: 4px;
          margin-right: 2px;
        }
        [data-role="sort_choice"]{
            cursor: move
        }
      }
    }
  }
  .more-actions {
    text-align: right;
    margin-top: 10px;
    margin-right:10px;
    .el-button {
      border-right: 1px solid #D9D9D9;
      padding-right: 4px;
      margin-right: 2px;
    }
  }
  .other-choice-input {
    width: 100px  !important;
    margin-top: -3px;
    margin-left: 4px;
    background: rgba(255,255,255,0.65);
    height: 2em;
  }
}
</style>
