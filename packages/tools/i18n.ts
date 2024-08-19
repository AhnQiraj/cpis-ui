import VueI18n from 'vue-i18n'
import axios from 'axios'

type Module =
  | 'Platform'
  | 'Tickets'
  | 'Safety'
  | 'Equipment'
  | 'Workorder'
  | 'Examination'
  | 'Shiftduty'
  | 'Inspection'
  | 'Material'
  | 'Assess'
  | 'Calculation'
  | 'Supervision'
  | 'Engineering'
  | 'Eqeval'
  | 'External'
  | 'Datapush'
  | string;
type Locale = 'zh-CN' | 'en-US' | string;
type RequestOption = {
  baseURL: string;
  url: string;
}
type Props = {
  locale: Locale;
  module: Module;
  requestOption?: RequestOption;
}

class I18n extends VueI18n {
  requestOption?: RequestOption  // 声明类中的 requestOption 属性
  _locale: Locale

  constructor(props: Props) {
    super({
      locale: props.locale,
      fallbackLocale: props.locale
    })
    const { url, baseURL } = props.requestOption || {}
    this._locale = props.locale
    this.requestOption = {
      baseURL: baseURL,
      url: url || '/platform/v3/i8n/api/getI18nValue'
    }
  }

  loadLocalAsync(locale: Locale, module: Module) {
    const that = this
    return axios({
      ...this.requestOption,
      data: {
        locale,
        module
      }
    })
      .then(res => res.data)
      .then(message => that.mergeLocaleMessage(locale, message))
  }

  mergeLocaleMessage(locale, message) {
    super.mergeLocaleMessage(locale, message)
  }
}


export default I18n