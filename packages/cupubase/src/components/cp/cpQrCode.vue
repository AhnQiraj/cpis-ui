<template>
  <el-dialog :visible.sync="dialogVisible" width="50%" top="10vh" :close-on-click-modal="false" @close="handleDialogClose('dialogForm')">
    <div style="font-family: 微软雅黑;display: flex;flex-direction: column;align-items: center;height: calc(100% - 50px);">
      <div id="printStyle" ref="print" style="-webkit-print-color-adjust:exact;-moz-print-color-adjust:exact;-ms-print-color-adjust:exact;print-color-adjust:exact;">
        <div v-for="(item, index) in data" :id="'code' + index" :key="index" style="margin-bottom: 20px;width: 600px;border-radius: 10px;background-color: #fff;" :style="{ 'width': width }">
          <div style="display: flex;align-items: center;padding: 10px;background-color: #eee;">
            <img :src="item.logo" style="width: 60px;" />
            <div style="margin-left: 15px;font-size: 32px;font-weight: 600;" :style="{ 'color': item.headerColor }">{{ item.header || company }}</div>
          </div>
          <!-- <div style="color: #42a1ff;font-size: 32px;font-weight: 800;text-align: center;letter-spacing: 10px;margin-bottom: 10px;" :style="{ 'color': item.markColor }">{{ item.mark }}</div> -->
          <div style="width: 100%;background-color: #42a1ff;display: flex;align-items: center;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;" :style="item.mainStyle ">
            <div style="display: inline-block;position: relative;padding: 2px;background: #fff;margin: 8px;box-sizing: border-box;">
              <img :src="item.code" style="position: absolute;left: 50%;top: 50%;width: 45px;height: 45px;margin-top: -25px;margin-left: -25px;background: #fff;padding: 4px;border-radius: 4px;" />
              <div ref="codeItem" />
            </div>
            <div style="color: #fff;font-size: 20px;margin-left: 10px;">
              <div style="display: flex;">
                <div style="width: 60px;">编码：</div>
                <div>{{ item.no }}</div>
              </div>
              <div style="display: flex;margin-top: 26px;">
                <div style="width: 60px;">名称：</div>
                <div>{{ item.name }}</div>
              </div>
            </div>
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
import QRCode from 'qrcodejs2-fixes'
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
      company: '',
      width: ''
    }
  },
  created() {
    this.width = '500px'
    this.company = window.config.VUE_APP_QRCODE_COMPANY
  },
  methods: {
    handleData() {
      this.$nextTick(() => {
        this.data.forEach((item, index) => {
          let code = 'TYPE=' + this.type + '&ID=' + item.id + '&NO=' + item.no + '&NAME=' + item.name
          this.$refs.codeItem[index].innerHTML = ''
          new QRCode(this.$refs.codeItem[index], { text: code, width: 150, height: 150 })
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
<style scoped>
@media print {
  #printStyle {
    -webkit-print-color-adjust: exact;
    -moz-print-color-adjust: exact;
    -ms-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
