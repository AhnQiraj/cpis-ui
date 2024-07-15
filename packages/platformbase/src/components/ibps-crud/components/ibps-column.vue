<template>
  <div>
    <el-table-column
      v-for="(item, index) in columns"
      :key="index"
      :label="handleAttribute(item.title, '')"
      :prop="handleAttribute(item.key, null)"
      v-bind="item"
    >
      <template slot-scope="scope">
        <el-input
          v-if="item.component && item.component.name === 'el-input'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        />
        <el-input-number
          v-else-if="item.component && item.component.name === 'el-input-number'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        />
        <el-radio-group
          v-else-if="item.component && item.component.name === 'el-radio'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        >
          <template v-if="item.component.buttonMode">
            <el-radio-button
              v-for="option in item.component.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio-button>
          </template>
          <template v-else>
            <el-radio
              v-for="option in item.component.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </template>
        </el-radio-group>
        <el-checkbox-group
          v-else-if="item.component && item.component.name === 'el-checkbox'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        >
          <template v-if="item.component.buttonMode">
            <el-checkbox-button
              v-for="option in item.component.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-checkbox-button>
          </template>
          <template v-else>
            <el-checkbox
              v-for="option in item.component.options"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-checkbox>
          </template>
        </el-checkbox-group>
        <el-select
          v-else-if="item.component && item.component.name === 'el-select'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        >
          <el-option
            v-for="option in item.component.options"
            :key="option.value"
            v-bind="option"
          />
        </el-select>
        <el-cascader
          v-else-if="item.component && item.component.name === 'el-cascader'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        />
        <el-switch
          v-else-if="item.component && item.component.name === 'el-switch'"
          v-model="scope.row[item.key]"
          v-bind="item.component"
        />
        <el-slider
          v-else-if="item.component && item.component.name === 'el-slider'"
          v-model="scope.row[item.key]"
          v-bind="item.component"
        />
        <el-time-select
          v-else-if="item.component && item.component.name === 'el-time-select'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        />
        <el-time-picker
          v-else-if="item.component && item.component.name === 'el-time-picker'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        />
        <el-date-picker
          v-else-if="item.component && item.component.name === 'el-date-picker'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        />
        <el-rate
          v-else-if="item.component && item.component.name === 'el-rate'"
          v-model="scope.row[item.key]"
          v-bind="item.component"
        />
        <el-color-picker
          v-else-if="item.component && item.component.name === 'el-color-picker'"
          v-model="scope.row[item.key]"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        />
        <el-tag
          v-else-if="item.component && item.component.name === 'el-tag'"
          v-bind="$ibpsCrudSize ? Object.assign({ size: $ibpsCrudSize}, item.component) : item.component"
        >
          {{ scope.row[item.key] }}
        </el-tag>
        <render-component
          v-else-if="item.component && item.component.render"
          :render-function="item.component.render"
          :scope="scope"
        />
        <template v-else>{{ scope.row[item.key] }}</template>
      </template>
      <ibps-column v-if="item.children" :columns="item.children" />
    </el-table-column>
  </div>
</template>
<script>
import utils from '../mixin/utils'
import RenderComponent from '../components/render-component.vue'
export default {
  name: 'IbpsColumn',
  components: {
    RenderComponent
  },
  mixins: [
    utils
  ],
  props: {
    /**
     * @description 表头数据
     */
    columns: {
      type: Array,
      required: true
    }
  }
}
</script>
