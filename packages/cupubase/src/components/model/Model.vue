<template>
  <section>
    <el-dialog custom-class="urgent-dialog" :visible.sync="visible" :modal-append-to-body="true" :append-to-body="true" :width="width" :heigth="heigth" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelModal">
      <span slot="title" class="el-dialog__title">{{ title }}</span>
      <div v-loading="loading" class="full">
        <slot></slot>
      </div>
      <span v-if="showBtn" slot="footer" class="dialog-footer">
        <el-button v-if="!submitBtnHide" type="primary" size="mini" @click.stop="submitModal">{{ $t("common.buttons.confirm") }}</el-button>
        <el-button size="mini" @click.stop="cancelModal">{{ $t("common.buttons.cancel") }}</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    submitBtnHide: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      defalut: ""
    },
    width: {
      type: String,
      default: "40%"
    },
    heigth: {
      type: String,
      default: "50%"
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    cancelModal() {
      // 关闭弹窗，触发父组件修改visible值
      this.$emit("update:visible", false)
    },
    submitModal() {
      let vueComp = this.$slots["default"][0].elm.firstChild.__vue__
      let fn = vueComp.validate
      let fields = vueComp.fields
      if (fields && fields.length) {
        let requiredFields = fields.filter((item, index) => item.isRequired || item.fieldValue)
        vueComp.fields = requiredFields
      }
      let temp = vueComp.fields
      if (typeof fn != "undefined" && fn instanceof Function && temp && temp.length) {
        fn(valid => {
          if (valid) {
            this.loading = true
            this.$emit("ok-click", this)
          }
        })
        return
      }
      this.loading = true
      this.$emit("ok-click", this)
    }
  }
}
</script>
