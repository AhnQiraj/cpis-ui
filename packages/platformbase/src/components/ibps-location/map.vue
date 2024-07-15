<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="70%"
    top="5vh"
    class="ibps-dialog-80"
    @close="closeDialog"
  >
    <div class="amap-location-page-container">
      <el-amap
        ref="map"
        :vid="'amapLocationVid'"
        :center="center"
        :zoom="zoom"
        :plugin="plugin"
      >
        <el-amap-marker v-if="$utils.isNotEmpty(geolocation)" :position="geolocation.lnglat" />
        <el-amap-circle
          :center="center"
          :radius="radius"
          fill-color="rgba(255, 255,255, 0.5)"
          :fill-opacity="0.3"
          stroke-color="#409eff"
          :stroke-weight="2"
          bubble
          :events="events"
        />
      </el-amap>
    </div>
    <div v-if="$utils.isNotEmpty(geolocation)" class="ibps-pt-5">
      <div class="ibps-pt-5">{{ geolocation.address }}</div>
      纬度：{{ geolocation.lnglat[0] }}，经度：{{ geolocation.lnglat[1] }}
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
const AMap = window.AMap
const defaultPosition = [113.4367238, 23.1613096]
export default {
  props: {
    visible: Boolean,
    radius: {
      type: Number,
      default: 500
    },
    limits: Array
  },
  data() {
    const _this = this
    return {
      title: '选择定位',
      dialogVisible: false,
      toolbars: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ],
      center: defaultPosition,
      zoom: 15,
      geolocation: {},
      events: {
        click: e => {
          const lnglat = e.lnglat
          if (lnglat) {
            const geocoder = new window.AMap.Geocoder({
              city: '全国' // 默认：“全国”
            })
            geocoder.getAddress(lnglat, (status, result) => {
              if (result && result.regeocode) {
                _this.$set(_this.geolocation, 'lnglat', [lnglat.lng, lnglat.lat])
                _this.$set(_this.geolocation, 'address', result.regeocode.formattedAddress)
              } else {
                this.$message({ message: result.message })
              }
            })
          }
        }
      },
      // 使用其他组件
      plugin: [{
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 100, // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, // 显示定位按钮，默认：true
        buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
        showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: false, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        extensions: 'all',
        pName: 'Geolocation',
        events: {
          init: o => {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                const position = [result.position.lng, result.position.lat]
                this.center = position
                _this.$set(_this.geolocation, 'lnglat', position)
                _this.$set(_this.geolocation, 'address', result.formattedAddress)
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
          }
        }
      }
      ]
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
    this.geolocation = null
    this.events = null
    this.plugin = null
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    checkRange() {
      if (this.$utils.isEmpty(this.limits)) {
        return true
      }
      for (let i = 0; i < this.limits.length; i++) {
        const limit = this.limits[i]
        const distance = AMap.GeometryUtil.distance(limit.position, this.geolocation.lnglat)
        if (distance <= parseInt(limit.radius)) {
          return true
        }
      }
      return false
    },
    handleConfirm() {
      if (!this.checkRange()) {
        this.$message({
          message: '定位超出限制的范围！',
          type: 'warning'
        })
        return
      }
      // 判断当前定位是否超出范围
      this.$emit('callback', this.geolocation)
      this.closeDialog()
    }
  }
}
</script>
<style lang="scss" >
  .amap-location-page-container {
    height: 90%;
    position: relative;
  }
</style>
