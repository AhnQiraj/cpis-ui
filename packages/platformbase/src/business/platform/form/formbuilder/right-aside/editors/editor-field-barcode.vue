<template>
  <div class="panel panel-default">
    <div class="panel-heading">条形码设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">编码格式</template>
        <el-select v-model="fieldOptions.format" style="width:100%;">
          <el-option
            v-for="item in formatOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">宽度</template>
        <el-input v-model="fieldOptions.barcode_width" type="number" placeholder="宽度" />
      </el-form-item>
      <el-form-item>
        <template slot="label">高度</template>
        <el-input v-model="fieldOptions.barcode_height" type="number" placeholder="高度" />
      </el-form-item>
      <el-form-item>
        <template slot="label">背景颜色</template>
        <el-color-picker v-model="fieldOptions.background" />
      </el-form-item>
      <el-form-item>
        <template slot="label">条码颜色</template>
        <el-color-picker v-model="fieldOptions.line_color" />
      </el-form-item>
      <el-form-item>
        <template slot="label">显示文本</template>
        <el-switch v-model="fieldOptions.display_value" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  data() {
    return {
      formatOptions: [{
        value: 'code128',
        label: 'CODE128'
      }, {
        value: 'code128a',
        label: 'CODE128A'
      }, {
        value: 'code128b',
        label: 'CODE128B'
      }, {
        value: 'code128c',
        label: 'CODE128C'
      }, {
        value: 'code39',
        label: 'CODE39'
      }, {
        value: 'ean13',
        label: 'EAN13'
      }, {
        value: 'ean8',
        label: 'EAN8'
      }, {
        value: 'ean5',
        label: 'EAN5'
      }, {
        value: 'ean2',
        label: 'EAN2'
      }, {
        value: 'upc',
        label: 'UPC'
      },
      {
        value: 'upce',
        label: 'UPCE'
      }, {
        value: 'itf',
        label: 'ITF'
      }, {
        value: 'itf14',
        label: 'ITF14'
      }, {
        value: 'msi',
        label: 'MSI'
      }, {
        value: 'msi10',
        label: 'MSI10'
      }, {
        value: 'msi11',
        label: 'MSI11'
      }, {
        value: 'msi1010',
        label: 'MSI1010'
      }, {
        value: 'msi1110',
        label: 'MSI1110'
      }, {
        value: 'pharmacode',
        label: 'pharmacode'
      }, {
        value: 'codabar',
        label: 'codabar'
      }
      ]
    }
  },
  beforeDestroy() {
    this.formatOptions = null
  }
}
</script>
