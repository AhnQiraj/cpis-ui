import Vue from 'vue'
import * as utils from '@/utils/cpUtils/index'
export default {
  saveOpLog(operateType, businessKey, operateKey) {
    let url = window.location.href
    const curUserObj = utils.getLoginInfo()
    let userId = curUserObj.user.id
    let userName = curUserObj.user.name
    let fullName = curUserObj.user.fullname
    let pageUrl = getPath(url, '#', '?')
    let companyId = curUserObj.company.companyId
    let data = {
      userId: userId,
      userName: userName,
      fullName: fullName,
      pageUrl: pageUrl,
      companyId: companyId,
      operateType: operateType,
      businessKey: businessKey,
      operateKey: operateKey,
      systemKey: '00'
    }
    window.apiList['extend/index'].saveCpisBusinessOpLog(data)['catch'](e => {
      console.log(e)
    })
  }
}
function getPath(str, firstStr, secondStr) {
  if (str == '' || str == null || str == undefined) {
    return ''
  }
  if (str.indexOf(firstStr) < 0) {
    return ''
  }
  let subFirstStr = str.substring(str.indexOf(firstStr) + firstStr.length, str.length)
  if (subFirstStr.indexOf(secondStr) < 0) {
    return subFirstStr
  }
  let subSecondStr = subFirstStr.substring(0, subFirstStr.indexOf(secondStr))
  return subSecondStr
}
