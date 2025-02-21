<template>
  <button
    class="el-button cpis-button"
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
      type: String
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
      return this.$options.propsData.hasOwnProperty('disabled') ? this.disabled : (this.elForm || {}).disabled
    }
  },

  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
<style>
.cpis-button.el-button.el-button--small {
  font-size: 14px;
}
.cpis-button.el-button {
  @apply px-4 py-2 text-primary-6 border-primary-6 bg-white;
  &:hover {
    @apply border-primary-5 text-primary-5;
  }
  &:active {
    @apply border-primary-7 text-primary-7;
  }
}
.cpis-button.el-button.el-button--primary {
  @apply bg-primary-6 text-white;
  &:hover {
    @apply bg-primary-5 text-white;
  }
  &:active {
    @apply bg-primary-7 text-white;
  }
}
.cpis-button.el-button.el-button--text {
  @apply bg-transparent border-transparent p-0;
  &:hover {
    @apply bg-transparent border-transparent;
  }
  &:active {
    @apply bg-transparent border-transparent;
  }
}

.cpis-button.el-button.is-disabled {
  @apply bg-gray-2 border-gray-3 text-gray-4;
  &:hover {
    @apply bg-gray-2 border-gray-3 text-gray-4;
  }
  &:active {
    @apply bg-gray-2 border-gray-3 text-gray-4;
  }
}

.cpis-button.el-button.el-button--text.is-disabled {
  @apply bg-transparent border-none text-gray-4;
  &:hover {
    @apply bg-transparent border-none text-gray-4;
  }
  &:active {
    @apply bg-transparent border-none text-gray-4;
  }
}
</style>
