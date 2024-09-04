<template>
  <el-dialog :visible.sync="dialogVisible" width="1200px" top="10vh" :close-on-click-modal="false" @close="handleDialogClose('dialogForm')">
    <div style="font-family: 微软雅黑;display: flex;flex-direction: column;align-items: center;height: calc(100% - 50px);">
      <div id="printStyle" ref="print" style="-webkit-print-color-adjust:exact;-moz-print-color-adjust:exact;-ms-print-color-adjust:exact;print-color-adjust:exact;">
        <div v-for="(item, index) in data" :id="'code' + index" :key="index" style="position: relative;width: 1010px;padding-top: 25px;margin-bottom: 20px;zoom: 0.37;background-color: #42a1ff;" :style="item.mainStyle">
          <div style="padding: 40px 0;background-color: #fff;text-align: center;">
            <div style="font-size: 50px;font-weight: bold;line-height: 50px;" :style="{ 'color': item.headerColor }">{{ item.header || company }}</div>
          </div>
          <div style="display: flex;align-items: center;padding: 40px;background-color: #42a1ff;" :style="item.mainStyle">
            <div style="flex-grow: 1;color: #fff;">
              <div style="">
                <div style="font-size: 40px;">区域编码：</div>
                <div style="font-size: 48px;font-weight: bold;">{{ item.no }}</div>
              </div>
              <div style="margin-top: 50px;">
                <div style="font-size: 40px;">区域名称：</div>
                <div style="font-size: 48px;font-weight: bold;">{{ item.name }}</div>
              </div>
            </div>
            <div style="position: relative;padding: 20px;background: #fff;box-sizing: border-box;">
              <img :src="item.code" style="position: absolute;left: 47%;top: 47%;width: 80px;height: 80px;margin-top: -32px;margin-left: -32px;background: #fff;padding: 8px;" />
              <div ref="codeItem" />
            </div>
          </div>
          <div style="position: absolute;left: 20px;top: 25px;">
            <img v-if="item.shuiyin" :src="item.shuiyin" />
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="handleBatchPrintCode">{{ $t('common.buttons.print') }}</el-button>
      <el-button type="primary" @click="clickGeneratePicture">{{ $t('common.buttons.export') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import QRCode from 'qrcodejs2'
import Print from '@cupu/utils/printQrCode'
import Vue from 'vue'
Vue.use(Print)
import domtoimage from 'dom-to-image'
export default {
  name: 'CpQrCode',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      company: ''
    }
  },
  created() {
    this.company = window.config.VUE_APP_QRCODE_COMPANY
  },
  methods: {
    handleData() {
      this.$nextTick(() => {
        this.data.forEach((item, index) => {
          let code = 'TYPE=' + this.type + '&ID=' + item.id + '&NO=' + item.no + '&NAME=' + item.name
          this.$refs.codeItem[index].innerHTML = ''
          new QRCode(this.$refs.codeItem[index], { text: code, width: 364, height: 364 })
        })
      })
    },
    handleDialogClose() {
      this.$emit('dialog-close-operate')
    },
    handleBatchPrintCode() {
      this.$print(this.$refs.print)
    },
    clickGeneratePicture() {
      // 生成图片
      this.data.forEach((item, index) => {
        const node = document.getElementById('code' + index) // 通过id获取dom
        domtoimage
          .toPng(node)
          .then(dataUrl => {
            // 输出图片的Base64,dataUrl
            // 下载到PC
            const a = document.createElement('a') // 生成一个a元素
            const event = new MouseEvent('click') // 创建一个单击事件
            a.download = item.name + '-' + item.no + '.png' // 设置图片名称没有设置则为默认
            a.href = dataUrl // 将生成的URL设置为a.href属性
            a.dispatchEvent(event) // 触发a的单击事件
          })
          ['catch'](function (error) {
            console.error('oops, something went wrong!', error)
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@media print {
  #printStyle {
    -webkit-print-color-adjust: exact;
    -moz-print-color-adjust: exact;
    -ms-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
