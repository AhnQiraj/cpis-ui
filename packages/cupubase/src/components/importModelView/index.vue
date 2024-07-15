<template>
  <vxe-modal v-if="importVisible" v-model="importVisible" width="480" height="320">
    <template #title>
      <span>{{ $t('equipment.import.dataImport') }}</span>
    </template>
    <template #default>
      <el-alert :title="$t('equipment.import.downTempUp')" type="info" :closable="false" />
      <div style="width: 400px; margin: 0 auto; padding-top: 15px">
        <el-upload ref="upload" style="display: inline" class="upload-demo" :limit="1" :auto-upload="false" :before-upload="beforeUpload" :on-change="valid" accept=".xls, .xlsx" :http-request="httpRequestNew">
          <el-button slot="trigger" @click="downloadTpl">{{ $t('equipment.import.downloadTemp') }}</el-button>
          <el-button slot="trigger" size="small" type="primary">{{ $t('equipment.import.selectFile') }}</el-button>
          <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">{{ $t('equipment.import.uploadServer') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('equipment.import.uploadExcMore', { title: size }) }}</div>
        </el-upload>
      </div>
    </template>
  </vxe-modal>
</template>
<script>
import moment from 'moment'
export default {
  name: 'ImportModelView',
  props: {
    userInfo: {
      type: Object,
      default: null
    },
    dataCode: {
      type: String,
      default: ''
    },
    bizCode: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 5
    },
    importVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkData: {},
    }
  },
  created() {
  },
  methods: {
    /**
     * 下载模板
     */
    downloadTpl() {
      window.open(this.url)
    },
    /**
     * 导入事件
     */
    submitUpload() {
      this.$refs.upload.submit()
    },
    /**
     * 附件验证
     */
    async valid(file) {
      let isExcel = file.raw.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.raw.type == 'application/vnd.ms-excel'
      let isLt5M = file.size / 1024 / 1024 < this.size
      if (!isExcel) {
        this.$message.error(this.$t('baseCommon.message.fileFormatError'))
        this.$refs.upload.handleRemove(file)
        return false
      }
      if (!isLt5M) {
        this.$message.error(this.$t('baseCommon.message.fileSizeError', { title: this.size }))
        this.$refs.upload.handleRemove(file)
        return false
      }
      //检测在配置表中是否有配置登记记录
      let f = false
      // cpis_dio_conf注册的业务数据编码
      this.checkData.dataCode = this.dataCode
      // cpis_dio_conf注册的业务编码
      this.checkData.bizCode = this.bizCode
      await window.apiList['extend/index'].check(this.checkData).then(res => {
        if (res.data && res.data != null) {
          this.checkData = res.data
          f = true
        }
      })
      if (!f) {
        this.$message.error(this.$t('baseCommon.message.regFileUpload'))
        this.$refs.upload.handleRemove(file)
        return false
      }
      return true
    },
    async beforeUpload(file) {},
    /**
     * 提交导入
     */
    httpRequestNew(f) {
      window.apiList['file/attachment'].uploadFile(f.file).then(res => {
        if (res.state === 200) {
          let cpisDiTaskPo = {
            // 任务名
            taskName: this.checkData.bizName + moment().format('YYYYMMDDHHmmss'),
            // cpis_dio_conf注册的业务数据编码
            dataCode: this.dataCode,
            // cpis_dio_conf注册的业务编码
            bizCode: this.bizCode,
            // 初始行号
            lineNo: 0,
            // 初始执行数
            execNum: 0,
            // 初始异常数
            exceptNum: 0,
            // 文件id
            attachmentId: res.data.id,
            companyId: this.userInfo.company.companyId,
            createUser: this.userInfo.user.id,
            createUserName: this.userInfo.user.name,
            updateUser: this.userInfo.user.id,
            updateUserName: this.userInfo.user.name
          }
          let importPromise
          if (this.bizCode.startsWith('eq_')) {
            // 设备导入
            importPromise = window.apiList['equipment/index'].equipImportSync(cpisDiTaskPo);
          } else if (this.bizCode.startsWith('mat_')) {
            // 物资导入
            importPromise = window.apiList['material/index'].importSync(cpisDiTaskPo);
          } else if (this.bizCode.startsWith('oms_')) {
            // 安全导入
            importPromise = window.apiList['safety/index'].importSync(cpisDiTaskPo);
          } else if (this.bizCode.startsWith('engr_')) {
            // 工程导入
            importPromise = window.apiList['engineering/index'].importSync(cpisDiTaskPo);
          }else if (this.bizCode.startsWith('mp_')) {            
			      // 测点导入
			      importPromise = window.apiList['calculation/index'].importSync(cpisDiTaskPo);
          } else if (this.bizCode.startsWith("ins_")) {
            // 巡点检导入
            importPromise = window.apiList['inspection/index'].importSync(cpisDiTaskPo);
          } else if (this.bizCode.startsWith("exam_")) {
            // 考试导入
            importPromise = window.apiList['examination/index'].importSync(cpisDiTaskPo);
          }

          if (importPromise) {
            importPromise.then(r => {
              if (r.code === 0) {
                this.$emit('importSuccess');
                this.$message({
                  dangerouslyUseHTMLString: true,
                  type: 'success',
                  showClose: true,
                  message: this.$t('baseCommon.message.importSubProMsg') + '<a class="import-link" href="#">' + this.$t('baseCommon.buttons.vwImportRes') + '</a>'
                });
                this.importVisible = false;
              }
            });
          }
        }
      });
    }
  }
};
</script>