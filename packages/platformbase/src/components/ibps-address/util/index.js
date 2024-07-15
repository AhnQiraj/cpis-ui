const util = {
  CN_CODE: 'CN', // 中国编码
  levelArr: ['country', 'province', 'city', 'district'], // 等级
  dataTypeArr: ['all', 'code', 'name', 'codeString'],
  oneOf: (item, ary) => {
    return ary.some(i => {
      return i === item
    })
  },
  /**
   * name在对象 所在的索引
   */
  getObjectIndex: (obj, name) => {
    for (const o in obj) {
      if (o === name) {return o}
    }
  },
  /**
   * name在list 所在的索引
   */
  getIndex: (list, name) => {
    for (const i in list) {
      if (list[i] === name) {return i}
    }
  },
  /**
   * 获取索引
   */
  getLevelIndex: (level) => {
    return parseInt(util.getIndex(util.levelArr, level), 10)
  },
  /**
   * 获取下个的索引
   */
  getNextLevel: (level) => {
    const index = util.getLevelIndex(level)
    return index + 1 >= util.levelArr.length ? util.levelArr[index] : util.levelArr[index + 1]
  },
  getPrevLevel: (level) => {
    const index = util.getLevelIndex(level)
    return index - 1 <= 0 ? util.levelArr[0] : util.levelArr[index - 1]
  },
  /**
   * 通过索引获取等级key
   */
  getLevelKey: (i) => {
    return util.levelArr[i]
  },
  /**
   * 检查level是否在符合
   * @param {*} level
   */
  checkLevel: level => {
    return util.oneOf(level, util.levelArr)
  }
}
export default util
