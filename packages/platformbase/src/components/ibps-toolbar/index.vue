<template>
  <span class="ibps-actions">
    <template v-for="(button, index) in actions">
      <!--只显示图标-->
      <template v-if="type === 'icon'">
        <el-tooltip v-if="handleActionHidden(button.hidden)" :key="button.key + index" v-permission="getPermission(button)" :content="getLabel(button)" :disabled="handleActionDisabled(button.disabled)" placement="bottom-start">
          <el-button :key="button.key + index" :name="button.key" :size="button.size || $ELEMENT.size" :type="getType(button)" :icon="getIcon(button)" :disabled="handleActionDisabled(button.disabled)" class="action-icon" @click="emitEventHandler('action-event', button, position, data, index)" />
        </el-tooltip>
      </template>
      <!--链接-->
      <template v-else-if="type === 'link'">
        <el-link v-if="handleActionHidden(button.hidden)" :key="button.key + index" v-permission="getPermission(button)" :underline="false" :type="getType(button)" :icon="getIcon(button)" :disabled="handleActionDisabled(button.disabled)" @click="emitEventHandler('action-event', button, position, data, index)">
          {{ button.label }}
        </el-link>
        <el-divider v-if="index < noHiddenActions.length - 1" :key="index" direction="vertical" />
      </template>
      <template v-else>
        <!--下拉-->
        <template v-if="button.mode === 'dropdown'">
          <el-dropdown
            :key="button.key"
            v-permission="getPermission(button)"
            :hide-on-click="false"
            @command="
              action => {
                emitEventHandler('action-event', action, position, data, index)
              }
            "
          >
            <span v-if="button.buttonType === 'link'" class="el-dropdown-link"> {{ button.label }}<i v-if="hasRighticon(button.rightIcon)" class="el-icon-arrow-down el-icon--right" /> </span>
            <el-button v-else :type="getType(button)" :icon="getIcon(button)"> {{ button.label }}<i v-if="hasRighticon(button.rightIcon)" class="el-icon-arrow-down el-icon--right" /> </el-button>
            <el-dropdown-menu v-if="button.menus && button.menus.length > 0" slot="dropdown">
              <el-dropdown-item v-for="menu in button.menus" :key="menu.key" :command="menu" :disabled="hasPermission(button) || hasPermission(menu)" :icon="getIcon(menu)">{{ getLabel(menu) }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!--默认-->
        <template v-else>
          <el-button v-if="handleActionHidden(button)" :key="button.key + index" v-permission="getPermission(button)" :name="button.key" :size="button.size || $ELEMENT.size" :type="getType(button)" :icon="getIcon(button)" :plain="getPlain(button)" :disabled="handleActionDisabled(button)" :autofocus="false" @click="emitEventHandler('action-event', button, position, data, index)">{{ getLabel(button) }}</el-button>
        </template>
      </template>
    </template>
  </span>
</template>
<script>
import { getButtonIcon, getButtonType, getButtonAccessControl } from '@platform/utils/button'
import permission from '@platform/directives/permission/index.js' // 权限判断指令
import { hasPermission } from '@platform/mixins/permission' // 权限判断指令
// 工具类
export default {
  name: 'IbpsToolbar',
  directives: { permission },
  props: {
    type: {
      type: String,
      default: 'button'
    },
    actions: {
      type: Array,
      default: () => {
        return []
      }
    },
    position: {
      type: String,
      default: 'toolbar'
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    data: Object,
    socpe: {
      type: Object,
      default: () => {
        return this
      }
    },
    /**
     * 是否受权限控制
     */
    accessControl: {
      type: Boolean,
      default: true
    },
    /**
     * 标识
     */
    identity: {
      type: String
    }
  },
  data() {
    return {
      buttonStatus: true,
      stopTime: null
    }
  },
  computed: {
    noHiddenActions() {
      if (!this.actions) {
        return []
      }
      const noHiddenActions = []
      for (let i = 0; i < this.actions.length; i++) {
        if (this.handleActionHidden(this.actions[i].hidden)) {
          noHiddenActions.push(this.actions[i])
        }
      }
      return noHiddenActions
    }
  },
  methods: {
    emitEventHandler(event) {
      if (this.buttonStatus) {
        this.buttonStatus = false
        this.$emit(event, ...Array.from(arguments).slice(1))
      }
      this.setButton()
    },
    setButton() {
      // 添加一个定时器，点击之后延时500ms，防二次点击
      clearTimeout(this.stopTime)
      this.stopTime = setTimeout(() => {
        this.buttonStatus = true
      }, 500)
    },
    /**
     * 处理按钮隐藏，显示
     */
    handleActionHidden(button) {
      if (!button) {
        return
      }
      if (button.attributes) {
        if (button.key === 'close' || button.key === 'flowImage') {
          return true
        }
        if (button.attributes.isDisabled) {
          return Boolean(!button.attributes.isDisabled)
        }
      }
      let hidden = button.hidden
      let isHidden = !hidden
      if (typeof hidden === 'boolean') {
        isHidden = !hidden
      } else if (typeof hidden === 'function') {
        isHidden = !hidden.call(this.socpe, this.data)
      }
      return isHidden
    },
    /**
     * 处理按钮禁用，显示disabled 的方法
     */
    handleActionDisabled(button) {
      if (button.attributes) {
        if (button.key === 'close' || button.key === 'flowImage') {
          return false
        }
        if (button.attributes.isDisabled) {
          return Boolean(button.attributes.isDisabled)
        }
      }
      let disabled = button.disabled
      if (typeof disabled === 'boolean') {
        return disabled
      } else if (typeof disabled === 'function') {
        return disabled.call(this.socpe, this.data)
      }
      return Boolean(disabled)
    },
    // getLabel({ label, key }) {
    //   if (label) return label
    //   return this.$t('common.buttons.' + key) ? this.$t('common.buttons.' + key) : key
    // },
    // zhangcongjie 以button name返回
    getLabel(button) {
      if (button.label) {
        return button.label
      }
      if (button.attributes) {
        if (button.attributes.name) {
          return button.attributes.name
        }
      }
      return this.$t('common.buttons.' + button.key) ? this.$t('common.buttons.' + button.key) : button.key
    },
    getIcon({ icon, key }) {
      if (!this.showIcon) {
        return
      }
      if (icon) {
        return icon
      }
      return getButtonIcon(key)
    },
    getType({ type, key }) {
      if (type) {
        return type
      }
      return getButtonType(key)
    },
    getPlain({ plain }) {
      if (plain) {
        return plain
      }
      return
    },
    /* eslint-disable */
    getPermission({ key, permission, accessControl }) {
      if (!this.accessControl) {
        return
      }
      if (accessControl !== undefined && accessControl === false) {
        return
      }
      if (!getButtonAccessControl(key)) {
        return
      }
      if (permission) {
        return permission
      }
      if (this.identity) {
        return this.identity + '_' + key
      }
      return
    },
    hasPermission(menu) {
      if (!this.accessControl) {
        return false
      }
      if (menu.accessControl !== undefined && menu.accessControl === false) {
        return false
      }
      const perm = hasPermission(this.identity + '_' + menu.key)
      return !perm
    },
    hasRighticon(rightIcon) {
      if (rightIcon) {
        return true
      }
      return true
    }
  }
}
</script>
