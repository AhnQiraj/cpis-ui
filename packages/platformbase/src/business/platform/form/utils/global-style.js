/**
 * 表单管理-全局样式
 * 通过传入的数据获取样式
 * <pre>
 * 作者:cjt
 * 日期:2020-10-14
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { previewFile } from '@platform/api/platform/file/attachment'
import Utils from '@platform/utils/util'
// 字体对应的样式
const fontFamily = {
  default: 'inherit',
  Tahoma: 'Tahoma, Segoe, sans-serif',
  Helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  Verdana: 'Verdana, Geneva, sans-serif',
  Georgia: 'Georgia, "Times New Roman", serif',
  heiti: '"Hiragino Sans GB", STXihei, "Microsoft YaHei", sans-serif',
  kaiti: 'KaiTi, STKaiti, Georgia, "Times New Roman", serif',
  songti: 'Simsun, Georgia, "Times New Roman", serif'
}
const styles = {
  getStyleByName(data, tfName, fsName, bName, cName, aName) { // 通过name获取样式(字体、字号、加粗、颜色、对齐方式)
    let _style = ''
    _style += this.getTypefaceByName(data, tfName)
    _style += this.getFontSizeByName(data, fsName)
    _style += this.getBoldByName(data, bName)
    _style += this.getColorByName(data, cName)
    _style += this.getAlignmentByName(data, aName)
    return _style
  },
  getTypefaceByName(data, name) { // 通过name获取字体
    let _style = ''
    if (Utils.isEmpty(data)) {return _style}
    if (Utils.isNotEmpty(data[name])) {
      let _fontFamily = fontFamily.default
      if (Utils.isNotEmpty(fontFamily[data[name]])) {_fontFamily = fontFamily[data[name]]}
      _style = `font-family: ${_fontFamily};`
    }
    return _style
  },
  getFontSizeByName(data, name) { // 通过name获取字号
    let _style = ''
    if (Utils.isEmpty(data)) {return _style}
    if (Utils.isNotEmpty(data[name])) {
      if (data[name] !== 'default') {
        _style = `font-size: ${data[name]}px;`
      }
    }
    return _style
  },
  getBoldByName(data, name) { // 通过name获取是否加粗
    let _style = 'font-weight: normal;'
    if (Utils.isEmpty(data)) {return _style}
    if (Utils.isNotEmpty(data[name]) && data[name]) {
      _style = `font-weight: bold;`
    }
    return _style
  },
  getColorByName(data, name) { // 通过name获取颜色
    return this.common(data, name, 'color')
  },
  getAlignmentByName(data, name) { // 通过name获取对齐方式
    let _style = ''
    if (Utils.isEmpty(data)) {return _style}
    if (Utils.isNotEmpty(data[name])) {
      _style = `text-align: ${data[name]}!important;`
    }
    return _style
  },
  getBgColorByName(data, name) { // 通过name获取底色
    return this.common(data, name, 'background-color')
  },
  getShadowByName(data, name) { // 通过name获取阴影
    let _style = ''
    if (Utils.isEmpty(data)) {return _style}
    if (Utils.isNotEmpty(data[name]) && data[name] === 'Y') {
      _style = 'box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);'
    }
    return _style
  },
  getStyle(data) { // 页面背景 + 表单全局-电脑宽度   样式
    let _style = ''
    if (Utils.isEmpty(data)) {return _style}
    // 表单全局-电脑宽度
    if (Utils.isNotEmpty(data.PCWidth)) {
      const padding = {
        full: '0',
        narrow: '20px 150px',
        normal: '20px 100px',
        wide: '20px'
      }
      _style += `padding:${padding[data.PCWidth]};`
      if (data.PCWidth === 'full') { // 设置为全屏时，取消背景
        return _style
      }
    }
    // 页面背景
    if (data.pageBackground === 'bgColor') {
      if (Utils.isNotEmpty(data.bgColor)) {
        _style += `background-color: ${data.bgColor};`
      }
    } else if (data.pageBackground === 'picture') {
      if (Utils.isNotEmpty(data.backgroundImage)) {
        let img = []
        if (typeof data.backgroundImage === 'string') {
          img = JSON.parse(data.backgroundImage)
        } else if (typeof data.backgroundImage === 'object') {
          img = JSON.parse(JSON.stringify(data.backgroundImage))
        }
        if (Utils.isEmpty(img)) {return _style}
        const url = this.getImageUrl(img[0].id)
        _style += `background-color: #fff;background-image: url(${url});`
        if (data.isRepeat === 'noRepeat') {
          _style += 'background-repeat: no-repeat;background-size: cover;background-position: center top;'
        }
      }
    }
    return _style
  },
  getImageByName(data, name) { // 通过name获取图片地址
    const _urls = []
    if (Utils.isEmpty(data)) {return _urls}
    if (Utils.isNotEmpty(data[name])) {
      let img = []
      if (Utils.isArray(data[name])) {
        img = data[name]
      } else {
        img = JSON.parse(data[name])
      }
      if (Utils.isEmpty(img)) {return _urls}
      img.forEach(el => {
        const url = this.getImageUrl(el.id)
        if (Utils.isNotEmpty(url)) {_urls.push(url)}
      })
    }
    return _urls
  },
  getImageUrl(id) { // 通过图片ID获取图片url
    return previewFile(id)
  },
  common(data, name, style) { // 通用方法：通过name获取style
    let _style = ''
    if (Utils.isEmpty(data)) {return _style}
    if (Utils.isNotEmpty(data[name])) {
      _style = `${style}: ${data[name]};`
    }
    return _style
  }
}
export default styles
