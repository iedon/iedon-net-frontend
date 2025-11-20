import { computed, h, Ref, ref, VNode } from 'vue'
import { notification, NotificationPlacement } from 'ant-design-vue'
import config from '../config'
import { makeRequest, PostResponse, SiteConfigDataResponse, TokenRefreshResponse } from './packetHandler'
import dayjs from 'dayjs'

export const splitMessageToVNodes = (message: string) => message.split('\n').map(line => h('p', line.trim()))

export const openNotification = (placement: NotificationPlacement, type: 'error' | 'info' | 'success' | 'warning', title: string, message: string | VNode, duration?: number) => {
  notification[type]({
    message: title,
    description: message,
    placement,
    duration: duration || 5
  })
}

export const loggedIn = ref(false)
export const siteConfig: Ref<SiteConfigDataResponse> = ref({
  netAsn: config.configFallback.netAsn,
  netName: config.configFallback.netName,
  netDesc: config.configFallback.netDesc,
  footerText: config.configFallback.footerText,
  maintenanceText: config.configFallback.maintenanceText
})

export const refreshSiteConfig = async (t: (i18n: string) => string) => {
  try {
    const resp = await makeRequest(t, '/list/config', undefined, true)
    if (resp.success && resp.response) {
      const { netAsn, netName, netDesc, footerText, maintenanceText } = resp.response as SiteConfigDataResponse
      siteConfig.value = {
        netAsn: netAsn || config.configFallback.netAsn,
        netName: netName || config.configFallback.netName,
        netDesc: netDesc || config.configFallback.netDesc,
        footerText: footerText,
        maintenanceText: maintenanceText || config.configFallback.maintenanceText
      }
      if (pageTitle) {
        document.title = `${pageTitle} - ${netName}(${netAsn})`
      } else {
        document.title = `${netName}(${netAsn}) - ${netDesc}`
      }
      if (siteConfig.value.maintenanceText !== '') openNotification("topLeft", "info", t('notification.maintenance'), maintenanceText, 20)
    }
  } catch (error) {
    console.error(error)
    siteConfig.value.footerText = config.configFallback.footerText
  }
}

export const useHeartBeat = (t: (i18n: string) => string) => {
  const heartBeat = async () => {
    refreshSiteConfig(t)
    try {
      const token = localStorage.getItem('token')
      const asn = localStorage.getItem('asn')
      const person = localStorage.getItem('person')
      if (asn && (person !== undefined && person !== null) && token) {
        loggedIn.value = true
        const resp = await makeRequest(t, '/token', undefined, true)
        if (resp.success && resp.response) {
          const data = resp.response as TokenRefreshResponse
          if (data && data.token) {
            localStorage.setItem('token', data.token)
            return
          }
        }
      }
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

let pageTitle = ''
export const registerPageTitle = (title: string) => {
  pageTitle = title
  if (title !== '') {
    document.title = `${title} - ${siteConfig.value.netName}(${siteConfig.value.netAsn})`
  } else {
    document.title = `${siteConfig.value.netName}(${siteConfig.value.netAsn}) - ${siteConfig.value.netDesc}`
  }
}

export const postCache = new Map<string, PostResponse>()

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

export const formatRelativeTime = (dateString: string, t: (key: string) => string) => {
  const now = dayjs()
  const target = dayjs(dateString)
  const diffSeconds = now.diff(target, 'second')

  if (diffSeconds < 60) {
    return `${diffSeconds} ${t('pages.metrics.timeAgo.seconds')}`
  } else if (diffSeconds < 3600) { // less than 1 hour
    const minutes = Math.floor(diffSeconds / 60)
    return `${minutes} ${minutes === 1 ? t('pages.metrics.timeAgo.minute') : t('pages.metrics.timeAgo.minutes')}`
  } else if (diffSeconds < 86400) { // less than 1 day
    const hours = Math.floor(diffSeconds / 3600)
    return `${hours} ${hours === 1 ? t('pages.metrics.timeAgo.hour') : t('pages.metrics.timeAgo.hours')}`
  } else {
    const days = Math.floor(diffSeconds / 86400)
    return `${days} ${days === 1 ? t('pages.metrics.timeAgo.day') : t('pages.metrics.timeAgo.days')}`
  }
}

export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const showMyConnectivityInMap = () => {
    window.open(`${config.mapDn42Url}/${localStorage.getItem('asn') ? `#${localStorage.getItem('asn')}` : ''}`, '_blank')?.focus();
}

export const sessionMgmtSearchText = ref('')

export const isAdmin = computed(() => siteConfig.value.netAsn === localStorage.getItem('asn'))

const SUPPORTED_THEMES = ['light', 'dark'] as const
export type ThemeName = typeof SUPPORTED_THEMES[number]

export const THEME_STORAGE_KEY = 'theme'

export const isValidTheme = (candidate: unknown): candidate is ThemeName =>
  typeof candidate === 'string' && SUPPORTED_THEMES.includes(candidate as ThemeName)

export const themeName = ref<ThemeName>('light')

export const applyTheme = (newThemeName?: string, persist = false) => {
  const targetTheme: ThemeName = isValidTheme(newThemeName) ? newThemeName : 'light'
  themeName.value = targetTheme

  if (persist && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, targetTheme)
    } catch (error) {
      console.warn('Failed to persist theme preference', error)
    }
  }
}

applyTheme(undefined, false)

export const VAR_SIZE_LG = 992
