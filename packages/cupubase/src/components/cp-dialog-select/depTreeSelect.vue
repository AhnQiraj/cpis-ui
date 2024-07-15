<template>
  <el-cascader v-model="selectId" :props="props" :show-all-levels="false" :placeholder="$t('baseCommon.message.pleaseSelect', { title: '' })" clearable @change="handleChange"></el-cascader>
</template>
<script>
import * as utils from '@cupu/utils/index'
export default {
  name: 'DeptTreeSelect',
  data () {
    let that = this
    return {
      selectId: '',
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad (node, resolve) {
          setTimeout(() => {
            const id = node.value
            if (node.level == 0) {
              let param = {
                parameters: [
                  {
                    key: "key",
                    value: "bm"
                  }, {
                    key: "Q^DEPTH_^S",
                    value: 2
                  }, {
                    key: "Q^PARTY_TYPE_^S",
                    value: "org"
                  }, {
                    key: "Q^PARENT_ID_^S",
                    value: utils.getDepName().id
                  }
                ]
              }
              window.apiList['common/index'].queryDataByKey(param).then(res => {
                const depts = res.data.dataResult.map((value, i) => ({
                  value: value.ID_,
                  label: value.NAME_,
                  leaf: node.level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(depts);
              })
            }
            if (node.level == 1) {
              let param = {
                parameters: [
                  {
                    key: "key",
                    value: "bm"
                  }, {
                    key: "Q^DEPTH_^S",
                    value: 3
                  }, {
                    key: "Q^PARTY_TYPE_^S",
                    value: "org"
                  }, {
                    key: "Q^PARENT_ID_^S",
                    value: id
                  }
                ]
              }
              window.apiList['common/index'].queryDataByKey(param).then(res => {
                const depts = res.data.dataResult.map((value, i) => ({
                  value: value.ID_,
                  label: value.NAME_,
                  leaf: node.level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(depts);
              })
            }
            if (node.level >= 2) {
              let param = {
                parameters: [
                  {
                    key: "key",
                    value: "bm"
                  }, {
                    key: "Q^DEPTH_^S",
                    value: 4
                  }, {
                    key: "Q^PARTY_TYPE_^S",
                    value: "org"
                  }, {
                    key: "Q^PARENT_ID_^S",
                    value: id
                  }
                ]
              }
              window.apiList['common/index'].queryDataByKey(param).then(res => {
                const depts = res.data.dataResult.map((value, i) => ({
                  value: value.ID_,
                  label: value.NAME_,
                  leaf: node.level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(depts);
              })
            }
          }, 1000);
        }
      }
    };
  },
  methods: {
    handleChange (e) {
      this.$emit('selectHandle', e);
    }
  }
}
</script>
