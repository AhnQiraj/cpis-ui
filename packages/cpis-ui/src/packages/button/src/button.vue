<template>
  <button
    class="el-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-round': round
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
export default {
  name: 'CpisButton',

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    type: {
      type: String,
      validator(value) {
        return ['primary', 'text'].includes(value)
      }
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    autofocus: Boolean,
    round: Boolean
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },
    buttonDisabled() {
      return this.$options.propsData.hasOwnProperty('disabled')
        ? this.disabled
        : (this.elForm || {}).disabled
    }
  },

  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
<style scoped>
.el-button {
  @apply !px-4 !py-2 text-primary-6 border-primary-6 bg-white;
  &:hover {
    @apply !border-primary-5 !text-primary-5;
  }
  &:active {
    @apply !border-primary-7 !text-primary-7;
  }
}
.el-button--primary {
  @apply !bg-primary-6 !border-primary-5 text-white;
  &:hover {
    @apply !border-primary-5 !bg-primary-5 !text-white;
  }
  &:active {
    @apply !border-primary-7 !bg-primary-7 !text-white;
  }
}
.el-button--text {
  @apply !bg-transparent !border-transparent !px-0;
  &:hover {
    @apply !bg-transparent !border-transparent;
  }
  &:active {
    @apply !bg-transparent !border-transparent;
  }
}
.is-disabled {
  @apply !bg-gray-2 !border-gray-3 !text-gray-4;
  &:hover {
    @apply !bg-gray-2 !border-gray-3 !text-gray-4;
  }
  &:active {
    @apply !bg-gray-2 !border-gray-3 !text-gray-4;
  }
}
</style>


