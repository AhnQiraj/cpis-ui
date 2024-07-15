<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="70%"
    top="2vh"
    class="ibps-dialog-90"
    @opened="opened"
    @close="closeDialog"
  >
    <div v-if="dialogVisible">
      <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" />
        <el-amap
          ref="map"
          :vid="'amapVid'"
          :center="geolocation.position"
          :resize-enable="true"
          :events="events"
          :zoom="zoom"
        >
          <el-amap-marker v-if="$utils.isNotEmpty(geolocation)" :position="geolocation.position" />
        </el-amap>
      </div>
      <div class="ibps-pt-10">
        <div v-if="$utils.isNotEmpty(geolocation)" class="ibps-pb-5">
          <el-input v-model="geolocation.name" style="width:100%;" readonly="readonly">
            <template slot="prepend">定位中心：</template>
          </el-input>
        </div>
        <el-row>
          <el-col :span="24">
            <el-input v-model="geolocation.radius" type="number" style="width:300px;">
              <template slot="prepend">定位范围：</template>
              <template slot="append">米</template>
            </el-input>
            <span class="amap-page-desc"> 以定位中心为圆心设置定位半径，建议范围500-1000</span>
          </el-col>
        </el-row>
      </div>
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
    data: Object
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
      geocoder: null,
      zoom: 15,
      defaultPosition: defaultPosition,
      geolocation: {
        name: '',
        position: defaultPosition,
        radius: 500
      },
      searchOption: {
        city: '全国'
      },
      events: {
        click: e => {
          const lnglat = e.lnglat
          if (lnglat) {
            _this.setGeolocation(lnglat)
          }
        }
      }
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
    this.geocoder = null
    this.geolocation = null
    this.toolbars = null
    this.searchOption = null
    this.events = null
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
    handleConfirm() {
      if (this.$utils.isEmpty(this.geolocation.radius)) {
        this.$message({
          message: '请设置定位范围！',
          type: 'warning'
        })
        return
      }
      if (this.$utils.isEmpty(this.geolocation.position)) {
        this.$message({
          message: '请选择定位中心！',
          type: 'warning'
        })
        return
      }
      this.$emit('callback', JSON.parse(JSON.stringify(this.geolocation)))
      this.closeDialog()
    },
    opened() {
      if (this.$utils.isEmpty(this.data)) {
        this.getPosition()
      } else {
        this.geolocation = JSON.parse(JSON.stringify(this.data))
      }
    },
    getPosition() {
      const map = this.$refs.map.$amap
      const citySearch = new AMap.CitySearch()
      citySearch.getLocalCity((status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            let citybounds = result.bounds
            // 地图显示当前城市
            map.setBounds(citybounds)
          }
        } else {
          const message = result.message
          this.$message.close()
          this.$message({ message: message })
        }
      })
    },
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          const { lng, lat } = poi
          lngSum += lng
          latSum += lat
        })
        const position = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        const center = [position.lng, position.lat]
        this.setGeolocation(center)
      }
    },
    setGeolocation(lnglat) {
      if (!this.geocoder) {
        this.geocoder = new AMap.Geocoder(this.searchOption)
      }
      this.geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          this.$set(this.geolocation, 'position', lnglat.length === 2 ? lnglat : [lnglat.lng, lnglat.lat])
          this.$set(this.geolocation, 'name', result.regeocode.formattedAddress)
        } else {
          this.$message({ message: result.message })
        }
      })
    }
  }
}
</script>
<style lang="scss" >
  .amap-page-container {
    height:  calc(100vh - 250px) !important;
    position: relative;
      .search-box{
        position: absolute !important;
        z-index: 170;
        left: 5%;
        top: 10px;
        .search-btn{
        float: left;
        width: 20%;
        height: 100%;
        background: #38f!important;
        border: 1px solid #38f!important;
        color: #fff;
      }
      .search-tips{
        width: 100%;
      }
    }
  }
    .amap-page-desc{
      margin-left: 10px;
      font-size: 12px;
      color: #989898;
    }
</style>
