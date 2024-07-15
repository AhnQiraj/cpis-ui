<template>
  <div class="panel panel-default ibps-editor-tag">
    <div class="panel-heading">样式设置</div>
    <div class="panel-body">
      <el-form-item label="展示形式">
        <el-radio-group v-model="fieldOptions.shape" @change="changeShape">
          <el-radio-button label="tag">标签</el-radio-button>
          <el-radio-button label="text">文本</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <template v-if="fieldOptions.shape === 'tag'">
        <el-form-item>
          <template slot="label">标签样式</template>
          <el-select v-model="fieldOptions.type" style="width:100%" @change="(val)=>{changeType(val)}">
            <el-option
              v-for="item in tagTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-link :underline="false" :type="item.value" class="ibps-fl">{{ item.label }}</el-link>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot="label">标签尺寸</template>
          <el-select v-model="fieldOptions.dimensions" style="width:100%;" placeholder="请选择">
            <el-option
              v-for="item in options.dimensions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <template v-if="fieldOptions.type !== 'custom'">
          <el-form-item label="标签主题">
            <el-radio-group v-model="fieldOptions.effect">
              <el-radio-button label="light">浅色</el-radio-button>
              <el-radio-button label="dark">深色</el-radio-button>
              <el-radio-button label="plain">纯色</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
      </template>
      <el-form-item>
        <template slot="label">字体</template>
        <el-select v-model="fieldOptions.typeface" style="width:100%;" placeholder="请选择">
          <el-option
            v-for="item in options.typeface"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">字号</template>
        <el-select v-model="fieldOptions.fontSize" style="width:100%;" placeholder="请选择">
          <el-option
            v-for="item in options.fontSize"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">加粗</template>
        <div
          class="text-bold mg-up_down "
          :class="isBold('bold')?' text-bold_active':''"
          @click="toggle('bold')"
        ><i class="ibps-icon-bold" /></div>
      </el-form-item>
      <el-form-item v-if="fieldOptions.type === 'custom' || fieldOptions.shape==='text'">
        <template slot="label">颜色</template>
        <div class="mg-up_down color-select">
          <el-color-picker
            v-model="fieldOptions.color"
            show-alpha
          />
        </div>
      </el-form-item>
      <template v-if="fieldOptions.shape === 'tag' && fieldOptions.type === 'custom'">
        <el-form-item>
          <template slot="label">背景颜色</template>
          <div class="mg-up_down color-select">
            <el-color-picker
              v-model="fieldOptions.backgroundColor"
              show-alpha
            />
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">边框</template>
          <el-radio-group v-model="fieldOptions.border">
            <el-radio-button label="none">无</el-radio-button>
            <el-radio-button label="solid">实线</el-radio-button>
            <el-radio-button label="dashed">虚线</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <template slot="label">边框颜色</template>
          <div class="mg-up_down color-select">
            <el-color-picker
              v-model="fieldOptions.borderColor"
              show-alpha
            />
          </div>
        </el-form-item>
      </template>
      <el-form-item>
        <template slot="label">位置</template>
        <el-radio-group v-model="fieldOptions.position">
          <el-radio-button label="left">居左</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">居右</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { colorOptions } from '@platform/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  data() {
    const tagTypes = JSON.parse(JSON.stringify(colorOptions))
    tagTypes.splice(0, 1)
    tagTypes.push({ value: 'custom', label: '自定义' })
    return {
      tagTypes: tagTypes,
      options: {
        dimensions: [{
          value: 'default',
          label: '默认'
        }, {
          value: 'medium',
          label: '中等'
        }, {
          value: 'small',
          label: '小型'
        }, {
          value: 'mini',
          label: '超小'
        }
        ],
        fontSize: [{
          value: 'default',
          label: '默认'
        }, {
          value: '12',
          label: '12'
        }, {
          value: '14',
          label: '14'
        }, {
          value: '16',
          label: '16'
        }, {
          value: '18',
          label: '18'
        }, {
          value: '20',
          label: '20'
        }, {
          value: '22',
          label: '22'
        }],
        typeface: [{
          value: 'default',
          label: '默认'
        }, {
          value: 'Tahoma',
          label: 'Tahoma'
        }, {
          value: 'Helvetica',
          label: 'Helvetica'
        }, {
          value: 'Verdana',
          label: 'Verdana'
        }, {
          value: 'Georgia',
          label: 'Georgia'
        }, {
          value: 'heiti',
          label: '黑体'
        }, {
          value: 'kaiti',
          label: '楷体'
        }, {
          value: 'songti',
          label: '宋体'
        }]
      }
    }
  },
  beforeDestroy() {
    this.options = null
  },
  methods: {
    changeType(type) { // 判断样式类型
      if (this.$utils.isEmpty(type)) {
        this.$set(this.fieldOptions, 'border', '')
        this.$set(this.fieldOptions, 'effect', 'light')
      } else if (type !== 'custom') {
        if (this.$utils.isEmpty(this.fieldOptions.effect)) {
          this.$set(this.fieldOptions, 'effect', 'light')
        }
        this.$set(this.fieldOptions, 'border', 'none')
      } else {
        this.$set(this.fieldOptions, 'border', 'none')
        this.$set(this.fieldOptions, 'effect', 'light')
      }
      this.$set(this.fieldOptions, 'backgroundColor', '')
      this.$set(this.fieldOptions, 'borderColor', '')
    },
    changeShape(val) {
      let _type = ''
      if (val === 'tag') {
        if (this.$utils.isNotEmpty(this.fieldOptions.type)) {return}
        _type = 'primary'
        this.$set(this.fieldOptions, 'type', _type)
        this.$set(this.fieldOptions, 'dimensions', 'default')
      } else {
        this.$set(this.fieldOptions, 'type', _type)
        this.$set(this.fieldOptions, 'dimensions', '')
      }
      this.changeType(_type)
    },
    isBold(name) { // 通过name判断是否有加粗
      if (this.$utils.isNotEmpty(this.fieldOptions) &&
        this.$utils.isNotEmpty(this.fieldOptions[name])) {
        return this.fieldOptions[name]
      }
      return false
    },
    toggle(name) { // 通过name修改指定的数据
      if (this.$utils.isEmpty(this.fieldOptions)) {
        this.$set(this.fieldOptions, name, true)
      } else if (this.$utils.isEmpty(this.fieldOptions[name])) {
        this.$set(this.fieldOptions, name, true)
      } else {
        this.fieldOptions[name] = !this.fieldOptions[name]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ibps-editor-tag{
  .text-bold{
    width: 26px;
    height: 26px;
    text-align: center;
    border: 1px solid #dfdfdf;
    border-radius: 2px;
  }
  .text-bold_active{
    background: #999999;
    color: #fff;
    border-color: #999999;
  }
  .color-select{
    height: 28px;
  }
  .mg-up_down{
    margin-top: 1px;
    margin-bottom: 1px;
  }
}
</style>
