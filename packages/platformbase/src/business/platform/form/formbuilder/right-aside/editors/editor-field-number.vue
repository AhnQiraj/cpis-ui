<template>
  <div class="panel panel-default rules-panel">
    <div class="panel-heading">格式设置</div>
    <div class="panel-body">
      <div class="el-form-item ibps-mb-5">
        <!-- 格式 -->
        <div class="el-form-item__content">
          <el-select v-model="fieldOptions.number_format" style="width:100%;" @change="toggleThousands">
            <el-option value="figure" label="数值" />
            <el-option value="percent" label="百分比" />
          </el-select>
        </div>
        <!-- 保留小数位数 -->
        <div class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.keep_decimals">保留小数位数</el-checkbox>
          <el-input-number
            v-show="fieldOptions.keep_decimals"
            v-model="fieldOptions.decimal_places"
            class="ibps-ml-5"
            :min="0"
            controls-position="right"
            size="mini"
            @change="changeDecimalPlaces"
          />
        </div>
        <template v-if="fieldOptions.keep_decimals && fieldOptions.decimal_places>0">
          <div class="el-form-item__content">
            <span class="ibps-mr-10">小数是否补零</span>
            <el-switch
              v-model="fieldOptions.decimal_scale"
            />
          </div>
        </template>
        <template v-if="fieldOptions.keep_decimals">
          <div class="el-form-item__content">
            <span class="ibps-mr-10">是否四舍五入</span>
            <el-switch
              v-model="fieldOptions.is_rounding"
            />
          </div>
        </template>
        <!-- 千分符 -->
        <div v-if="fieldOptions.number_format === 'figure'" class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.thousands">显示千分符</el-checkbox>
        </div>
        <div v-if="fieldOptions.keep_decimals || fieldOptions.thousands" class="el-form-item__content">
          <div class="number-text">{{ filterNumber(text) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
export default {
  mixins: [EditorMixin],
  data() {
    return {
      text: '99999'
    }
  },
  created() {
    if (this.$utils.isEmpty(this.fieldOptions.number_format)) {
      this.$set(this.fieldOptions, 'number_format', 'figure')
    }
    if (this.$utils.isEmpty(this.fieldOptions.decimal_places)) {
      this.$set(this.fieldOptions, 'decimal_places', 0)
    }
    if (this.$utils.isEmpty(this.fieldOptions.is_rounding)) {
      this.$set(this.fieldOptions, 'is_rounding', true)
    }
  },
  methods: {
    changeDecimalPlaces(currentValue, oldValue) { // 小数位值改变
      if (currentValue === 0) {
        if (this.fieldOptions.decimal_scale) {this.fieldOptions.decimal_scale = false}
      }
    },
    toggleThousands(val) {
      this.$set(this.fieldOptions, 'thousands', false)
    },
    filterNumber(val) {
      val = Number(val)
      if (this.fieldOptions.number_format === 'percent') {
        val = val * 100
        val = this.getNumByDecimals(val)
        val += '%'
      } else {
        val = this.getNumByDecimals(val)
        if (this.fieldOptions.thousands) {
          val = this.$utils.comdify(val)
        }
      }
      return val
    },
    getNumByDecimals(val) {
      if (this.fieldOptions.keep_decimals) {
        if (this.$utils.isNotEmpty(this.fieldOptions.decimal_places)) {
          val = val.toFixed(this.fieldOptions.decimal_places)
        }
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
.number-text{
  background: #F4F5F5;
  border-radius: 3px;
  line-height: 70px;
  font-size: 20px;
  text-align: center;
  font-weight: 500;
  color: #333;
}
</style>
