<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale } from 'ant-design-vue/lib/vc-picker/interface'
import { theme as antTheme } from 'ant-design-vue'
import { locale, setLocale, SupportedLocale, SupportedLocales} from './i18n/i18n'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutContent from './components/LayoutContent.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import ThemeTrigger from './components/ThemeTrigger.vue'
import { useHeartBeat, applyTheme, themeName } from './common/helper'

const vueI18n = useI18n()
const t = vueI18n.t

const stopWatchLocale = watch((): SupportedLocale => locale.value, async (newLocale: SupportedLocale) => {
  vueI18n.locale.value = newLocale
  antdLocale.value = await setLocale(newLocale)
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
    const browserPreferredLocale = (navigator.languages.find(lang => SupportedLocales.some(supported => lang.replaceAll('-', '_') === supported)) || 'en_US').replaceAll('-', '_')
    antdLocale.value = await setLocale(browserPreferredLocale as SupportedLocale)
  }
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
  <a-config-provider :locale="antdLocale"
    :theme="{
      algorithm: themeName === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
    }"
  >
    <a-layout>
      <layout-header></layout-header>
      <layout-content></layout-content>
      <layout-footer></layout-footer>
      <a-back-top />
      <theme-trigger :trigger="themeTrigger" @click="changeTheme" />
    </a-layout>
  </a-config-provider>
</template>

<style>
html, #app {
  width: 100%;
  height: 100%;
  user-select: none;
}
body {
  margin: 0;
}
</style>
