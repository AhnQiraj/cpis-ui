export default {
  data() {
    return {
      edit: {},
      grid: {},
      mustAllFields: ['read', 'edit', 'required']
    }
  },
  beforeDestroy() {
    this.edit = null
    this.grid = null
  },
  methods: {
    // 样式控制
    buttonActions(value, data, rigthIndex, buttonIndex) {
      const hasGiveScope = this.$utils.isNotEmpty(value.giveScope)
      if (hasGiveScope) {
        value.giveScope.forEach(scope => {
          data.forEach((item, i) => {
            item.buttonGroup.forEach(types => {
              if (value.giveScope.indexOf(item.key) === -1) {
                types.type = types.key === 'none' ? value.giveButtonType : ''
              }
            })
            if (scope === item.key) {
              item.buttonGroup.forEach(types => {types.type = ''})
              const index = item.buttonGroup.findIndex(button => button.key === value.giveButtonKey)
              item.buttonGroup[index].type = value.giveButtonType
            }
          })
        })
      }
      data[rigthIndex].buttonGroup.forEach(types => {types.type = ''})
      if (value.rights === 'hide' && value.key === 'all') {
        const targetBtns = []
        data.forEach((item, i) => {
          if (item.key !== 'hide') {
            targetBtns.push(item)
          }
        })
        targetBtns.forEach(t => {
          t.buttonGroup.forEach(types => {
            if (types.key === 'none' || types.key === 'hide') {
              types.type = 'success'
            } else {
              types.type = ''
            }
          })
        })
      }
      data[rigthIndex].buttonGroup[buttonIndex].type = 'success'
      if (value.key === 'edit' && !hasGiveScope) {
        this.dialogRightsVisible = true
        this.edit = value
      } else {
        this.controlAllDataActions(value, hasGiveScope)
      }
    },
    // 字段按钮-数据控制
    controlAllDataActions(value, hasGiveScope, targetRights, authorization, boName) {
      const { rightsFormData, rightsList, mustAllFields, opinion } = this
      rightsFormData.forEach(form => {
        // 主体字段
        form.fields.forEach(field => {
          for (let i in field) {
            if (Object.prototype.toString.call(field[i]) === '[object Array]') {
              if (rightsList.includes(i)) {
                if (hasGiveScope) {
                  field[i] = [{
                    type: 'none',
                    rightsId: '',
                    rightsName: ''
                  }]
                  value.giveScope.forEach(scope => { // 字段控制
                    field[scope] = value.giveRight
                  })
                } else if (this.$utils.isNotEmpty(value.rights)) { // 列编辑控制
                  if (value.rights === 'hide' && value.giveRight[0].type === 'all') {
                    rightsList.forEach(r => {
                      if (r !== value.rights) {
                        field[r] = [{ type: 'none', rightsId: '', rightsName: '' }]
                      }
                    })
                  }
                  field[value.rights] = value.giveRight
                } else if (field.name === value.name && form.name === boName) { // 栅格编辑||删除控制
                  if (targetRights === 'hide' && authorization[0].type === 'all') {
                    rightsList.forEach(r => {
                      if (r !== targetRights) {
                        field[r] = [{ type: 'none', rightsId: '', rightsName: '' }]
                      }
                    })
                  }
                  field[targetRights] = authorization
                }
              } else if (hasGiveScope || value.rights === 'read') {
                let val = []
                if (!hasGiveScope && value.key === 'edit') { // 列编辑控制
                  val = value.giveRight
                } else { // 字段控制
                  val = [{
                    type: mustAllFields.includes(value.key) || value.key === 'all' ? 'all' : 'none',
                    rightsId: '',
                    rightsName: ''
                  }]
                }
                field[i] = val
              } else if (targetRights === 'show') { // 栅格编辑||删除控制
                if (field.name === value.name) {
                  field[targetRights] = authorization
                }
              }
            }
          }
        })
        // 子表特殊字段
        if (form.isMain === 'N') {
          for (let attr in form) {
            if (rightsList.includes(attr)) {
              if (hasGiveScope) {
                form[attr] = [{
                  type: 'none',
                  rightsId: '',
                  rightsName: ''
                }]
                value.giveScope.forEach(scope => { // 字段控制
                  form[scope] = value.giveRight
                })
              } else if (this.$utils.isNotEmpty(value.rights)) { // 列编辑控制
                if (value.rights === 'hide' && value.giveRight[0].type === 'all') {
                  rightsList.forEach(r => {
                    if (r !== value.rights) {
                      form[r] = [{ type: 'none', rightsId: '', rightsName: '' }]
                    }
                  })
                }
                form[value.rights] = value.giveRight
              } else if (form.name === value.name && form.name === boName) { // 栅格编辑||删除控制
                if (targetRights === 'hide' && authorization[0].type === 'all') {
                  rightsList.forEach(r => {
                    if (r !== targetRights) {
                      form[r] = [{ type: 'none', rightsId: '', rightsName: '' }]
                    }
                  })
                }
                form[targetRights] = authorization
              }
            } else if (this.$utils.isNotEmpty(value.show) && targetRights === 'read' && form.name === boName) { // 栅格编辑||删除控制
              const index = form.buttons.findIndex(button => button.name === value.name)
              form.buttons[index].show = authorization
            }
            // 全局控制子表顶部按钮权限
            // else if (hasGiveScope || value.rights === 'read' || value.rights === 'hide') {
            //   let val = []
            //   if (!hasGiveScope) { // 列编辑控制
            //     val = value.key === 'edit' ? value.giveRight : [{ type: 'none', rightsId: '', rightsName: '' }]
            //   } else { // 字段控制
            //     val = [{
            //       type: mustAllFields.includes(value.key) || value.key === 'all' ? 'all' : 'none',
            //       rightsId: '',
            //       rightsName: ''
            //     }]
            //   }
            //   form.buttons.forEach(button => {
            //     button['show'] = val
            //   })
            // }
          }
        }
        // 审批意见
        if (this.$utils.isNotEmpty(opinion)) {
          opinion.forEach(idea => {
            for (let i in idea) {
              if (Object.prototype.toString.call(idea[i]) === '[object Array]' && rightsList.includes(i)) {
                if (hasGiveScope) {
                  idea[i] = [{
                    type: 'none',
                    rightsId: '',
                    rightsName: ''
                  }]
                  value.giveScope.forEach(scope => { // 字段控制
                    idea[scope] = value.giveRight
                  })
                } else if (this.$utils.isNotEmpty(value.rights)) { // 列编辑控制
                  if (value.rights === 'hide' && value.giveRight[0].type === 'all') {
                    rightsList.forEach(r => {
                      if (r !== value.rights) {
                        idea[r] = [{ type: 'none', rightsId: '', rightsName: '' }]
                      }
                    })
                  }
                  idea[value.rights] = value.giveRight
                } else if (idea.name === value.name) { // 栅格编辑||删除控制
                  if (targetRights === 'hide' && authorization[0].type === 'all') {
                    rightsList.forEach(r => {
                      if (r !== targetRights) {
                        idea[r] = [{ type: 'none', rightsId: '', rightsName: '' }]
                      }
                    })
                  }
                  idea[targetRights] = authorization
                }
              }
            }
          })
        }
      })
    },
    // 列全局编辑
    handleRightsConfirm(data) {
      const { edit, grid } = this
      if (this.$utils.isNotEmpty(edit.giveRight)) {
        edit.giveRight = data
        this.controlAllDataActions(edit)
      } else {
        grid.giveRight = data
        this.controlAllDataActions(grid.targetItem, grid.hasGiveScope, grid.rigths, grid.giveRight, grid.boName)
      }
    },
    // 栅格编辑
    handleSettings(buttonKey, rigths, targetItem, boName) {
      this.dialogRightsVisible = buttonKey === 'edit'
      const grid = {}
      grid.giveRight = [{ type: 'all', rightsId: '', rightsName: '' }]
      grid.buttonKey = buttonKey
      grid.rigths = rigths
      grid.targetItem = targetItem
      grid.boName = boName
      grid.hasGiveScope = this.$utils.isNotEmpty(targetItem.giveScope)
      this.grid = grid
      this.edit = {}
      if (!this.dialogRightsVisible) {
        this.controlAllDataActions(grid.targetItem, grid.hasGiveScope, grid.rigths, grid.giveRight, grid.boName)
      }
    },
    // 权限逐个删除
    handleRemove(deleteIndex, operand, scopes, lists, typeKeys, boName) {
      let rightsId
      let rightsName
      const giveRight = scopes
      if (operand.type !== 'all') {
        rightsId = this.$utils.isNotEmpty(operand.rightsId) ? operand.rightsId.split(',') : 'none'
        if (this.$utils.isNotEmpty(operand.rightsId)) {rightsId.splice(deleteIndex, 1)}
        rightsName = operand.rightsName.split(',')
        rightsName.splice(deleteIndex, 1)
      }
      const overOperand = {
        rightsId: operand.type !== 'all' ? rightsId.join(',') : '',
        rightsName: operand.type !== 'all' ? rightsName.join(',') : '',
        type: operand.type !== 'all' ? operand.type : 'none'
      }
      const index = giveRight.findIndex(scope => scope.type === overOperand.type)
      if (index !== -1) {
        giveRight[index] = overOperand
      } else {
        giveRight[0] = overOperand
      }
      this.controlAllDataActions(lists, this.$utils.isNotEmpty(lists.giveScope), typeKeys, giveRight, boName)
    }
  }
}
