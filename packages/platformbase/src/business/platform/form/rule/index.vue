<template>
  <div class="form-rule-part">
    <fieldset class="scheduler-border">
      <legend style="width: 90px; border-bottom: 0; margin-bottom: 10px"><span :style="'marginLeft:8px'">规则设置</span></legend>
      <div class="rule-button">
        <el-button type="primary" icon="ibps-icon-add" @click="addRule">添加规则</el-button>
        <el-button type="primary" icon="ibps-icon-add" @click="addScript">添加脚本</el-button>
        <el-button type="primary" icon="ibps-icon-sign-in" @click="combinationRule">组合规则</el-button>
        <el-button type="primary" icon="ibps-icon-sign-out" @click="splitRule">拆分规则</el-button>
        <el-button type="primary" icon="ibps-icon-remove" @click="removeRule">删除</el-button>
      </div>
      <div class="rule-item">
        <span class="label-span" ruletype="1">普通规则</span>
        <span id="conDesc">[ 发起人] 相等 [ 测试头像,测试头像1]</span>
        <a class="ibps-icon-edit" />
      </div>
      <div class="rule-item">
        <span class="label-span left" ruletype="1">普通规则</span>
        <span id="conDesc">脚本</span>
        <a class="ibps-icon-edit" />
      </div>
    </fieldset>
    <rule-dialog :def-id="defId" :visible="ruleDialogVisible" @close="() => (ruleDialogVisible = false)" @select="formmatRuleResult" />
    <script-dialog :visible="scriptDialogVisible" @close="() => (scriptDialogVisible = false)" />
  </div>
</template>
<script>
import RuleDialog from "./rule-dialog"
import ScriptDialog from "./script-dialog"
export default {
  components: {
    RuleDialog,
    ScriptDialog
  },
  props: {
    value: [Object, Array, String],
    defId: String
  },
  data() {
    return {
      ruleDialogVisible: false, // 规则
      scriptDialogVisible: false, // 脚本,
      rule: {
        executorVar: {
          executorType: "user",
          valType: "userId",
          name: "khxxb.tenantId",
          value: "603227331326115840,539090562758737920",
          valueText: "wsdfg,测试",
          source: "boVar"
        },
        conDesc: "[租户ID]相等[wsdfg,测试]",
        dataType: "varchar",
        expression: "equals",
        ruleType: "1"
      }
    }
  },
  beforeDestroy() {
    this.rule = null
  },
  methods: {
    addRule() {
      this.ruleDialogVisible = true
    },
    addScript() {
      this.scriptDialogVisible = true
    },
    combinationRule() {},
    splitRule() {},
    removeRule(Rule) {},
    formmatRuleResult(data) {
      console.log("formmatRuleResult: ", data)
    }
  }
}
</script>
<style lang="scss">
.form-rule-part {
  .scheduler-border {
    border: 1px groove #ddd !important;
    padding: 0 0.4em 1.4em 0.4em !important;
  }
  legend {
    font-size: 18px !important;
  }
  .rule-button {
    // display: block;
    // float: right;
    text-align: right;
  }
  .rule-item {
    margin: 10px 20px;
    border: 1px solid #ccc;
    -moz-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
  }
  .label-span {
    cursor: pointer;
    background: #ededed;
    height: 30px;
    display: inline-block;
    line-height: 30px;
  }
  .rule-item a {
    float: right;
    font-size: 25px;
    line-height: 30px;
    background: #ededed;
    padding: 0 5px;
  }
}
</style>
