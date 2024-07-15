<template>
  <div
    ref="reference"
    class="el-range-editor el-input__inner"
    style="border: 0; padding: 0;border-radius: 0;"
  >
    <el-input
      autocomplete="off"
      :placeholder="startPlaceholder"
      :value="userInput && userInput[0]"
      :disabled="disabled"
      v-bind="firstInputId"
      :readonly="readonly"
      :name="name && name[0]"
      type="number"
      class="el-range-input"
      @input="handleStartInput"
    />
    <slot name="range-separator">
      <span class="el-range-separator">{{ rangeSeparator }}</span>
    </slot>
    <el-input
      autocomplete="off"
      :placeholder="endPlaceholder"
      :value="userInput && userInput[1]"
      :disabled="disabled"
      v-bind="secondInputId"
      :readonly="readonly"
      :name="name && name[1]"
      type="number"
      class="el-range-input"
      @input="handleEndInput"
    />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [Array, Number, String]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rangeSeparator: {
      type: String,
      default: '-'
    },
    id: {
      type: Array
    },
    name: {
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startPlaceholder: '',
      endPlaceholder: '',
      userInput: []
    }
  },
  computed: {
    firstInputId() {
      const obj = {}
      const id = this.id && this.id[0]
      if (id) {obj.id = id}
      return obj
    },
    secondInputId() {
      const obj = {}
      const id = this.id && this.id[1]
      if (id) {obj.id = id}
      return obj
    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.$utils.isEmpty(val)) {
          this.userInput = [null, null]
        } else {
          if (Array.isArray(val)) {
            this.userInput = val
          } else {
            this.userInput = [val, null]
          }
        }
      },
      immediate: true,
      deep: true
    },
    userInput: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    handleStartInput(value) {
      if (this.userInput) {
        this.userInput = [value, this.userInput[1]]
      } else {
        this.userInput = [value, null]
      }
    },
    handleEndInput(value) {
      if (this.userInput) {
        this.userInput = [this.userInput[0], value]
      } else {
        this.userInput = [null, value]
      }
    }
  }
}
</script>
