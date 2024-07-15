<template>
  <el-dropdown id="issueWorkTicket" ref="dropDown" trigger="click" placement="top" style="margin: 0px 63px; margin-top: 8px" @command="handleCommand">
    <el-button :type="type" @click="issueWork">{{ $t('baseCommon.component.issueWorkTicket') }}</el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(items, index) in workTypeList" :key="index" :command="items">{{ items.wtTypeName }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import * as utils from '@cupu/utils/index'
export default {
  name: 'IssueWorkTicket',
  props: {
    params: {},
    type: ''
  },
  data() {
    return {
      userInfo: {},
      workTypeList: []
    }
  },
  created() {
    const curUserObj = utils.getLoginInfo()
    this.userInfo.userId = curUserObj.user.id
    this.userInfo.userName = curUserObj.user.name
    window.apiList['tickets/index'].wtTypeList().then(res => {
      let wtTypeList = res?.data || []
      if (this.userInfo.userId === '1') {
        this.workTypeList = wtTypeList.filter(item => item.isMain === 1 && item.isOn === 1).sort((a, b) => a.sortNo - b.sortNo)
      } else {
        this.workTypeList = []
        window.apiList['tickets/index'].findWtPersonAuthByUserId({ userId: this.userInfo.userId }).then(userRes => {
          if (userRes.data) {
            userRes.data.forEach(item => {
              if (item.authCode.indexOf('manager') >= 0 || item.authCode.indexOf('signer') >= 0) {
                wtTypeList.forEach(type => {
                  if (type.wtTypeNo == item.wtType) {
                    if (type.isMain === 1) {
                      this.workTypeList.push(type)
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  methods: {
    // 开具工作票
    issueWork() {
      // window.apiList['tickets/index']
      //   .findWtPersonRoleByUserId({
      //     userId: this.userInfo.userId
      //   })
      //   .then(response => {
      //     if (response?.data?.isManager !== '1') {
      //       this.$refs.dropDown.hide()
      //       this.$message.error(this.$t('baseCommon.message.noWorkHeadAuth'))
      //     }
      //   })
    },
    handleCommand(command) {
      let value = {
        path: '/workPicketManage/wtWorkTktInvAdd',
        query: {
          option: 'add',
          wtTypeNo: command.wtTypeNo,
          wtTypeId: command.wtTypeId
        }
      }
      Object.assign(value.query, this.params)
      if (window.pageType === 'workflow') {
        window.parent.postMessage({ type: 'microRoute', routeParams: value }, '*')
      } else {
        window.parent.goToRoute({ appName: 'subapp', eventType: 'NAVIGATETO', routeParams: value })
      }
    }
  }
}
</script>
