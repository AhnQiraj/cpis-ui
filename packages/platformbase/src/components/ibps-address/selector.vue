<template>
  <div>
    <el-row :gutter="gutterNum">
      <el-col v-if="show(COUNTRY_KEY)" :span="span">
        <el-select ref="country" v-model="currCountry" :filterable="filterable" :placeholder="handledPlaceholder(COUNTRY_KEY)" :size="size" :no-data-text="handledNoDataText(COUNTRY_KEY)" :disabled="disabled === undefined ? false : handledDisabled(COUNTRY_KEY)" transfer style="width: 100%" @change="hasChange(COUNTRY_KEY)">
          <el-option v-for="item in countryList" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-col>
      <el-col v-if="show(PROVINCE_KEY)" :span="span">
        <el-select ref="prov" v-model="currProvince" :filterable="filterable" :placeholder="handledPlaceholder(PROVINCE_KEY)" :size="size" :no-data-text="handledNoDataText(PROVINCE_KEY)" :disabled="disabled === undefined ? false : handledDisabled(PROVINCE_KEY)" transfer style="width: 100%" @change="hasChange(PROVINCE_KEY)">
          <el-option v-for="item in provinceList" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-col>
      <el-col v-if="show(CITY_KEY)" :span="span">
        <el-select ref="city" v-model="currCity" :filterable="filterable" :placeholder="handledPlaceholder(CITY_KEY)" :size="size" :no-data-text="handledNoDataText(CITY_KEY)" :disabled="disabled === undefined ? false : handledDisabled(CITY_KEY)" transfer style="width: 100%" @change="hasChange(CITY_KEY)">
          <el-option v-for="item in cityList" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-col>
      <el-col v-if="show(DISTRICT_KEY)" :span="span">
        <el-select ref="district" v-model="currDistrict" :filterable="filterable" :placeholder="handledPlaceholder(DISTRICT_KEY)" :size="size" :no-data-text="handledNoDataText(DISTRICT_KEY)" :disabled="disabled === undefined ? false : handledDisabled(DISTRICT_KEY)" transfer style="width: 100%" @change="hasChange(DISTRICT_KEY)">
          <el-option v-for="item in districtList" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-col>
      <el-col v-if="show(STREET_KEY)" :span="span">
        <el-select ref="stre" v-model="currStreet" :filterable="filterable" :placeholder="handledPlaceholder(STREET_KEY)" :size="size" :no-data-text="handledNoDataText(STREET_KEY)" :disabled="disabled === undefined ? false : handledDisabled(STREET_KEY)" transfer style="width: 100%" @change="hasChange(STREET_KEY)">
          <el-option v-for="item in streetList" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-col>
    </el-row>
    <slot />
  </div>
</template>
<script>
import { get } from "./util/areaData"
import util from "./util"
const dataTypeArr = util.dataTypeArr
const levelArr = util.levelArr
const ROOT_VALUE = "0"
export default {
  name: "IbpsAddressSelector",
  props: {
    value: {
      type: Array
    },
    gutter: {
      type: [String, Number],
      default: 10
    },
    top: {
      // country、province、city、district、street
      type: String,
      default: "country",
      validator: val => {
        return util.oneOf(val, levelArr)
      }
    },
    topVal: {
      type: String,
      default: ROOT_VALUE
    },
    level: {
      type: String,
      default: "district",
      validator: val => {
        return util.oneOf(val, levelArr)
      }
    },
    filterable: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    dataType: {
      type: String,
      default: "all",
      validator: val => {
        return util.oneOf(val, dataTypeArr)
      }
    },
    auto: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: [Array, String],
      default() {
        return this.defaultPlaceholder
      }
    },
    size: {
      type: String,
      default: "small"
    },
    notFoundText: {
      type: [String, Array],
      default() {
        return this.defaultnotFoundText
      }
    },
    disabled: {
      type: [Boolean, Array, Number, String],
      default: false
    }
  },
  data() {
    return {
      areaData: [],
      currCountry: "", // 国家名称
      currProvince: "",
      currCity: "",
      currDistrict: "",
      currStreet: "",
      countryIndex: 0, // 国家code
      provinceIndex: 0,
      cityIndex: 0,
      districtIndex: 0,
      streetIndex: 0,
      countryList: {},
      provinceList: {},
      cityList: {},
      districtList: {},
      streetList: {},
      // ====================
      COUNTRY_KEY: "country",
      PROVINCE_KEY: "province",
      CITY_KEY: "city",
      DISTRICT_KEY: "district",
      STREET_KEY: "street",
      isInit: true,
      defaultPlaceholder: this.$t("components.address.defaultPlaceholder"),
      defaultnotFoundText: this.$t("components.address.defaultnotFoundText"),
      cloneValue: []
    }
  },
  computed: {
    gutterNum() {
      return typeof this.gutter === "number" ? this.gutter : parseInt(this.gutter)
    },
    showLevel() {
      return util.getLevelIndex(this.level)
    },
    span() {
      const curlevel = util.getLevelIndex(this.level) - util.getLevelIndex(this.top)
      if (curlevel > -1) {
        // 取整
        return parseInt(24 / (curlevel + 1), 10)
      } else {
        return null
      }
    }
  },
  watch: {
    // 当前 国家
    currCountry(name) {
      this.updateNextSelector("countryIndex", "countryList", "provinceList", name, "currProvince", "country")
      if (this.level === "country" || !this.auto) {
        this.returnRes("country")
      }
    },
    // 当前 省
    currProvince(name) {
      this.updateNextSelector("provinceIndex", "provinceList", "cityList", name, "currCity", "province")
      if (this.level === "province" || !this.areaData[util.getIndex(this.countryList, name)] || !this.auto) {
        this.returnRes("province")
      }
    },
    // 当前 市
    currCity(name) {
      this.updateNextSelector("cityIndex", "cityList", "districtList", name, "currDistrict", "city")
      if (this.level === "city" || !this.areaData[util.getIndex(this.provinceList, name)] || !this.auto) {
        this.returnRes("city")
      }
    },
    // 当前 县
    currDistrict(name) {
      this.updateNextSelector("districtIndex", "districtList", "streetList", name, "currStreet", "district")
      if (this.level === "district" || !this.auto) {
        this.returnRes("district")
      }
    },
    // 当前 街道
    currStreet(name) {
      this.streetIndex = util.getIndex(this.streetList, name)
      if (this.level === "street" || !this.auto) {
        this.returnRes("street")
      }
    },
    value() {
      this.initData()
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.cloneValue = null
    this.areaData = null
  },
  methods: {
    init() {
      get(this.data).then(data => {
        this.areaData = data
        this.initData()
        this.initDefaultValue()
      })
    },
    initData() {
      // 设置顶部值
      const topList = this.areaData[this.topVal]
      if (this.top === "country") {
        this.countryList = topList
      } else if (this.top === "province") {
        this.provinceList = topList
      } else if (this.top === "city") {
        this.cityList = topList
      } else if (this.top === "district") {
        this.districtList = topList
      } else if (this.top === "street") {
        this.streetList = topList
      }
      // 设置初始值
      if (this.value && this.value.length > 0) {
        this.cloneValue = this.value
        if (this.dataType === "all") {
          if (this.value[0] && this.value[0].code && topList[this.value[0].code]) {
            this.updateTopValue(topList, this.value[0].code)
          }
        } else if (this.dataType === "name") {
          if (this.value[0] && util.getIndex(topList, this.value[0])) {
            this.updateTopNameValue(topList, this.value[0])
          }
        } else if (this.dataType === "code") {
          if (this.value[0] && topList[this.value[0]]) {
            this.updateTopValue(topList, this.value[0])
          }
        }
      }
    },
    updateTopValue(topList, code) {
      if (this.top === "country") {
        this.currCountry = topList[code]
        this.countryIndex = code
      } else if (this.top === "province") {
        this.currProvince = topList[code]
        this.provinceIndex = code
      } else if (this.top === "city") {
        this.currCity = topList[code]
        this.cityIndex = code
      } else if (this.top === "district") {
        this.currDistrict = topList[code]
        this.districtIndex = code
      } else if (this.top === "street") {
        this.currStreet = topList[code]
        this.streetIndex = code
      }
    },
    updateTopNameValue(topList, name) {
      if (this.top === "country") {
        this.currCountry = name
      } else if (this.top === "province") {
        this.currProvince = name
      } else if (this.top === "city") {
        this.currCity = name
      } else if (this.top === "district") {
        this.currDistrict = name
      } else if (this.top === "street") {
        this.currStreet = name
      }
    },
    show(level) {
      const top = util.getLevelIndex(this.top)
      const thisLevel = util.getLevelIndex(this.level)
      const curLevel = util.getLevelIndex(level)
      return thisLevel >= curLevel && top <= curLevel
    },
    /**
     * 更新下级选择器
     *  index     当前index                eg：provinceIndex
     *  list      当前select 的list的key   eg：provinceList
     * nextList   下一个的list的key       eg：cityList
     *  name       当前的数据名            eg：广东
     * nextName   下一个的数据名          eg：广州
     * level      当前等级                eg：1
     */
    updateNextSelector(index, list, nextList, name, nextName, level) {
      const curLevel = util.getLevelIndex(level) - util.getLevelIndex(this.top)
      const showLevel = util.getLevelIndex(this.level)
      let nextSelected = ""
      if (curLevel > showLevel) {
        return
      }
      if (this.isInit && this.value[curLevel]) {
        // 初始化当前等级的值
        name = this.getCurName(name, this.value, curLevel, list)
      }
      this[index] = util.getIndex(this[list], name)
      if (this.areaData[this[index]]) {
        if (this[index] === undefined) {
          this.$refs[nextList.substr(0, 4)].setQuery("")
        }
        this[nextList] = this.areaData[this[index]]
        if (this.isInit && this.cloneValue[curLevel + 1]) {
          // 初始化下一个值
          nextSelected = this.getCurName(nextSelected, this.cloneValue, curLevel + 1, nextList)
        }
        if (this.isInit && this.value.length !== 0) {
          this[nextName] = nextSelected || this.setNextSelect(index)
        } else if (!this.isInit && this.auto) {
          this[nextName] = nextSelected || this.setNextSelect(index)
        }
        if (this.isInit && curLevel === showLevel) {
          this.returnRes(curLevel)
        }
      } else {
        this[nextName] = ""
        this[nextList] = []
      }
      // 没有这样的数据
      // if ((this[nextName] === '市辖区' && this.auto) || (this[nextName] === '市辖区' && this.value.length !== 0)) {
      //   this.updateNextSelector('cityIndex', 'cityList', 'districtList', '市辖区', 'currDistrict', 'city')
      // }
    },
    getCurName(name, value, curLevel, list) {
      const valueItem = value[curLevel]
      if (this.dataType === "all") {
        if (valueItem && valueItem.name && util.getIndex(this[list], valueItem.name)) {
          return valueItem.name
        }
      } else {
        if (isNaN(parseInt(valueItem))) {
          if (util.getIndex(this[list], valueItem)) {
            return valueItem
          }
        } else {
          if (Object.keys(this[list]).indexOf(valueItem) > -1) {
            if (curLevel === 0) {
              return this.areaData[this.topVal][valueItem]
            } else {
              return this.areaData[value[curLevel - 1]][valueItem]
            }
          }
        }
      }
      return name
    },
    setNextSelect(index) {
      return this.areaData[this[index]][Object.keys(this.areaData[this[index]])[0]]
    },
    returnRes(level) {
      if (this.auto) {
        this.returnResArr(this.showLevel)
      } else {
        this.returnResArr(util.getLevelIndex(level))
      }
    },
    /**
     * 设置结果值
     */
    returnResArr(level) {
      const res = []
      let i = 0
      const codeArr = [this.countryIndex, this.provinceIndex, this.cityIndex, this.districtIndex, this.streetIndex]
      const nameArr = [this.currCountry, this.currProvince, this.currCity, this.currDistrict, this.currStreet]
      if (this.dataType === "all") {
        while (i <= level) {
          if (codeArr[i] && nameArr[i]) {
            const item = {
              code: codeArr[i],
              name: nameArr[i]
            }
            res.push(item)
          }
          i++
        }
      } else if (this.dataType === "name") {
        // 名称
        while (i <= level) {
          if (nameArr[i]) {
            res.push(nameArr[i])
          }
          i++
        }
      } else {
        while (i <= level) {
          if (codeArr[i]) {
            res.push(codeArr[i])
          }
          i++
        }
      }
      this.$emit("input", res)
      this.$emit("change", res)
    },
    /**
     * 判断是否有改变
     */
    hasChange(level) {
      this.isInit = false
      // 级联下个级别的展示值为空
      if (level === "province") {
        this.currCity = ""
      } else if (level === "city") {
        this.currDistrict = ""
      } else if (level === "district") {
        this.currStreet = ""
      }
    },
    /**
     * 处理 占位符
     */
    handledPlaceholder(level) {
      if (this.placeholder !== "" && typeof this.placeholder === "string") {
        return this.placeholder
      } else {
        const curLevel = util.getLevelIndex(level)
        if (this.placeholder && this.placeholder[curLevel]) {
          return this.placeholder[curLevel]
        } else {
          return this.defaultPlaceholder[curLevel]
        }
      }
    },
    /**
     * 处理 选项为空时显示的文字
     */
    handledNoDataText(level) {
      const index = util.getLevelIndex(level)
      if (typeof this.notFoundText === "string" && this.notFoundText !== "") {
        return this.notFoundText
      } else {
        if (!this.notFoundText) {
          return this.defaultnotFoundText[index]
        } else {
          if (this.notFoundText[index]) {
            return this.notFoundText[index]
          } else {
            return this.defaultnotFoundText[index]
          }
        }
      }
    },
    /**
     * 处理 禁用的
     */
    handledDisabled(level) {
      const curLevel = util.getLevelIndex(level)
      if (typeof this.disabled === "string") {
        // 字符串
        if (util.oneOf(this.disabled, levelArr)) {
          const curDisabled = util.getLevelIndex(this.disabled)
          if (curLevel >= curDisabled) {
            return true
          } else {
            return false
          }
        }
      } else if (typeof this.disabled === "number") {
        if (this.disabled <= levelArr.length) {
          if (curLevel >= this.disabled) {
            return true
          } else {
            return false
          }
        }
      } else if (Array.isArray(this.disabled)) {
        let i = 0
        let isDisabled = false
        while (this.disabled[i]) {
          const curDisabled = typeof this.disabled === "number" ? this.disabled[i] : util.getLevelIndex(this.disabled[i])
          if (curDisabled === curLevel) {
            isDisabled = true
            break
          }
          i++
        }
        return isDisabled
      } else {
        return this.disabled
      }
    }
  }
}
</script>
