<template>
  <div
    class="ibps-number-component"
    :style="{width:width,minWidth:minWidth()}"
  >
    <div class="ibps-number_content">
      <div v-if="controls && !disabled && !readonly" class="ibps-number_right" :class="!isBlur?'show':''">
        <i class="el-icon-arrow-up ibps-number_icon ibps-number_increase" :class="addDisabled?'click-disable':''" @click="count('add')" />
        <i class="ibps-number_divider" />
        <i class="el-icon-arrow-down ibps-number_icon ibps-number_decrease" :class="reduceDisabled?'click-disable':''" @click="count('reduce')" />
      </div>
      <el-input
        :ref="$utils.isEmpty(name)?'number':name"
        :value="numberModel"
        :placeholder="placeholder"
        :name="name"
        :readonly="readonly"
        :disabled="disabled"
        :autofocus="autofocus"
        :clearable="clearable"
        @blur="inputBlur"
        @focus="inputFocus"
        @keydown.native="keyDown"
        @input="change"
        @mouseup="preventDefault"
        @change="change"
        @clear="clearData"
      >
        <span v-if="$utils.isNotEmpty(currency) && position === 'front'" slot="prepend">{{ currency }}</span>
      </el-input>
    </div>
    <span v-if="$utils.isNotEmpty(currency) && position === 'behind'" class="ibps-number_currency">{{ currency }}</span>
  </div>
</template>
<script>
import Big from 'big.js'
export default {
  props: {
    type: { // 类型
      type: String,
      default: 'number'
    },
    value: { // 数据
      type: [String, Number]
    },
    placeholder: { // 输入框占位文本
      type: String,
      default: '请输入'
    },
    name: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    width: {
      type: String
    },
    decimalScale: { // 小数位是否补零
      type: Boolean,
      default: false
    },
    keepDecimals: { // 是否保留小数位，false时保留所有的数据
      type: Boolean,
      default: false
    },
    thousands: { // 是否显示千分符
      type: Boolean,
      default: false
    },
    numberFormat: { // 数字格式(数值 figure，百分比 percent)
      type: String,
      default: 'figure'
    },
    precision: { // 精度
      type: Number
    },
    max: { // 最大值
      type: Number,
      default: Infinity
    },
    min: { // 最小值
      type: Number,
      default: -Infinity
    },
    step: { // 步进,小数位的长度不能大于精度
      type: Number,
      default: 1
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    controls: { // 是否使用控制按钮
      type: Boolean,
      default: true
    },
    autofocus: { // 自动获取焦点
      type: Boolean,
      default: false
    },
    currency: { // 货币符号
      type: String
      // default: '$'
    },
    position: { // 货币符号位置：前：front，后：after，在输入框后面：behind
      type: String,
      default: 'front'
    },
    isRounding: { // 当数据超出限制时，是否四舍五入
      type: Boolean,
      default: true
    },
    activeChange: { // 是否实时响应数据，设置为 false 时，只会在失焦时更改数据
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dataModel: this.value,
      numberModel: this.filterNumber(this.value),
      addDisabled: false,
      reduceDisabled: false,
      isBlur: true // 是否失去焦点
    }
  },
  watch: {
    value(val) {
      this.dataModel = val
    },
    dataModel(val) {
      if (this.isBlur) {
        this.numberModel = this.filterNumber(this.dataModel)
      }
      this.changeCntrols(val)
    },
    min() {
      this.changeCntrols(this.dataModel)
    },
    max() {
      this.changeCntrols(this.dataModel)
    },
    decimalScale() { // 小数位是否补零
      this.numberModel = this.filterNumber(this.dataModel)
    },
    keepDecimals() { // 是否保留小数位
      this.numberModel = this.filterNumber(this.dataModel)
    },
    thousands() { // 是否显示千分符
      this.numberModel = this.filterNumber(this.dataModel)
    },
    numberFormat() { // 数字格式(数值 figure，百分比 percent)
      this.numberModel = this.filterNumber(this.dataModel)
    },
    precision() { // 精度
      this.numberModel = this.filterNumber(this.dataModel)
    },
    position() { // 货币符号位置：前：front，后：after
      this.numberModel = this.filterNumber(this.dataModel)
    },
    currency() { // 货币符号
      this.numberModel = this.filterNumber(this.dataModel)
    }
  },
  beforeDestroy() {
    this.numberModel = null
  },
  methods: {
    minWidth() {
      if (this.$utils.isNotEmpty(this.currency) && this.position === 'front') {
        return '150px'
      }
      return '100px'
    },
    filterNumber(val) {
      if (!this.$utils.isNum(val)) {return ''}
      if (this.numberFormat === 'percent') {
        val = new Big(val).times(100).valueOf()
        val = this.getNumByDecimals(val)
        val += '%'
      } else {
        val = this.getNumByDecimals(val)
        if (this.thousands) {
          val = this.$utils.comdify(val)
        }
      }
      if (this.$utils.isNotEmpty(this.currency) && this.position === 'after') {
        val += (' ' + this.currency)
      }
      return val
    },
    getNumByDecimals(val, type) {
      let temp = new Big(val)
      let name = 'floor'
      if (this.keepDecimals) {
        if (this.$utils.isNotEmpty(this.precision) && this.precision >= 0) {
          let precision = this.precision
          if (this.numberFormat === 'percent' && type === 'blur') {
            precision += 2
          }
          if (this.decimalScale) { // 不足是否进行补零
            if (!this.isRounding) { // 舍下
              temp = this.decimalCalculation(temp, precision, name)
            }
            return temp.toFixed(precision) // 不足则进行补零
          } else {
            if (this.isRounding) { // 四舍五入
              name = 'round'
            }
            temp = this.decimalCalculation(temp, precision, name)
          }
        }
      }
      return temp.valueOf()
    },
    // big类型小数位进行计算(四舍五入round、舍下floor)
    decimalCalculation(val, precision, type = 'floor') {
      const _multiple = Math.pow(10, precision)
      const _num = Math[type](val.times(_multiple).valueOf())
      return new Big(_num).div(_multiple)
    },
    keyDown(e) {
      if (e.keyCode === 38 && !this.addDisabled) {
        this.preventDefault(e)
        this.add('add', this.numberModel, 'key')
      } else if (e.keyCode === 40 && !this.reduceDisabled) {
        this.preventDefault(e)
        this.reduce('reduce', this.numberModel, 'key')
      } else if (e.keyCode === 13) {
        this.preventDefault(e)
        // 输入框取消焦点
        const _name = this.$utils.isEmpty(this.name) ? 'number' : this.name
        this.$refs[_name].blur()
      }
    },
    change(data) { // 输入时限制只能输入数字
      data = data.replace(/[^(\-)\d.]/g, '')
      if (data.length > 1) {
        const str = data.substring(1).replace(/[^\d.]/g, '')
        data = data.substring(0, 1) + str
      }
      const arr = data.split('.')
      if (this.$utils.isNotEmpty(arr) && arr.length >= 2) {
        data = arr[0] + '.' + arr.slice(1).join('')
      }
      this.numberModel = data
      this.inputValByActiveChange()
    },
    clearData() {
      if (!this.activeChange) {
        this.dataModel = this.getVal(this.numberModel, 'blur')
        this.changeVal(this.dataModel)
      }
    },
    inputValByActiveChange() { // 是否实时响应数据
      if (this.activeChange) {
        this.dataModel = this.getVal(this.numberModel, 'blur')
        this.changeVal(this.dataModel)
      }
    },
    preventDefault(e) {
      e.preventDefault()
    },
    getNumByFormat() { // 通过格式设置值
      const val = this.dataModel
      if (!this.$utils.isNum(val)) {return '0'}
      if (this.numberFormat === 'percent') {
        return new Big(val).times(100).valueOf()
      }
      return val
    },
    count(type) {
      const val = this.getNumByFormat()
      if (type === 'add') {this.add(type, val)}
      else {this.reduce(type, val)}
    },
    add(type, val, key) { // 步进添加
      // 先判断是否可以进行操作
      if (this.addDisabled) {return}
      if (!this.judgeStep()) {return}
      this.changeByStep(type, val, key)
    },
    reduce(type, val, key) { // 步进减少
      if (this.reduceDisabled) {return}
      if (!this.judgeStep()) {return}
      this.changeByStep(type, val, key)
    },
    changeByStep(type, data, key) { // 通过步进数改变值
      if (!this.$utils.isNum(data)) {return}
      let val
      if (type === 'add') {
        val = this.addNum(data, this.step, type)
      } else {
        val = this.addNum(data, this.step, type)
      }
      this.setValue(val, key)
    },
    setValue(val, key) { // 设置numberModel的值
      if (this.$utils.isNum(val)) {
        val = new Big(val)
        if (this.$utils.isNum(this.precision)) {
          val = new Big(val.toFixed(this.precision))
        }
        if (this.max === Infinity) {
          this.addDisabled = false
        } else {
          let _max = new Big(this.max)
          if (this.numberFormat === 'percent') {
            _max = _max.times(100)
          }
          if (val.cmp(_max) >= 0) {
            val = _max
            this.addDisabled = true
          } else if (this.addDisabled) {
            this.addDisabled = false
          }
        }
        if (this.min === -Infinity) {
          this.reduceDisabled = false
        } else {
          let _min = new Big(this.min)
          if (this.numberFormat === 'percent') {
            _min = _min.times(100)
          }
          if (val.cmp(_min) <= 0) {
            val = _min
            this.reduceDisabled = true
          } else if (this.reduceDisabled) {
            this.reduceDisabled = false
          }
        }
        val = val.valueOf()
      }
      this.numberModel = val
      if (this.$utils.isEmpty(key)) {
        this.inputBlur()
      } else {
        this.inputValByActiveChange()
      }
    },
    addNum(num, step, type) { // 对传入的值num进行添加addNum
      let val = new Big(num)
      if (type === 'add') {
        val = val.plus(step).valueOf()
      } else {
        val = val.minus(step).valueOf()
      }
      return val
    },
    getVal(val, type) { // 通过获取焦点、失去焦点对值进行格式设置
      let temp = val
      if (this.$utils.isNum(temp)) {
        temp = new Big(temp)
        if (this.numberFormat === 'percent') {
          if (type === 'blur') {temp = temp.div(100)}
          else {temp = temp.times(100)}
        }
        if (this.max !== Infinity) {
          let _max = new Big(this.max)
          if (this.numberFormat === 'percent' && type === 'focus') {_max = _max.times(100)}
          if (temp.cmp(_max) > 0) {
            this.$message({
              message: `输入的数字最大值为${this.max},已将数据更改为最大值！`,
              type: 'warning'
            })
            temp = _max
          }
        }
        if (this.min !== -Infinity) {
          let _min = new Big(this.min)
          if (this.numberFormat === 'percent' && type === 'focus') {_min = _min.times(100)}
          if (temp.cmp(_min) < 0) {
            this.$message({
              message: `输入的数字最小值为${this.min},已将数据更改为最小值！`,
              type: 'warning'
            })
            temp = _min
          }
        }
        if (this.keepDecimals && this.$utils.isNotEmpty(this.precision)) {
          let _precision = this.precision
          if (this.numberFormat === 'percent' && type === 'blur') {
            _precision += 2
          }
          // 判断当前输入的数字是否超出限制的精度
          const _nums = temp.toString().split('.')
          if (_nums.length > 1 && _nums[1].length > _precision) {
            this.$message({
              message: `输入的数字小数位数为${this.precision},已将数据格式化！`,
              type: 'warning'
            })
          }
        }
        temp = this.getNumByDecimals(temp.valueOf(), type)
      }
      return temp
    },
    judgeStep() { // 判断步进是否超出小数限制范围
      if (!this.$utils.isNum(this.precision)) {return true}
      const arr = this.step.toString().split('.')
      let len = 0
      if (arr.length === 2) {
        len = arr[1].length
      }
      if (len > this.precision) {
        this.$message({
          message: `当前步进为${this.step},只保留${this.precision}位小数,步进计数无效,请在输入框进行输入!`,
          type: 'warning'
        })
        return false
      }
      return true
    },
    changeVal(val) { // 改变值后向父组件传值
      // 如果需要返回数字模式，则小数后多余的零会被清空
      if (this.$utils.isNum(val)) {val = Number(val)}
      this.$emit('change', val)
      this.$emit('input', val)
    },
    inputBlur() { // 输入框失去焦点
      this.isBlur = true
      this.dataModel = this.getVal(this.numberModel, 'blur')
      this.numberModel = this.filterNumber(this.dataModel)
      this.changeVal(this.dataModel)
    },
    inputFocus() { // 输入框获取焦点
      this.isBlur = false
      this.numberModel = this.getVal(this.dataModel, 'focus')
    },
    changeCntrols(val) { // 对控制按钮限制是否禁用
      val = Number(val)
      if (!isNaN(val)) {
        const step = this.step
        this.addDisabled = val + step > this.max
        this.reduceDisabled = val - step < this.min
      } else {
        this.addDisabled = true
        this.reduceDisabled = true
      }
    }
  }
}
</script>
