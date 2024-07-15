<template>
  <div class="panel panel-default">
    <div class="panel-heading">二维码设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">二维码版本</template>
        <el-input-number v-model="fieldOptions.version" placeholder="" :min="1" :max="40" />
      </el-form-item>
      <el-form-item>
        <template slot="label">容错级别</template>
        <el-select v-model="fieldOptions.error_correction_level" style="width:100%;">
          <el-option
            v-for="item in errorCorrectionLevelOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">二维码尺寸</template>
        <el-input-number v-model="fieldOptions.size" type="number" placeholder="尺寸" />
      </el-form-item>
      <el-form-item>
        <template slot="label">二维码掩模</template>
        <el-input-number v-model="fieldOptions.mask_pattern" :min="0" :max="7" type="number" placeholder="二维码掩模" />
      </el-form-item>
      <el-form-item>
        <template slot="label">边距</template>
        <el-input-number v-model="fieldOptions.margin" type="number" placeholder="二维码边距" />
      </el-form-item>
      <el-form-item>
        <template slot="label">间隔</template>
        <el-input-number v-model="fieldOptions.scale" type="number" placeholder="二维码间隔" />
      </el-form-item>
      <el-form-item>
        <template slot="label">质量</template>
        <el-input-number v-model="fieldOptions.quality" :min="0" :max="1" type="number" placeholder="二维码质量" />
      </el-form-item>
      <el-form-item>
        <template slot="label">实点颜色</template>
        <el-color-picker v-model="fieldOptions.color_dark" />
      </el-form-item>
      <el-form-item>
        <template slot="label">空白区颜色</template>
        <el-color-picker v-model="fieldOptions.color_light" />
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
      errorCorrectionLevelOptions: [{
        value: 'L',
        label: '最低(可遮7%)'
      }, {
        value: 'M',
        label: '低(可遮15%)'
      }, {
        value: 'Q',
        label: '中等(可遮25%)'
      }, {
        value: 'H',
        label: '高(可遮30%)'
      }
      ]
    }
  }
}
</script>
