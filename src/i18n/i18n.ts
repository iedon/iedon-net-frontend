import { ref, Ref } from 'vue'
import { Locale } from 'ant-design-vue/lib/vc-picker/interface'
import dayjs from 'dayjs'

import antd_en_US from 'ant-design-vue/es/locale/en_US'
import antd_ja_JP from 'ant-design-vue/es/locale/ja_JP'
import antd_zh_TW from 'ant-design-vue/es/locale/zh_TW'
import antd_zh_CN from 'ant-design-vue/es/locale/zh_CN'
import antd_de_DE from 'ant-design-vue/es/locale/de_DE'

import 'dayjs/locale/en'
import 'dayjs/locale/ja'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/de'

type SupportedLocale = 'en_US' | 'ja_JP' | 'zh_TW' | 'zh_CN' | 'de_DE'
const SupportedLocales: SupportedLocale[] = [ 'en_US', 'de_DE', 'ja_JP', 'zh_TW', 'zh_CN' ]

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
    'de_DE': antd_de_DE
}

const dayJsLocales: StringMap = {
    'en_US': 'en',
    'ja_JP': 'ja',
    'zh_TW': 'zh-tw',
    'zh_CN': 'zh-cn',
    'de_DE': 'de-de'
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
        case 'de_DE': return 'Deutsch (German)'
        case 'ja_JP': return '日本語 (Japanese)'
        case 'zh_TW': return '繁體中文 (Traditional Chinese)'
        case 'zh_CN': return '简体中文 (Simplified Chinese)'
    }
}

const getLocaleCodeAlias = (locale: SupportedLocale) => {
    switch (locale) {
        case 'en_US': default: return 'us'
        case 'ja_JP': return 'jp'
        case 'zh_TW': return 'hk'
        case 'zh_CN': return 'cn'
        case 'de_DE': return 'de'
    }
}

export {
    setLocale,
    getLocaleName,
    locale,
    SupportedLocale,
    SupportedLocales,
    getLocaleCodeAlias
}
