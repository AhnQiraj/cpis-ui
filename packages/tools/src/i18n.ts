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
  requestOption: RequestOption;
}

class I18n extends VueI18n {
  requestOption?: RequestOption  // 声明类中的 requestOption 属性
  constructor(props: Props & VueI18n.I18nOptions) {
    super({
      locale: props.locale,
      fallbackLocale: props.locale
    })
    const { url = '/platform/v3/i8n/api/getI18nValue', baseURL } = props.requestOption
    this.requestOption = {
      baseURL: baseURL,
      url: url
    }
  }

  loadLocalAsync(locale: Locale, module: Module, skipMerge = true) {
    const that = this
    return axios({
      ...this.requestOption,
      params: {
        locale,
        module
      }
    })
      .then(res => res?.data?.data ?? '')
      .then(message => {
        if (skipMerge) {
          return message
        }
        return that.mergeLocaleMessage(locale, message)

      }).catch(() => {
      })
  }

  mergeLocaleMessage(locale: Locale, message: any) {
    super.mergeLocaleMessage(locale, message)
  }
}


export default I18n