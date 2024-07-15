<template>
  <div class="rules-group-container">
    <div class="rules-group-header">
      <!--规则组条件-->
      <!-- <div class="btn-group group-conditions">
        <el-radio-group v-model="rulesData.condition" size="mini">
          <el-radio-button v-for="condition in conditions" :key="condition.value" :disabled="!hasMultipleRule" :label="condition.value">{{ condition.label }}</el-radio-button>
        </el-radio-group>
      </div> -->
      <!--规则操作-->
      <div class="btn-group group-actions">
        <el-button-group>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRule">{{ labels.addRulue }}</el-button>
          <el-button v-if="hasGroup" size="mini" type="success" icon="el-icon-circle-plus-outline" @click="addGroup">{{ labels.addGroup }}</el-button>
          <el-button v-if="depth > 1" size="mini" type="danger" icon="el-icon-close" @click="remove">{{ labels.removeGroup }}</el-button>
        </el-button-group>
      </div>
    </div>
    <!--规则-->
    <div class="rules-group-body">
      <div class="rules-list">
        <template v-for="(child, i) in rulesData[childrenKey]">
          <div :key="$utils.isNotEmpty(child.rule_id)?child.rule_id:i" style="position: relative;">
            <component
              :is="child && child.type === 'group'?'setting-builder-group':'setting-builder-rule'"
              :ref="refName+i"
              :rules.sync="rulesData[childrenKey][i]"
              :fields="fields"
              :conditions="conditions"
              :index="i"
              :max-depth="maxDepth"
              :depth="depth + 1"
              :labels="labels"
              @errors="(data,_id)=>{handleErrors(depth + 1,i,data,_id)}"
              @child-deletion-requested="removeChild"
            />
            <div v-show="i < rulesData[childrenKey].length-1" class="right_condition" :style="conditionHeight[i]">
              <el-select v-model="rulesData[childrenKey][i].rule_condition" style="width:60px;z-index: 2;" placeholder="请选择">
                <el-option
                  v-for="item in conditions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="operator_border" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import SettingBuilderRule from './setting-builder-rule.vue'
import Ids from 'ids'
export default {
  name: 'SettingBuilderGroup',
  components: {
    SettingBuilderRule
  },
  props: {
    fields: {
      type: Array
    },
    type: String,
    rules: Object,
    index: [String, Number],
    maxDepth: Number,
    depth: Number,
    labels: Object,
    conditions: Array,
    childrenKey: { // 儿子key
      type: String,
      default: 'rules'
    },
    conditionKey: {
      type: String,
      default: 'type'
    }
  },
  data() {
    return {
      rulesData: this.rules,
      // 默认规则
      defaultRule: {},
      // 默认条件
      defaultCondition: '',
      errors: {},
      refName: 'settingBuilder',
      conditionHeight: [],
      id: ''
    }
  },
  computed: {
    hasMultipleRule() {
      return this.rulesData[this.childrenKey] && this.rulesData[this.childrenKey].length > 1
    },
    hasGroup() {
      return !this.maxDepth || (this.maxDepth && this.depth < this.maxDepth)
    },
    hasSort() {
      return this.depth > 1 && this.sort
    }
  },
  watch: {
    rules(val) {
      this.rulesData = val
    },
    rulesData: {
      handler(val) {
        if (this.$utils.isNotEmpty(val) && this.$utils.isNotEmpty(val[this.childrenKey])) {
          for (let i = 0; i < val[this.childrenKey].length; i++) {
            this.setRightConditionHeight(i)
          }
        }
        this.$emit('update:rules', val)
      },
      deep: true
    }
  },
  mounted() {
    if (this.$utils.isNotEmpty(this.rulesData) && this.$utils.isNotEmpty(this.rulesData[this.childrenKey])) {
      for (let i = 0; i < this.rulesData[this.childrenKey].length; i++) {
        this.setRightConditionHeight(i)
      }
    }
    this.id = this.setIds()
  },
  beforeDestroy() {
    this.rulesData = null
    this.defaultRule = null
    this.errors = null
  },
  methods: {
    setIds() {
      const id = new Ids([32, 36, 1]).next()
      return id
    },
    getVal() {
      const obj = JSON.parse(JSON.stringify(this.defaultRule))
      obj.rule_id = new Ids([32, 36, 1]).next()
      return obj
    },
    setRightConditionHeight(index) {
      let _data = {
        height: '0px'
      }
      let height = '0'
      this.$nextTick(() => {
        const _refs = this.$refs
        if (this.$utils.isEmpty(_refs)) {
          this.$set(this.conditionHeight, index, _data)
          return
        }
        const nowRef = _refs[this.refName + index]
        if (this.$utils.isEmpty(nowRef)) {
          this.$set(this.conditionHeight, index, _data)
          return
        }
        const nextRef = _refs[this.refName + (index + 1)]
        if (this.$utils.isEmpty(nextRef)) {
          this.$set(this.conditionHeight, index, _data)
          return
        }
        const _nowHeight = nowRef[0].$el.clientHeight + nowRef[0].$el.clientLeft + nowRef[0].$el.clientTop
        const _nextHeight = nextRef[0].$el.clientHeight + nextRef[0].$el.clientLeft + nextRef[0].$el.clientTop
        height = ((_nowHeight + _nextHeight) / 2 + 20) + 'px'
        _data = {
          height: height,
          top: (_nowHeight / 2) + 'px'
        }
        this.$set(this.conditionHeight, index, _data)
      }, 500)
    },
    setDefault() {
      this.defaultRule = JSON.parse(JSON.stringify({
        field: this.fields[0],
        value: null,
        operator: null,
        rule_condition: 'or'
      }))
      this.defaultCondition = 'group'
    },
    // 添加规则
    addRule() {
      this.setDefault()
      this.rulesData[this.childrenKey].push(this.getVal())
    },
    // 添加组
    addGroup() {
      if (!this.hasGroup) {return}
      this.setDefault()
      this.rulesData[this.childrenKey].push({
        rule_condition: 'or',
        [this.conditionKey]: this.defaultCondition,
        [this.childrenKey]: [this.getVal()],
        rule_id: new Ids([32, 36, 1]).next()
      })
    },
    // 删除当前组
    remove() {
      this.errors = {}
      this.$emit('errors', this.errors, this.id)
      this.emitRemove()
    },
    emitRemove() {
      this.$emit('child-deletion-requested', this.index, this.id)
    },
    // 删除儿子
    removeChild(index, id) {
      this.handleErrors(this.depth + 1, index, [], id)
      // 如果只有一个时候
      if (this.rulesData[this.childrenKey].length === 1) {
        this.emitRemove()
      } else {
        this.rulesData[this.childrenKey].splice(index, 1)
      }
    },
    handleErrors(depth, index, data, id) {
      const key = depth + '_' + id
      if (this.$utils.isEmpty(data)) {
        delete this.errors[key]
      } else {
        this.errors[key] = data
      }
      this.$emit('errors', this.errors, this.id)
    }
  }
}
</script>
