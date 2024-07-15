import { saveFormData, saveFormDataByCustom } from '@platform/api/platform/data/dataTemplate'
import { startFlowFromEdit } from '@platform/api/platform/bpmn/bpmInst'
import Print from '@platform/utils/print'
import qs from 'qs'
export default {
  methods: {
    emitEventHandler(actionKey, args) {
      let flag = false
      let attr = {}
      let action = args && args.attributes ? args.attributes.button_type || args.attributes.alias || actionKey : actionKey
      if (args && args.attributes && args.attributes.custom_url) {
        flag = true
        attr = args.attributes
        if (attr.alias === 'custom') {action = attr.alias}
      }
      this.actionAttrs = args && args.attributes ? args.attributes : {}
      this.actionName = actionKey
      switch (action) {
        case 'close': // 关闭窗口
          this.closeDialog()
          break
        case 'save':
          if (flag) {
            this.handleSaveByCustom(action, attr)
          } else {
            this.handleSave()
          }
          break
        case 'saveAndContinue':
          if (flag) {
            this.handleSaveByCustom(action, attr)
          }
          break
        case 'print':
          this.handlePrint()
          break
        case 'sefStartFlow':
          this.handleStartFlowFrom(args && args.attributes ? args.attributes.deflow : '')
          break
        case 'custom':
          if (flag) {
            this.saveDataByCustom(action, attr)
          }
          break
        default:
          break
      }
    },
    // 自定义配置保存
    handleSaveByCustom(action, attr) {
      // 验证表单是否正确
      this.validate(valid => {
        if (valid) {
          // 表单提交校验
          this.formSubmitVerify((result, errorMsg) => {
            if (!result) {
              this.$message.closeAll()
              return this.$message.warning(errorMsg)
            }
            // 保存数据
            this.saveDataByCustom(action, attr)
          })
        } else {
          this.formErrorToast()
        }
      })
    },
    // 递归获取数据
    getConfigurationData(items, type, isJson) {
      let result = {}
      if (this.$utils.isEmpty(items)) {return result}
      for (let k = 0; k < items.length; k++) {
        const item = items[k]
        if (this.$utils.isEmpty(item.name)) {continue}
        let _data
        const desc = `按钮配置-body/headers设置-${type}-参数名：${item.name}的值格式错误,类型为：${item.dataType}!`
        if (item.dataType === 'string') {
          _data = item.defaultValue
        } else if (item.dataType === 'number') {
          if (this.$utils.isNum(item.defaultValue)) {
            _data = Number(item.defaultValue)
          } else {
            console.warn(desc)
            console.warn(item.defaultValue)
          }
        } else if (item.dataType === 'boolean') {
          if (['true', 'false'].includes(item.defaultValue)) {
            _data = Boolean(item.defaultValue)
          } else {
            console.warn(desc)
            console.warn(item.defaultValue)
          }
        } else if (item.dataType === 'date') {
          _data = item.defaultValue
        } else if (item.dataType === 'object') {
          _data = this.getConfigurationData(item.children, type)
        } else if (item.dataType === 'bind') {
          if (this.$utils.isNotEmpty(item.defaultValue)) {
            try {
              // eslint-disable-next-line no-eval
              _data = eval(item.defaultValue)
            } catch (error) {
              console.warn(desc)
              console.warn(item.defaultValue)
            }
          }
        } else {
          _data = item.defaultValue
        }
        if (isJson && items.length === 1) {
          result = _data
        } else {
          result[item.name] = _data
        }
      }
      return result
    },
    // 保存自定义的数据
    saveDataByCustom(action, attr) {
      // 表单数据
      const url = attr.custom_url
      const method = attr.custom_method
      const custom_setting = attr.custom_setting
      let headers = {}
      let body = {}
      let querys = {}
      if (this.$utils.isNotEmpty(custom_setting)) {
        // body
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && this.$utils.isNotEmpty(custom_setting.bodyData)) {
          const isJson = custom_setting.bodyType !== 'form'
          body = this.getConfigurationData(custom_setting.bodyData, 'body', isJson)
        }
        // querys
        if (this.$utils.isNotEmpty(custom_setting.querys)) {
          querys = this.getConfigurationData(custom_setting.querys, 'querys')
        }
        // headers
        if (this.$utils.isNotEmpty(custom_setting.headers)) {
          headers = this.getConfigurationData(custom_setting.headers, 'headers')
        }
        if (custom_setting.bodyType === 'form') {
          headers['Content-Type'] = 'application/x-www-form-urlencoded'
          body = qs.stringify(body)
        }
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveFormDataByCustom(querys, body, url, method, headers).then(response => {
        loading.close()
        this.$alert(`请求成功！`, {
          showClose: false
        }).then(() => {
          // 后置事件
          this.afterScript(this.actionName, response, () => {
            if (action === 'save') {
              this.callbackPage(response)
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
        loading.close()
      })
    },
    getRefsField(fieldName) {
      return this.$refs.formrender.getRefsField(fieldName)
    },
    handleStartFlowFrom(flowKey) {
      // 表单提交校验
      if (this.$utils.isEmpty(flowKey)) {
        // this.$message.warning('请检查是否绑定流程！')
        this.bpmDefDialogVisible = true
        return
      }
      // 验证表单是否正确
      this.validate(valid => {
        if (valid) {
          // 表单提交校验
          this.formSubmitVerify((result, errorMsg) => {
            if (!result) {
              this.$message.closeAll()
              return this.$message.warning(errorMsg)
            }
            if (flowKey) {
              this.$confirm('确定启动流程吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.handleStartFlowFromEdit(flowKey)
              }).catch(() => {})
            } else {
              this.bpmDefDialogVisible = true
            }
          })
        } else {
          this.formErrorToast()
        }
      })
    },
    handleDialogActionEvent(key, data) {
      if (key === 'clean') {
        this.bpmDefValue = {}
      } else if (key === 'confirm') {
        this.handleStartFlowFromEdit(data.defKey)
      } else {
        this.bpmDefValue = {}
      }
    },
    handleStartFlowFromEdit(flowKey) {
      const formData = JSON.stringify(this.getFormData())
      startFlowFromEdit({
        data: formData,
        flowKey: flowKey,
        pk: this.pkValue || ''
      }).then(response => {
        if (this.bpmDefDialogVisible) {
          this.bpmDefValue = {}
          this.bpmDefDialogVisible = false
        }
        this.$message({
          message: '流程启动成功！',
          type: 'success'
        })
        // 后置事件
        this.afterScript(this.actionName, {
          data: response.data,
          variables: response.variables
        }, () => {
          this.callbackPage(response, response.variables.dataId)
        })
      }).catch(() => {
        this.bpmDefValue = {}
        this.bpmDefDialogVisible = false
      })
    },
    // 保存
    handleSave() {
      // 验证表单是否正确
      this.validate(valid => {
        if (valid) {
          // 表单提交校验
          this.formSubmitVerify((result, errorMsg) => {
            if (!result) {
              this.$message.closeAll()
              return this.$message.warning(errorMsg)
            }
            // 保存数据
            this.saveData()
          })
        } else {
          this.formErrorToast()
        }
      })
    },
    // 保存数据
    saveData() {
      // 表单数据
      const formData = this.getFormData()
      const jsonData = {
        boCode: this.boCode,
        version: this.version,
        formKey: this.formKey,
        pk: this.pkValue,
        data: JSON.stringify(formData)
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveFormData(jsonData).then(response => {
        loading.close()
        this.$alert(`保存成功！`, {
          showClose: false
        }).then(() => {
          // 后置事件
          this.afterScript(this.actionName, {
            data: response.data,
            variables: response.variables
          }, () => {
            this.callbackPage(response, response.variables.id)
          })
        }).catch(() => {
        })
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 打印
     */
    handlePrint() {
      if (this.$utils.isNotEmpty(this.printTemplateId)) {
        this.submitFormData = this.getFormData()
        // 打开打印模版页面
        this.formPrintTemplateDialogVisible = true
      } else {
      //  window.print()
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.loading')
        })
        setTimeout(() => {
          Print(this.$refs.formrender.$el, {
            title: '',
            callback: () => {
              loading.close()
            }
          })
        }, 300)
      }
    }
  }
}
