<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale } from 'ant-design-vue/lib/vc-picker/interface'
import { locale, setLocale, SupportedLocale, SupportedLocales} from './i18n/i18n'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutContent from './components/LayoutContent.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import ThemeTrigger from './components/ThemeTrigger.vue'
import { useHeartBeat, applyTheme, theme } from './common/helper'

const vueI18n = useI18n()
const t = vueI18n.t

const stopWatchLocale = watch((): SupportedLocale => locale.value, async (newLocale: SupportedLocale) => {
  vueI18n.locale.value = newLocale
  antdLocale.value = await setLocale(newLocale)
})

let stopHeartBeat: (() => void) | null = null
const antdLocale: Ref<Locale | null> = ref(null)
onMounted(async () => {
  try {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
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
})

const themeTrigger = computed(() => theme.value === 'light')

const changeTheme = () => {
  applyTheme(themeTrigger.value ? 'dark' : 'light')
}
</script>

<template>
  <a-config-provider :locale="antdLocale">
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
</style>
