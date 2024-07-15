<template>
  <el-dialog
    title="展现形式"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ibps-dialog-80"
    top="5vh"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      v-loading="loading"
      :element-loading-text="$t('common.loading')"
    >
      <template v-if="formData">
        <el-form-item label="展示形式">
          <el-radio-group v-model="formData.shape" @change="changeShape">
            <el-radio label="tag">标签</el-radio>
            <el-radio label="icon">图标</el-radio>
            <el-radio label="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--标签-->
        <template v-if="formData.shape==='tag'">
          <el-form-item label="展示主题">
            <el-radio-group v-model="formData.effect">
              <el-radio-button label="light">浅色(light)</el-radio-button>
              <el-radio-button label="dark">深色(dark)</el-radio-button>
              <el-radio-button label="plain">纯色(plain)</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item label="展示数据">
          <div class="ibps-pb-10">
            <el-button type="primary" icon="el-icon-circle-plus" @click="addDisplayEffectData()">添加</el-button>
            <el-button type="pain" :loading="loading" @click="initDisplayEffectData">初始化数据</el-button>
          </div>
          <el-table ref="table" :key="timeStamp" :data="formData.data" border stripe>
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column label="数据字典值" prop="typeKey">
              <template slot-scope="scope">
                <ibps-dictionary
                  v-if="dictionary"
                  v-model="scope.row.typeKey"
                  :data="dictionaryData"
                  placeholder="请选择数据字典值"
                />
              </template>
            </el-table-column>
            <!--标签-->
            <template v-if="formData.shape==='tag'">
              <el-table-column label="样式" prop="type">
                <template slot-scope="scope">
                  <el-row :gutter="10">
                    <el-col :span="scope.row.type==='custom'?12:24">
                      <el-select v-model="scope.row.type" style="width:100%" @change="(val)=>{changeType(val,scope.$index)}">
                        <el-option
                          v-for="item in tagTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                          <el-link :underline="false" :type="item.value " class="ibps-fl">{{ item.label }}</el-link>
                        </el-option>
                      </el-select>
                    </el-col>
                    <template v-if="scope.row.type==='custom'">
                      <el-col :span="4">
                        <el-tooltip content="背景颜色">
                          <el-color-picker v-model="scope.row.backgroundColor" />
                        </el-tooltip>
                      </el-col>
                      <el-col :span="4">
                        <el-tooltip content="字体颜色">
                          <el-color-picker v-model="scope.row.color" />
                        </el-tooltip>
                      </el-col>
                      <el-col :span="4">
                        <el-tooltip content="边框颜色">
                          <el-color-picker v-model="scope.row.borderColor" />
                        </el-tooltip>
                      </el-col>
                    </template>
                  </el-row>
                </template>
              </el-table-column>
            <!-- <el-table-column width="120px" label="展示主题" prop="effect">
              <template slot="header">
                展示主题
                <el-select v-model="effect" @change="value=>changeCheckbox('effect',value)">
                  <el-option value="light" label="浅色(light)" />
                  <el-option value="dark" label="深色(dark)" />
                  <el-option value="plain" label="纯色(plain))" />
                </el-select>
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.effect">
                  <el-option value="light" label="浅色(light)" />
                  <el-option value="dark" label="深色(dark)" />
                  <el-option value="plain" label="纯色(plain))" />
                </el-select>
              </template>
            </el-table-column> -->
            </template>
            <!--图标-->
            <template v-if="formData.shape==='icon'">
              <el-table-column label="图标" prop="icon">
                <template slot-scope="scope">
                  <ibps-icon-select v-model="scope.row.icon" icon="el-icon-search" class="display-effect-icon" />
                </template>
              </el-table-column>
              <el-table-column label="颜色" prop="color">
                <template slot-scope="scope">
                  <el-color-picker v-model="scope.row.color" />
                </template>
              </el-table-column>
            </template>
            <!--按钮-->
            <template v-else-if="formData.shape==='button'">
              <el-table-column label="按钮类型" prop="type">
                <template slot-scope="scope">
                  <el-row :gutter="10">
                    <el-col :span="24">
                      <el-select v-model="scope.row.type" style="width:100%">
                        <el-option
                          v-for="item in buttonTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                          <el-link :underline="false" :type="item.value " class="ibps-fl">{{ item.label }}</el-link>
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <template v-if="scope.row.type==='custom'">
                      <el-col :span="8">
                        <el-tooltip content="背景颜色">
                          <el-color-picker v-model="scope.row.backgroundColor" />
                        </el-tooltip>
                      </el-col>
                      <el-col :span="8">
                        <el-tooltip content="字体颜色">
                          <el-color-picker v-model="scope.row.color" />
                        </el-tooltip>
                      </el-col>
                      <el-col :span="8">
                        <el-tooltip content="边框颜色">
                          <el-color-picker v-model="scope.row.borderColor" />
                        </el-tooltip>
                      </el-col>
                    </template>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column width="80px" prop="plain">
                <template slot="header">
                  <el-checkbox class="display-effect-button" :checked="plain" @change="value=>changeCheckbox('plain',value)">朴素</el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.plain" />
                </template>
              </el-table-column>
              <el-table-column width="80px" prop="round">
                <template slot="header">
                  <el-checkbox class="display-effect-button" :checked="round" @change="value=>changeCheckbox('round',value)">圆角</el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.round" />
                </template>
              </el-table-column>
              <el-table-column width="80px" prop="circle">
                <template slot="header">
                  <el-checkbox class="display-effect-button" :checked="circle" @change="value=>changeCheckbox('circle',value)">圆形</el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.circle" />
                </template>
              </el-table-column>
            </template>
            <el-table-column label="管理" width="80px">
              <template slot-scope="scope">
                <el-button type="danger" plain icon="el-icon-delete" @click="removeDisplayEffectData(scope.$index)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import ActionUtils from '@platform/utils/action'
import { findByTypeKey } from '@platform/api/platform/cat/dictionary'
import IbpsDictionary from '@platform/business/platform/cat/dictionary/select'
import { tagTypeOptions, buttonTypeOptions } from '@platform/business/platform/form/constants/fieldOptions'
export default {
  components: {
    IbpsDictionary
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dictionary: {
      type: String
    },
    data: [Object, String]
  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: false,
      dictionaryData: [],
      timeStamp: new Date().getTime(),
      defaultForm: {
        shape: 'tag',
        prop: [],
        effect: 'light',
        data: []
      },
      formData: {},
      plain: false,
      round: false,
      circle: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'clean' },
        { key: 'cancel' }
      ],
      tagTypeOptions,
      buttonTypeOptions
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
  beforeDestroy() {
    this.beforeDestroy()
  },
  methods: {
    beforeDestroy() {
      this.dictionaryData = null
      this.formData = null
      this.plain = false
      this.round = false
      this.circle = false
    },
    getFormData() {
      this.loadData()
    },
    loadData() {
      this.loading = true
      findByTypeKey({ typeKey: this.dictionary })
        .then(response => {
          this.loading = false
          this.dictionaryData = response.data
          if (this.$utils.isNotEmpty(this.data)) {
            this.formData = JSON.parse(JSON.stringify(this.data))
          } else {
            this.formData = JSON.parse(JSON.stringify(this.defaultForm))
          }
        }).catch(() => {
          this.loading = false
        })
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'clean':
          this.handleClean()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      // 判断重复字典值
      const data = this.formData.data
      if (this.$utils.isEmpty(data)) {
        ActionUtils.warning('请添加展示数据！')
        return
      }
      const map = {}
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        const typeKey = d.typeKey
        if (this.$utils.isEmpty(typeKey)) {
          ActionUtils.warning(`【{第${i + 1}行】请选择字典值！`)
          return
        }
        if (this.$utils.isNotEmpty(map[d.typeKey])) {
          ActionUtils.warning(`重复字典值【第${map[d.typeKey]}行】和【第${i + 1}行】`)
          return
        }
        map[typeKey] = i + 1
      }
      this.$emit('callback', this.formData)
      this.closeDialog()
    },
    handleClean() {
      this.$emit('callback', '')
      this.closeDialog()
    },
    closeDialog() {
      this.beforeDestroy()
      this.$emit('close', false)
    },
    changeShape(val) {
      this.formData.data = []
      if (val === 'tag') {
        this.formData.effect = 'light'
      } else if (val === 'button') {
        this.plain = false
        this.round = false
        this.circle = false
      }
      this.timeStamp = new Date().getTime()
      this.$refs.table.doLayout()
    },
    changeCheckbox(key, val) {
      this.$set(this, key, val)
      const data = this.formData.data
      const datas = []
      for (let i = 0; i < data.length; i++) {
        data[i][key] = val
        datas.push(data[i])
      }
      this.formData.data = datas
    },
    changeType(type, i) {
      this.dictionaryData[i].backgroundColor = ''
      this.dictionaryData[i].color = ''
      this.dictionaryData[i].borderColor = ''
    },
    addDisplayEffectData(typeKey = '') {
      const shape = this.formData.shape
      const data = {
        typeKey: typeKey,
        type: shape === 'tag' ? 'info' : 'primary',
        icon: '',
        color: ''
      }
      // if (shape === 'tag') {
      //   data['effect'] = 'light'
      // } else
      if (shape === 'icon') {
        data.icon = ''
        data.color = ''
      } else if (this.formData.shape === 'button') {
        data['plain'] = false
        data['round'] = false
        data['circle'] = false
      }
      this.formData.data.push(data)
    },
    initDisplayEffectData() {
      if (this.$utils.isNotEmpty(this.formData.data)) {
        this.$confirm('当前有数据，请确认是否覆盖数据？', '提示信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '覆盖',
          cancelButtonText: '取消'
        }).then(() => {
          this.formData.data = []
          this.initDisplayEffectDataValue()
        })
          .catch(action => {
          })
      } else {
        this.initDisplayEffectDataValue()
      }
    },
    initDisplayEffectDataValue() {
      this.loading = true
      for (let i = 0; i < this.dictionaryData.length; i++) {
        const data = this.dictionaryData[i]
        this.addDisplayEffectData(data.key)
      }
      this.loading = false
    },
    removeDisplayEffectData(i, row) {
      this.formData.data.splice(i, 1)
    }
  }
}
</script>
<style lang="scss">
  .display-effect-icon{
    .el-button{
      white-space: normal;
    }
  }
  .display-effect-button{
    .el-checkbox__label{
      font-size: 12px;
      color: #909399;
      font-weight: bold;
    }
  }
</style>
