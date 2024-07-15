const DateFormatUtil = {
  $dp: {
    has: {},
    dateFmt: 'yyyy-MM-dd',
    // 日期控件类型 timePicker 时间选择器 datePicker
    datePckerType: 'datePicker',
    // 日期时间类型
    dateType: 'datetime'
  },
  dealFmt(dateFmt) {
    this.$dp.dateFmt = dateFmt
    this._setHas(/w/)
    this._setHas(/WW|W/)
    this._setHas(/DD|D/)
    this._setHas(/yyyy|yyy|yy|y/)
    this._setHas(/MMMM|MMM|MM|M/)
    this._setHas(/dd|d/)
    this._setHas(/HH|H/)
    this._setHas(/mm|m/)
    this._setHas(/ss|s/)
    // 年月日
    this.$dp.has.sd = !!((this.$dp.has.y || this.$dp.has.M || this.$dp.has.d))
    // 时分秒
    this.$dp.has.st = !!((this.$dp.has.H || this.$dp.has.m || this.$dp.has.s))
    if (this.$dp.has.sd) { // 有年月日
      this.$dp.datePckerType = 'datePicker'
      if (this.$dp.has.st) { // 有日期有时间
        this.$dp.dateType = 'datetime'
      } else { // 只有日期没有时间
        if (this.$dp.has.y && !this.$dp.has.M && !this.$dp.has.d) { // 只有年
          this.$dp.dateType = 'year'
        } else if (this.$dp.has.M && !this.$dp.has.d) { // 有月没日
          this.$dp.dateType = 'month'
        } else {
          this.$dp.dateType = 'date'
        }
      }
    } else { // 只有时间
      this.$dp.datePckerType = 'timePicker'
      this.$dp.dateType = 'time'
    }
    return this.$dp
  },
  _setHas(re) {
    let p = (re + '').slice(1, 2)
    this.$dp.has[p] = re.exec(this.$dp.dateFmt) ? (this.$dp.has.minUnit = p, true) : false
  }
}
export default DateFormatUtil
