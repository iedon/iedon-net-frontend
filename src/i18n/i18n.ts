import { ref, Ref } from 'vue'
import { Locale } from 'ant-design-vue/lib/vc-picker/interface'
import dayjs from 'dayjs'

import antd_en_US from 'ant-design-vue/es/locale/en_US'
import antd_ja_JP from 'ant-design-vue/es/locale/ja_JP'
import antd_zh_TW from 'ant-design-vue/es/locale/zh_TW'
import antd_zh_CN from 'ant-design-vue/es/locale/zh_CN'
import antd_de_DE from 'ant-design-vue/es/locale/de_DE'
import antd_fr_FR from 'ant-design-vue/es/locale/fr_FR'
import antd_es_ES from 'ant-design-vue/es/locale/es_ES'
import antd_ko_KR from 'ant-design-vue/es/locale/ko_KR'
import antd_pt_BR from 'ant-design-vue/es/locale/pt_BR'
import antd_th_TH from 'ant-design-vue/es/locale/th_TH'
import antd_el_GR from 'ant-design-vue/es/locale/el_GR'
import antd_hi_IN from 'ant-design-vue/es/locale/hi_IN'
import antd_vi_VN from 'ant-design-vue/es/locale/vi_VN'

import 'dayjs/locale/en'
import 'dayjs/locale/ja'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/de'
import 'dayjs/locale/fr'
import 'dayjs/locale/es'
import 'dayjs/locale/ko'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/th'
import 'dayjs/locale/el'
import 'dayjs/locale/hi'
import 'dayjs/locale/vi'

export type SupportedLocale = 'en_US' | 'ja_JP' | 'zh_TW' | 'zh_CN' | 'fr_FR' | 'de_DE' | 'es_ES' | 'ko_KR' | 'pt_BR' | 'th_TH' | 'el_GR' | 'hi_IN' | 'vi_VN'
const SupportedLocales: SupportedLocale[] = [ 'en_US', 'fr_FR', 'de_DE', 'es_ES', 'ja_JP', 'zh_TW', 'zh_CN', 'ko_KR', 'pt_BR', 'th_TH', 'el_GR', 'hi_IN', 'vi_VN' ]

interface ObjectMap {
    [index: string]: Object
}

interface StringMap {
    [index: string]: string
}

const antdLocales: ObjectMap = {
    'en_US': antd_en_US,
    'ja_JP': antd_ja_JP,
    'zh_TW': antd_zh_TW,
    'zh_CN': antd_zh_CN,
    'de_DE': antd_de_DE,
    'fr_FR': antd_fr_FR,
    'es_ES': antd_es_ES,
    'ko_KR': antd_ko_KR,
    'pt_BR': antd_pt_BR,
    'th_TH': antd_th_TH,
    'el_GR': antd_el_GR,
    'hi_IN': antd_hi_IN,
    'vi_VN': antd_vi_VN
}

const dayJsLocales: StringMap = {
    'en_US': 'en',
    'ja_JP': 'ja',
    'zh_TW': 'zh-tw',
    'zh_CN': 'zh-cn',
    'de_DE': 'de-de',
    'fr_FR': 'fr-fr',
    'es_ES': 'es-es',
    'ko_KR': 'ko',
    'pt_BR': 'pt-br',
    'th_TH': 'th',
    'el_GR': 'el',
    'hi_IN': 'hi',
    'vi_VN': 'vi'
}

const locale: Ref<SupportedLocale> = ref('en_US');

const setLocale = async (localeString: SupportedLocale): Promise<Locale> => {
    locale.value = localeString
    dayjs.locale(dayJsLocales[localeString])
    const ret = antdLocales[localeString] as Locale
    localStorage.setItem('locale', localeString)
    return ret
}

const getLocaleName = (locale: SupportedLocale) => {
    switch (locale) {
        case 'en_US': default: return 'English'
        case 'fr_FR': return 'Français (French)'
        case 'de_DE': return 'Deutsch (German)'
        case 'es_ES': return 'Español (Spanish)'
        case 'pt_BR': return 'Português (Brasil)'
        case 'el_GR': return 'Ελληνικά (Greek)'
        case 'ja_JP': return '日本語 (Japanese)'
        case 'zh_TW': return '繁體中文 (Traditional Chinese)'
        case 'zh_CN': return '新加坡华语 (Simplified Chinese)'
        case 'ko_KR': return '한국어 (Korean)'
        case 'vi_VN': return 'Tiếng Việt (Vietnamese)'
        case 'th_TH': return 'ไทย (Thai)'
        case 'hi_IN': return 'हिन्दी (Hindi)'
    }
}

const getLocaleCodeAlias = (locale: SupportedLocale) => {
    switch (locale) {
        case 'en_US': default: return 'gb'
        case 'ja_JP': return 'jp'
        case 'zh_TW': return 'hk'
        case 'zh_CN': return 'sg'
        case 'de_DE': return 'de'
        case 'fr_FR': return 'fr'
        case 'es_ES': return 'es'
        case 'ko_KR': return 'kr'
        case 'pt_BR': return 'br'
        case 'th_TH': return 'th'
        case 'el_GR': return 'gr'
        case 'hi_IN': return 'in'
        case 'vi_VN': return 'vn'
    }
}

export {
    setLocale,
    getLocaleName,
    locale,
    SupportedLocales,
    getLocaleCodeAlias
}
