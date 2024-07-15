<template>
  <div>
    <el-form ref="form" :model="form" @submit.native.prevent>
      <el-form-item label="字符编码：">
        <el-select v-model="charset" placeholder="请选择" style="width:100px;" @change="changeCharset">
          <el-option
            v-for="item in charsetOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <iframe
      class="filename"
      :src="url"
      width="100%"
      height="95%"
      frameborder="0"
    />
  </div>
</template>
<script>
export default {
  props: {
    src: String
  },
  data() {
    return {
      charsetOptions: [
        {
          value: 'UTF-8',
          label: 'UTF-8'
        }, {
          value: 'GBK',
          label: 'GBK'
        }, {
          value: 'BIG5',
          label: 'BIG5'
        }],
      form: {},
      charset: 'UTF-8',
      url: `${this.src}&charset=UTF-8`
    }
  },
  beforeDestroy() {
    this.charsetOptions = null
    this.form = null
  },
  methods: {
    changeCharset(value) {
      this.url = `${this.src}&charset=${value}`
    }
  }
}
</script>
