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


class I18nTools {
  requestOption?: RequestOption  // 声明类中的 requestOption 属性
  constructor(props: Props) {
    const { url = '/platform/v3/i18n/api/getI18nValue', baseURL } = props.requestOption
    this.requestOption = {
      baseURL: baseURL,
      url: url
    }
  }
  async localRemoteI18n(module: Module) {
    const lang = document?.querySelector?.('html')?.getAttribute?.('lang') ?? 'zh-CN'
    return axios({
      ...this.requestOption,
      params: {
        locale: lang,
        module
      }
    })
      .then(res => (
        {
          message: res?.data?.data ?? [],
          lang: document?.querySelector?.('html')?.getAttribute?.('lang') ?? 'zh-CN',
        }
      ))
  }
}


export default I18nTools