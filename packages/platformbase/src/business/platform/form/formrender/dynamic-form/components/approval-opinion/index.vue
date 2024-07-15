<template>
  <div>
    <template v-if="opinionData && opinionData.length >0">
      <!--审批历史记录-- 横向-->
      <el-table v-if="layout === 'horizontal'" :data="opinionData" border stripe>
        <template v-for="(item,j) in options">
          <el-table-column v-if="item.checked" :key="j" :label="item.label">
            <template slot-scope="{row,$index }">
              <template v-if="item.value==='statusName'">
                <el-tag style="border: 0;background-color:unset;" :style="{'color':row.nodeColor}" effect="plain">
                  {{ row[item.value]|filterData(item,row) }}
                </el-tag>
              </template>
              <template v-else-if="item.value==='opinion'">
                <ibps-text-ellipsis
                  :text="row[item.value]|filterData(item,row)"
                  :height="80"
                  :is-limit-height="limitHeight[$index ]"
                >
                  <small slot="more"><span>...</span><span class="el-dropdown-link" @click="onShowMore($index ,false)">查看更多</span></small>
                  <small v-if="!limitHeight[$index ]" slot="after" class="el-dropdown-link" @click="onShowMore($index ,true)">收起</small>
                </ibps-text-ellipsis>
              </template>
              <template v-else>
                <div class="ibps-field-text">{{ row[item.value]|filterData(item,row) }}</div>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <template v-else>
        <!--审批历史记录, 纵向-->
        <template v-for="(row,i) in opinionData">
          <el-card :key="i" shadow="hover" class="ibps-mb-10">
            <el-row v-for="(item,j) in options" :key="i+j" :gutter="20">
              <template v-if="item.checked">
                <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="ibps-tr">{{ item.label }}:</el-col>
                <el-col :xs="16" :sm="18" :md="20" :lg="21" :xl="23">
                  <el-tag v-if="item.value==='statusName'" style="border: 0;background-color:unset;" :style="{'color':row.nodeColor}" effect="plain">
                    {{ row[item.value]|filterData(item,row) }}
                  </el-tag>
                  <template v-else-if="item.value==='opinion'">
                    <ibps-text-ellipsis
                      :text="row[item.value]|filterData(item,row)"
                      :height="80"
                      :is-limit-height="limitHeight[i]"
                    >
                      <small slot="more"><span>...</span><span class="el-dropdown-link" @click="onShowMore(i,false)">查看更多</span></small>
                      <small v-if="!limitHeight[i]" slot="after" class="el-dropdown-link" @click="onShowMore(i,true)">收起</small>
                    </ibps-text-ellipsis>
                  </template>
                  <template v-else>
                    {{ row[item.value]|filterData(item,row) }}
                  </template>
                </el-col>
              </template>
            </el-row>
          </el-card>
        </template>
      </template>
    </template>
    <ibps-approval-opinion
      v-if="!readonly"
      v-model="data"
      :enable-common="commonCtatment"
      :direct-sign="directHandlerSign"
      :placeholder="placeholder"
      @direct-handler-sign="handleDirectHandlerSign"
    />
  </div>
</template>
<script>
import Utils from '@platform/utils/util'
import { format, dateDealFmt } from '@platform/utils/fecha'
import IbpsApprovalOpinion from '@platform/business/platform/bpmn/components/approval-opinion'
export default {
  components: {
    IbpsApprovalOpinion
  },
  filters: {
    filterData(val, config, data) {
      if (config.value === 'auditorName') {
        if (Utils.isEmpty(data.auditor) &&
          Utils.isNotEmpty(data.qualifiedExecutor)) {
          // 会签  审批人处理
          const name = []
          for (let i = 0; i < data.qualifiedExecutor.length; i++) {
            name.push(data.qualifiedExecutor[i].executor)
          }
          val = name.join(' ')
        }
      } else if (config.value === 'completeTime') { // 审批时间
        if (Utils.isNotEmpty(val)) {
          let dateObj = val
          const dateFormat = 'yyyy-MM-dd HH:mm:ss'
          try {
            if (typeof dateObj === 'number') {
              dateObj = new Date(dateObj)
            }
            if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
              // 需要把字符串转换日期格式
              dateObj = dateDealFmt.dealFmt(dateObj, dateFormat)
            }
            val = format(dateObj, dateFormat)
          } catch (error) {
            console.error('转换日期格式错误：', error)
            val = ''
          }
        }
      }
      return val
    }
  },
  inject: {
    elForm: {
      default: ''
    }
  },
  props: {
    value: String,
    field: Object, // 字段
    readonly: { // 只读
      type: Boolean,
      default: false
    },
    readonlyStyle: String, // 只读样式
    opinionData: { // 审批意见
      type: Array
    },
    params: Object
  },
  data() {
    return {
      data: '',
      isLimitHeight: {}
    }
  },
  computed: {
    commonCtatment() {
      return this.field ? this.field.field_options.common_statment : true
    },
    layout() {
      return this.field ? this.field.field_options.arrangement : 'horizontal'
    },
    options() {
      return this.field ? this.field.field_options.options : []
    },
    optionsCheckedLength() {
      let k = 0
      for (let i = 0; i < this.options.length; i++) {
        const option = this.options[i]
        if (option.checked) {
          k = i
        }
      }
      return k
    },
    placeholder() {
      return this.field ? this.field.field_options.placeholder : ''
    },
    limitHeight() {
      // console.info('xxxx', this.isLimitHeight)
      return this.isLimitHeight
    },
    directHandlerSign() {
      return this.$utils.toBoolean(this.params ? this.params.directHandlerSign : false, false)
    }
  },
  watch: {
    value(val) {
      this.data = val
    },
    data: {
      handler(val) {
        this.$emit('update:value', val)
      },
      deep: true
    },
    opinionData: {
      handler(val) {
        if (this.$utils.isNotEmpty(val)) {
          for (let i = 0; i < this.opinionData.length; i++) {
            this.isLimitHeight[ i] = true
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    onShowMore(i, isLimitHeight) {
      const limitHeight = JSON.parse(JSON.stringify(this.isLimitHeight))
      limitHeight[i] = isLimitHeight
      this.isLimitHeight = {}
      this.isLimitHeight = limitHeight
    },
    handleDirectHandlerSign(val) {
      this.$emit('direct-handler-sign', val)
    }
  }
}
</script>
