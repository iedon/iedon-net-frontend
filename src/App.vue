<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale } from 'ant-design-vue/lib/vc-picker/interface'
import { theme as antTheme } from 'ant-design-vue'
import { locale, setLocale, SupportedLocale, SupportedLocales } from './i18n/i18n'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutContent from './components/LayoutContent.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import { useHeartBeat, applyTheme, themeName } from './common/helper'
import { BulbFilled, BulbOutlined } from '@ant-design/icons-vue'
import { resolveAcceptLanguage } from 'resolve-accept-language'

const vueI18n = useI18n()
const t = vueI18n.t

// Function to update meta tags based on current locale
const updateMetaTags = () => {
    try {
        const description = t('meta.description')
        const keywords = t('meta.keywords')
        const ogTitle = t('meta.ogTitle')
        const ogSiteName = t('meta.ogSiteName')

        const html = document.querySelector('html')
        html?.setAttribute('lang', locale.value.replace('_', '-'))

        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) {
            metaDesc.setAttribute('content', description)
        } else {
            metaDesc = document.createElement('meta')
            metaDesc.setAttribute('name', 'description')
            metaDesc.setAttribute('content', description)
            document.head.appendChild(metaDesc)
        }

        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]')
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords)
        } else {
            metaKeywords = document.createElement('meta')
            metaKeywords.setAttribute('name', 'keywords')
            metaKeywords.setAttribute('content', keywords)
            document.head.appendChild(metaKeywords)
        }

        // Update og:title
        let ogTitleMeta = document.querySelector('meta[property="og:title"]')
        if (ogTitleMeta) {
            ogTitleMeta.setAttribute('content', ogTitle)
        } else {
            ogTitleMeta = document.createElement('meta')
            ogTitleMeta.setAttribute('property', 'og:title')
            ogTitleMeta.setAttribute('content', ogTitle)
            document.head.appendChild(ogTitleMeta)
        }

        // Update og:description
        let ogDescMeta = document.querySelector('meta[property="og:description"]')
        if (ogDescMeta) {
            ogDescMeta.setAttribute('content', description)
        } else {
            ogDescMeta = document.createElement('meta')
            ogDescMeta.setAttribute('property', 'og:description')
            ogDescMeta.setAttribute('content', description)
            document.head.appendChild(ogDescMeta)
        }

        // Update og:site_name
        let ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]')
        if (ogSiteNameMeta) {
            ogSiteNameMeta.setAttribute('content', ogSiteName)
        } else {
            ogSiteNameMeta = document.createElement('meta')
            ogSiteNameMeta.setAttribute('property', 'og:site_name')
            ogSiteNameMeta.setAttribute('content', ogSiteName)
            document.head.appendChild(ogSiteNameMeta)
        }
    } catch (error) {
        console.error('Failed to update meta tags:', error)
    }
}

const stopWatchLocale = watch((): SupportedLocale => locale.value, async (newLocale: SupportedLocale) => {
    vueI18n.locale.value = newLocale
    antdLocale.value = await setLocale(newLocale)
    // Update meta tags when locale changes
    updateMetaTags()
})

let stopHeartBeat: (() => void) | null = null
const antdLocale: Ref<Locale | null> = ref(null)

let matchMedia: MediaQueryList | undefined = undefined
const themeChangeHandler = (event: MediaQueryListEvent) => {
    applyTheme(event.matches ? "dark" : "light")
}
onMounted(async () => {
    try {
        matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
        matchMedia.addEventListener('change', themeChangeHandler)
        applyTheme(matchMedia.matches ? 'dark' : 'light')
    } catch (error) {
        applyTheme()
        console.warn(error)
    }
    const currentLocale = localStorage.getItem('locale')
    if (currentLocale && SupportedLocales.some(supported => currentLocale === supported)) {
        antdLocale.value = await setLocale(currentLocale as SupportedLocale)
    } else {
        try {
            const locale = resolveAcceptLanguage(navigator.language, SupportedLocales.map(l => l.replace('_', '-')), 'en-US', { returnMatchType: false });
            antdLocale.value = await setLocale(locale.replace('-', '_') as SupportedLocale)
        } catch (error) {
            console.warn('Failed to resolve locale from navigator.languages, defaulting to en-US', error)
            antdLocale.value = await setLocale('en_US')
        }
    }
    updateMetaTags()
    stopHeartBeat = useHeartBeat(t)
})

onUnmounted(() => {
    if (stopHeartBeat) stopHeartBeat()
    stopWatchLocale()
    if (matchMedia !== undefined) {
        matchMedia.removeEventListener('change', themeChangeHandler)
        matchMedia = undefined
    }
})

const themeTrigger = computed(() => themeName.value === 'light')

const changeTheme = () => {
    applyTheme(themeTrigger.value ? 'dark' : 'light')
}
</script>

<template>
    <a-config-provider :locale="antdLocale" :theme="{
        algorithm: themeName === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
    }">
        <a-layout>
            <layout-header></layout-header>
            <layout-content></layout-content>
            <layout-footer></layout-footer>
            <a-float-button-group shape="circle" :style="{ right: '24px' }">
                <a-float-button @click="changeTheme">
                    <template #icon>
                        <bulb-outlined v-if="themeTrigger" />
                        <bulb-filled v-else />
                    </template>
                </a-float-button>
                <a-back-top :visibility-height="0" />
            </a-float-button-group>
        </a-layout>
    </a-config-provider>
</template>

<style>
html,
#app {
    width: 100%;
    height: 100%;
    user-select: none;
    scroll-behavior: smooth;
}

body {
    margin: 0;
}
</style>
