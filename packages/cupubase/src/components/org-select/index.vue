<template>
  <el-select ref="selforgselect" v-model="selectVal" :placeholder="ph" :multiple="multiple" clearable filterable @change="changeSelect" @clear="clear">
    <el-option v-for="(item, index) of orgList" v-show="levelID == item.levelID" :key="index" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>
<script>
export default {
  name: 'OrgSelect',
  props: ['org', 'ph', 'levelID', 'multiple'],
  data() {
    return {
      orgList: [],
      selectVal: ''
    }
  },
  watch: {
    org(val) {
      let org = val
      if (this.multiple) {
        if (typeof val === 'string') {
          org = val.split(',')
        }
      }
      this.selectVal = org
    }
  },
  created() {
    this.$nextTick(() => {
      window.apiList['common/index'].findOrgAll().then(res => {
        this.orgList = res.data
        if (this.org) {
          if (this.multiple) {
            if (typeof this.org === 'string') {
              this.org = this.org.split(',')
            }
          }
          this.selectVal = this.org
        }
      })
    })
  },
  methods: {
    setOrg(val) {
      this.selectVal = val
      this.$forceUpdate()
    },
    changeSelect(val) {
      this.orgList.map(item => {
        if (item.id == val) {
          this.$emit('edit', val, item.name)
        }
      })
    },
    clear() {
      this.selectVal = ''
      this.$emit('edit', '', '')
    }
  }
}
</script>
