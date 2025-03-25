module.exports = file => require("@/views/" + file)["default"]
// 原版本
// module.exports = file => () => import('@/views/' + file)
