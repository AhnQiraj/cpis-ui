export default {
  methods: {
    onChangeLocale(command) {
      this.$i18n.locale = command
      const message = `当前语言：${this.$t('_name')} [ ${this.$i18n.locale} ]`
      this.$notify({
        title: '语言变更',
        dangerouslyUseHTMLString: true,
        message
      })
    }
  }
}
