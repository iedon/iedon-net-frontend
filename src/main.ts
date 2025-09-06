import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
// Remove full Antd import for better tree-shaking
// import Antd from 'ant-design-vue'

import router from './router'
import App from './App.vue'

import translation from './i18n/export'

const i18n = createI18n({
    legacy: false,
    locale: 'en_US',
    fallbackLocale: 'en_US',
    messages: translation,
})

const app = createApp(App)
app.use(i18n).use(router).mount('#app')
