import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
// import Antd from 'ant-design-vue' /* We're using on demand import in vite */

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
app.use(i18n).use(router)/* .use(Antd)  // We're using on demand import in vite*/.mount('#app')
