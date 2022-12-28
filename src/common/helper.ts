import { computed, h, Ref, ref, VNode } from 'vue'
import { message } from 'ant-design-vue'
import config from '../config'
import { makeRequest, Post, SiteConfigData } from './packetHandler'
import dayjs from 'dayjs'
import themeLight from '../styles/light.less?inline'
import themeDark from '../styles/dark.less?inline'
import "ant-design-vue/es/message/style/css"

export const splitMessageToVNodes = (message: string) => {
    const paras: VNode[] = []
    message.split('\n').forEach(line => paras.push(h('p', line.trim())))
    return paras
}

export const loggedIn = ref(false)
export const siteConfig: Ref<SiteConfigData> = ref({
  netAsn: config.configFallback.netAsn,
  netName: config.configFallback.netName,
  netDesc: config.configFallback.netDesc,
  footerText: config.configFallback.footerText,
  maintenanceText: config.configFallback.maintenanceText
})
export const refreshSiteConfig = async (t: (i18n: string) => string) => {
  try {
    const resp = await makeRequest(t, '/list', { type: 'config' }, true) as SiteConfigData
    if (resp) {
      const { netAsn, netName, netDesc, footerText, maintenanceText } = resp
      siteConfig.value = {
        netAsn: netAsn || config.configFallback.netAsn,
        netName: netName || config.configFallback.netName,
        netDesc: netDesc || config.configFallback.netDesc,
        footerText: footerText,
        maintenanceText: maintenanceText || config.configFallback.maintenanceText
      }
      document.title = `${netName}(${netAsn}) - ${netDesc}`
      if (siteConfig.value.maintenanceText !== '') message.info(maintenanceText)
    }
  } catch (error) {
    console.error(error)
    siteConfig.value.footerText = config.configFallback.footerText
  }
}
export const useHeartBeat = (t: (i18n: string) => string) => {
    const heartBeat = async () => {
      await refreshSiteConfig(t)
      try {

        const token = localStorage.getItem('token')
        const asn = localStorage.getItem('asn')
        const person = localStorage.getItem('person')
        if (asn && (person !== undefined && person !== null) && token) {
          const resp = await makeRequest(t, '/ping', { action: 'ping' }, true) as string
          loggedIn.value = resp === 'pong'
          if (loggedIn.value) return
        }

        localStorage.removeItem('token')
        localStorage.removeItem('asn')
        localStorage.removeItem('person')
        localStorage.removeItem('email')
        loggedIn.value = false

      } catch (error) {
        loggedIn.value = false
        console.error(error)
      }
    }
    const handle = setInterval(heartBeat, config.pingIntervalMs)
    heartBeat()
    return () => clearInterval(handle)
}

export const postCache = new Map<string, Post>()

// regex took from https://stackoverflow.com/questions/23483855/javascript-regex-to-validate-ipv4-and-ipv6-address-no-hostnames
export const IPV4_REGEX = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/
export const IPV6_REGEX = /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/

export const ASN_MIN = 0
export const ASN_MAX = 4294967295

export const nullOrEmpty = (obj: any) => obj === undefined || obj === null || obj === ''

export const formatDate = (dateString: string) => {
  const parsed = dayjs(dateString)
  return parsed.toString()
}

export const isAdmin = computed(() => siteConfig.value.netAsn === localStorage.getItem('asn'))

export const theme = ref('light')

export const applyTheme = (themeName?: string) => {
  theme.value = themeName || 'light'
  const head = document.getElementsByTagName("head")[0]
  const getStyle = head.getElementsByTagName('style')
  if (getStyle.length > 0) {
    for (let i = 0, l = getStyle.length; i < l; i++) {
      if (getStyle[i].getAttribute('data-type') === 'theme') {
        getStyle[i].remove()
        break
      }
    }
  }
  const styleDom = document.createElement("style")
  styleDom.dataset.type = "theme"
  styleDom.innerHTML = themeName === 'dark' ? themeDark : themeLight
  head.appendChild(styleDom)
}

applyTheme()

export const VAR_SIZE_LG = 992
