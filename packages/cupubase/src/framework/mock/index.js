import Mock from "mockjs"
const Random = Mock.Random
// 用于接受生成数据的数组
let tableList = []
for (let i = 0; i < 100; i++) {
  let newObject = {
    id: i,
    title: Random.csentence(5, 10),
    name: Random.cname(),
    city: Random.city(true),
    date: Random.date("yyyy-MM-dd")
  }
  tableList.push(newObject)
}
const getUrlParams = function (urlStr) {
  let url
  if (typeof urlStr == "undefined") {
    url = decodeURI(location.search) //获取url中"?"符后的字符串
  } else {
    url = "?" + urlStr.split("?")[1]
  }
  let theRequest = {}
  if (url.indexOf("?") != -1) {
    let str = url.substr(1)
    let strs = str.split("&")
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
    }
  }
  return theRequest
}
Mock.setup({
  timeout: "500-2000"
})
// post请求分页
Mock.mock(RegExp(window.config.VUE_APP_BASE_API + "api/demo/tableData" + ".*"), /get|post/i, params => {
  const requestParams = JSON.parse(params.body)
  const page = requestParams.requestPage
  const [index, size, total] = [parseInt(page.pageNo), parseInt(page.limit), tableList.length]
  let len = total / size
  const totalPages = len - parseInt(len) > 0 ? parseInt(len) + 1 : len
  // 截取list
  const newProduceNewsData = tableList.slice((index - 1) * size, index * size)
  return { code: "0", message: "", data: { dataResult: newProduceNewsData, pageResult: { totalCount: total, totalPages: totalPages } } }
})
Mock.mock(RegExp(window.config.VUE_APP_BASE_API + "api/demo/treedata"), /get|post/i, params => {
  const trs = []
  for (let i = 0; i < 20; i++) {
    trs.push({
      id: Random.integer(1, 100000),
      text: Random.cname(),
      son: [
        {
          id: Random.integer(1, 100000),
          text: "二级 1-1",
          son: [
            {
              id: Random.integer(1, 100000),
              text: "三级 1-1-1"
            }
          ]
        }
      ]
    })
  }
  return trs
})
Mock.mock(RegExp(window.config.VUE_APP_BASE_API + "api/demo/xxxtedd"), /get|post/i, params => {
  return [
    {
      id: Random.integer(1000, 100000),
      text: "1111",
      son: [
        {
          id: Random.integer(1000, 100000),
          text: "二级 1-1",
          son: [
            {
              id: Random.integer(1000, 100000),
              text: "三级 1-1-1"
            }
          ]
        }
      ]
    }
  ]
})
