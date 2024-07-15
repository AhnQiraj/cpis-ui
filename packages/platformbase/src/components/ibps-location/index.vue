<template>
  <div>
    <div v-if="$utils.isNotEmpty(geolocation)">
      {{ geolocation.address }}
      <div v-if="lnglat">
        纬度：{{ geolocation.lnglat[0] }}，经度：{{ geolocation.lnglat[1] }}
      </div>
    </div>
    <div v-if="!readonly">
      <el-button
        type="primary"
        :icon="adjustable?'ibps-icon-map-marker':'ibps-icon-crosshairs'"
        @click="handlerLocation"
      >{{ buttonLabel }}</el-button>
      <el-button v-if="$utils.isNotEmpty(geolocation)" type="text" @click="onClean">清空</el-button>
    </div>
    <map-dialog
      :visible="dialogVisible"
      :radius="radius"
      :limits="limits"
      @callback="callback"
      @close="visible => dialogVisible = visible"
    />
  </div>
</template>
<script>
import emitter from 'element-ui/lib/mixins/emitter'
import { isEqual } from 'element-ui/lib/utils/util'
import MapDialog from './map'
export default {
  components: {
    MapDialog
  },
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: [String, Array],
    placeholder: {
      type: String,
      default: '获取当前位置'
    },
    readonly: Boolean,
    limits: Array,
    lnglat: Boolean,
    adjustable: Boolean, // 允许微调
    radius: Number
  },
  data() {
    return {
      mapObj: null,
      geolocation: {},
      dialogVisible: false
    }
  },
  computed: {
    buttonLabel() {
      if (this.adjustable) {
        return this.$utils.isNotEmpty(this.geolocation) ? '重选定位' : '选择定位'
      } else {
        return this.$utils.isNotEmpty(this.geolocation) ? '重新获取位置' : '获取当前位置'
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.geolocation = this.$utils.isNotEmpty(val) ? JSON.parse(val) : {}
        if (!isEqual(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', [val])
        }
      },
      immediate: true
    },
    geolocation: {
      handler(val) {
        this.$emit('input', this.$utils.isNotEmpty(val) ? JSON.stringify(val) : '')
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.geolocation = null
    if (this.mapObj) {
      this.mapObj.destroy()
      this.mapObj = null
    }
  },
  methods: {
    handlerLocation() {
      if (this.adjustable) {
        this.selectPosition()
      } else {
        this.getPosition()
      }
    },
    selectPosition() {
      this.dialogVisible = true
    },
    getPosition() {
      const AMap = window.AMap
      this.mapObj = new AMap.Map('iCenter')
      this.mapObj.plugin('AMap.Geolocation', () => {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 1000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        })
        this.mapObj.addControl(geolocation)
        geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            this.geolocation = {
              lnglat: [result.position.lng, result.position.lat],
              address: result.formattedAddress
            }
          } else {
            let message = result.message
            if (message.indexOf('Geolocation permission denied') !== -1) {
              message = '用户禁用了定位权限 或者浏览器禁止了非安全域的定位请求。'
            } else if (message.indexOf('Get ipLocation failed') !== -1) {
              message = '请检查网络状况，或在手机上打开重新定位。'
            }
            this.$message().close()
            this.$message({
              type: 'warning',
              message: message
            })
          }
        })
      })
    },
    onClean() {
      this.geolocation = {}
    },
    callback(result) {
      this.$set(this.geolocation, 'lnglat', result.lnglat)
      this.$set(this.geolocation, 'address', result.address)
    }
  }
}
</script>
