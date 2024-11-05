<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { UserOutlined, HomeOutlined, LoginOutlined, GlobalOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { locale, setLocale, SupportedLocales, getLocaleName, getLocaleCodeAlias } from '../i18n/i18n'
import { loggedIn, themeName } from '../common/helper'
import config from "../config"
//@ts-ignore
import md5 from 'md5'
import { message } from 'ant-design-vue'

const t = useI18n().t

const selectedKeys = ref<string[]>(['home'])

const router = useRouter()
const goHome = () => {
    router.replace({ path: '/' })
    window.scrollTo(0, 0)
}
const openNodesPage = () => {
    router.replace({ path: '/nodes' })
    window.scrollTo(0, 0)
}
const openSigninPage = () => {
    router.replace({ path: '/signin' })
    window.scrollTo(0, 0)
}
const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('asn')
    localStorage.removeItem('person')
    localStorage.removeItem('email')
    loggedIn.value = false
    window.location.href = '/'
    window.scrollTo(0, 0)
}

const setHeaderFocus = () => {
    const key = router.currentRoute.value.path.split('/')[1] || router.currentRoute.value.path
    switch (key) {
        case 'home': case '/': case 'post': selectedKeys.value[0] = 'home'; break;
        case 'nodes': selectedKeys.value[0] = 'nodes'; break;
        default: selectedKeys.value[0] = key; break;
    }
}

const stopWatchPagePath = watch(() => router.currentRoute.value.path, (newValue: string) => setHeaderFocus())
const onSelect = (_: { item: HTMLElement, key: string, selectedKeys: string[] }) => setHeaderFocus()

const asn = ref('')
const person = ref('')
const email = ref('')
const getGravatar = (_email: string) => `${config.gravatarUrlPrefix}${md5(_email.trim().toLocaleLowerCase())}`
const stopWatchLoggedIn = watch(() => loggedIn.value, (newValue: boolean, oldValue: boolean) => {
    if (newValue) {
        asn.value = localStorage.getItem('asn') || ''
        person.value = localStorage.getItem('person') || ''
        email.value = localStorage.getItem('email') || ''
        if (email.value.length !== 0) email.value = getGravatar(email.value)
    }
    if (oldValue && !newValue) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
    }
})

asn.value = localStorage.getItem('asn') || ''
person.value = localStorage.getItem('person') || ''
email.value = localStorage.getItem('email') || ''
if (email.value.length !== 0) email.value = getGravatar(email.value)
if (asn.value && person.value && localStorage.getItem('token')) loggedIn.value = true

onUnmounted(() => {
    stopWatchPagePath()
    stopWatchLoggedIn()
})

const redirectToManagePage = () => {
    router.replace({
        path: '/manage'
    })
}

const login = () => {
    if (!loggedIn.value) {
        openSigninPage()
        return
    }
    redirectToManagePage()
}
</script>

<template>
    <a-layout-header id="header" :class="themeName">
        <img class="logo" src="../assets/logo.svg" @click="goHome" alt="Logo" />
        <a-menu :class="`menu ${themeName}`" @select="onSelect" :theme="themeName" mode="horizontal" v-model:selectedKeys="selectedKeys">
            <a-menu-item key="home" @click="goHome">
                <template #icon>
                    <home-outlined />
                </template>
                {{ t('header.home') }}
            </a-menu-item>
            <a-menu-item key="nodes" @click="openNodesPage">
                <template #icon>
                    <global-outlined />
                </template>
                {{ t('header.nodes') }}
            </a-menu-item>
            <a-sub-menu>
                <template #icon>
                    <img :src="`${config.root}flags/${getLocaleCodeAlias(locale)}.svg`" width="16" class="flag" />
                </template>
                <template #title>
                    {{ getLocaleName(locale) }}
                </template>
                <a-menu-item-group title="Choose language of your region...">
                    <a-menu-item v-for="_locale in SupportedLocales" :key="`lang_${_locale}`" @click="setLocale(_locale)">
                        <template #icon>
                            <img :src="`${config.root}flags/${getLocaleCodeAlias(_locale)}.svg`" width="16" class="flag" />
                        </template>
                        {{ getLocaleName(_locale) }}
                    </a-menu-item>
                </a-menu-item-group>
            </a-sub-menu>
            <a-menu-item key="login" @click="login">
                <div class="signBox">
                    <a-button v-if="!loggedIn" type="dashed">
                        <template #icon>
                            <login-outlined />
                        </template>
                        {{ t('header.signIn') }}
                    </a-button>
                    <template v-else>
                        <a-avatar class="avatar" v-if="email.length !== 0" :src="email"></a-avatar>
                        <a-avatar class="avatar" v-else-if="person.substring(0, 1) || asn.substring(asn.length - 4 - 1)">{{ person.substring(0, 1) || asn.substring(asn.length - 4 - 1) }}</a-avatar>
                        <a-avatar class="avatar" v-else>
                            <template #icon>
                                <user-outlined />
                            </template>
                        </a-avatar>
                        <span class="name">{{ person || asn }}</span>
                        <a-popconfirm @click="(event: Event) => event.stopPropagation()" placement="bottomRight" :title="t('header.signOutConfirm')" @confirm="signOut">
                            <a-button type="dashed">
                                <template #icon>
                                    <logout-outlined />
                                </template>
                                {{ t('header.signOut') }}
                            </a-button>
                        </a-popconfirm>
                    </template>
                </div>
            </a-menu-item>
        </a-menu>
    </a-layout-header>
</template>

<style scoped>
#header {
    position: fixed;
    width: 100%;
    z-index: 100;
    opacity: 0.95;
    height: 64px;
    display: flex;
}
#header.light {
    background-color: #fff;
    box-shadow: 0 2px 8px #f0f1f2;
}
#header.dark {
    background-color: #111;
    box-shadow: 0 2px 8px #161616;
}
.menu.dark {
    background-color: #111;
}
@media (min-width: 0px) and (max-width: 992px /* lg */) {
  #header {
    padding: 0 15px !important;
  }
  #header .logo {
    width: 80px !important;
    margin-right: 0px !important;
  }
  #header:deep(.menu) {
    max-width: calc(100% - 80px) !important; /* 80px width of logo */
  }
}
#header .logo {
    width: 100px;
    margin-right: 30px;
    cursor: pointer;
}
#header:deep(.menu) {
    flex: 1 0 auto;
    max-width: calc(100% - 130px); /* 100px width + 30px margin-right of logo */
    border-bottom: none;
    justify-content: right;
}
.signBox {
    margin: 0 auto;
}
.signBox .avatar {
    background-color: #f56a00;
    cursor: pointer;
}
.signBox span.name {
    margin: auto 10px;
}
.flag {
    vertical-align: sub;
}
</style>
