<template>
  <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
    <!-- 基本属性  numberFormat-->
    <editor-base
      :form-type="formType"
      :field-item="fieldItem"
      :bo-data="boData"
      :fields="fields"
      types="switchFieldType,label,name,defaultValue,placeholder,desc,display"
      default-value-types="fixed,dynamic,formula"
    />
    <!-- 校验规则 -->
    <editor-rules
      v-if="formType==='form'"
      :field-item="fieldItem"
      types="required,custom"
    >
      <template slot="custom">
        <el-checkbox v-model="fieldOptions.range" @change="changeRange">设置位置范围</el-checkbox><help-tip prop="positionRange" />
        <div v-if="fieldOptions.range" class="ibps-m-10">
          <el-button style="width:100%;" @click="handleLocationCenter()">添加定位中心</el-button>
          <el-row v-for="(c,i) in limits" :key="i" class="ibps-pt-5">
            <el-col :span="20">{{ c.name }} </el-col>
            <el-col :span="2">
              <el-link type="primary" icon="ibps-icon-edit" @click="handleLocationCenter(i)" />
            </el-col>
            <el-col :span="2">
              <el-link type="primary" icon="ibps-icon-delete" @click="removeLocationCenter(i)" />
            </el-col>
          </el-row>
        </div>
      </template>
    </editor-rules>
    <editor-field-location
      :field-item="fieldItem"
    />
    <!-- 字段权限 -->
    <editor-rights
      :field-item="fieldItem"
      :types="formType==='form'?'hide,read':'hide'"
    />
    <!-- 布局设置 -->
    <editor-layout
      :form-type="formType"
      :field-item="fieldItem"
      types="hideLabel,labelWidth,width,customClass,mobile"
    />
    <location-center
      :visible="dialogVisible"
      :data="locationCenter"
      @callback="callback"
      @close="visible => dialogVisible = visible"
    />
  </el-form>
</template>
<script>
import typeMixin from '../mixins/type'
import EditorFieldLocation from '../editors/editor-field-location'
import LocationCenter from '../components/location-center'
export default {
  name: 'IbpsFieldLocation',
  components: {
    EditorFieldLocation,
    LocationCenter
  },
  mixins: [typeMixin],
  data() {
    return {
      dialogVisible: false,
      locationCenter: {},
      index: -1
    }
  },
  computed: {
    limits: {
      get() {
        return this.fieldOptions.limits || []
      },
      set(val) {
        this.fieldOptions.limits = val
      }
    }
  },
  beforeDestroy() {
    this.locationCenter = null
  },
  methods: {
    changeRange(val) {
      if (!val) {
        this.limits = []
      }
    },
    handleLocationCenter(i = -1) {
      this.index = i
      if (this.index > -1) {
        this.locationCenter = this.limits[i]
      } else {
        this.locationCenter = {}
      }
      this.dialogVisible = true
    },
    removeLocationCenter(i) {
      this.limits.splice(i, 1)
    },
    callback(data) {
      if (this.index > -1) {
        this.limits.splice(this.index, 1, data)
      } else {
        this.limits.push(data)
      }
    }
  }
}
</script>
