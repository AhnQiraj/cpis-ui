<template>
  <div class="panel panel-default">
    <div class="panel-heading">图片设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">图片类型<help-tip prop="imageType" /></template>
        <el-select v-model="fieldOptions.accept" style="width:100%;">
          <el-option value="" label="不限制" />
          <el-option
            v-for="item in imageTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
          <el-option value="custom" label="自定义" />
        </el-select>
        <el-input
          v-if="fieldOptions.accept==='custom'"
          v-model="fieldOptions.media"
          type="textarea"
          rows="1"
          resize="none"
          autosize
          placeholder="自定义图片类型,逗号[,]分割"
          style="padding-top:5px;"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">图片大小<help-tip prop="imageSize" /></template>
        <el-input v-model="fieldOptions.size" placeholder="图片大小（单个）" type="text" @change="(val)=>changeImageSet(val,'size')"><template slot="append">M</template></el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">图片尺寸<help-tip prop="imageWidthAndHeight" /></template>
        <el-input v-model="fieldOptions.width" placeholder="宽度" type="text" @change="(val)=>changeImageSet(val,'width')">
          <template slot="prepend">宽度大小</template>
          <template slot="append">px</template>
        </el-input>
        <p />
        <el-input v-model="fieldOptions.height" placeholder="高度" type="text" @change="(val)=>changeImageSet(val,'height')">
          <template slot="prepend">高度大小</template>
          <template slot="append">px</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">图片数量<help-tip prop="imageLimit" /></template>
        <el-input-number v-model="fieldOptions.limit" :min="1" style="width:100%" />
      </el-form-item>
      <el-form-item>
        <template slot="label">上传方式<help-tip prop="uploadType" /></template>
        <el-select v-model="fieldOptions.uploadType" style="width:100%;">
          <el-option
            v-for="item in uploadTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">提示信息<help-tip prop="imagePlaceholder" /></template>
        <el-input v-model="fieldOptions.tip" rows="3" placeholder="" type="textarea" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { imageTypeOptions, uploadTypeOptions } from '@platform/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  data() {
    return {
      imageTypeOptions: imageTypeOptions,
      uploadTypeOptions: uploadTypeOptions
    }
  },
  beforeDestroy() {
    this.imageTypeOptions = null
    this.uploadTypeOptions = null
  },
  methods: {
    changeImageSet(val, property) {
      const imagePropertyValue = parseInt(val)
      if (imagePropertyValue < 0 || isNaN(imagePropertyValue)) {
        property === 'size' ? this.fieldOptions.size = '' : property === 'width' ? this.fieldOptions.width = '' : this.fieldOptions.height = ''
        this.$message({
          message: '只能设置不能输入小于0的数字',
          type: 'warning'
        })
      }
    }
  }
}
</script>
