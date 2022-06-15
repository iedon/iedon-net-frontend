<script setup lang="ts">
import { h, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { UserOutlined, HomeOutlined, SafetyCertificateOutlined, LoginOutlined, GlobalOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { locale, setLocale, SupportedLocales, getLocaleName, getLocaleCodeAlias } from '../i18n/i18n'
import { loggedIn, splitMessageToVNodes } from '../common/helper'
import "ant-design-vue/es/modal/style/css"

const t = useI18n().t

const showPrivacyPolicy = () => {
    Modal.info({
        title: t('header.privacy'),
        content: h('div', {}, splitMessageToVNodes(t('header.privacyPolicyContent')))
    })
}

const selectedKeys = ref<string[]>(['home'])

const router = useRouter()
const goHome = () => { router.replace({ path: '/' }) }
const openNodesPage = () => { router.replace({ path: '/nodes' }) }
const openSigninPage = () => { router.replace({ path: '/signin' }) }
const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('asn')
    localStorage.removeItem('person')
    loggedIn.value = false
    router.replace({ path: '/' })
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
const onSelect = (data: { item: HTMLElement, key: string, selectedKeys: string[] }) => setHeaderFocus()

const asn = ref('')
const person = ref('')
const stopWatchLoggedIn = watch(() => loggedIn.value, (newValue: boolean, oldValue: boolean) => {
    if (newValue) {
        asn.value = localStorage.getItem('asn') || ''
        person.value = localStorage.getItem('person') || ''
    }
    if (oldValue && !newValue) {
        router.replace({
            path: '/'
        })
    }
})

asn.value = localStorage.getItem('asn') || ''
person.value = localStorage.getItem('person') || ''
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
</script>

<template>
    <a-layout-header id="header">
        <img class="logo" src="../assets/logo.svg" alt="Logo" />
        <a-menu class="menu" @select="onSelect" theme="light" mode="horizontal" v-model:selectedKeys="selectedKeys">
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
            <a-menu-item @click="showPrivacyPolicy">
                <template #icon>
                    <safety-certificate-outlined />
                </template>
                {{ t('header.privacy') }}
            </a-menu-item>
            <a-sub-menu>
                <template #icon>
                    <img :src="`flags/${getLocaleCodeAlias(locale)}.svg`" width="16" class="flag" />
                </template>
                <template #title>
                    {{ getLocaleName(locale) }}
                </template>
                <a-menu-item-group title="Choose language of your region...">
                    <a-menu-item v-for="_locale in SupportedLocales" :key="`lang_${_locale}`" @click="setLocale(_locale)">
                        <template #icon>
                            <img :src="`flags/${getLocaleCodeAlias(_locale)}.svg`" width="16" class="flag" />
                        </template>
                        {{ getLocaleName(_locale) }}
                    </a-menu-item>
                </a-menu-item-group>
            </a-sub-menu>
        </a-menu>
        <div class="signBox">
            <a-button v-if="!loggedIn" type="dashed" @click="openSigninPage">
                <template #icon>
                    <login-outlined />
                </template>
                {{ t('header.signIn') }}
            </a-button>
            <template v-else>
                <a-avatar class="avatar" @click="redirectToManagePage" v-if="person.substring(0, 1) || asn.substring(asn.length - 4 - 1)">{{ person.substring(0, 1) || asn.substring(asn.length - 4 - 1) }}</a-avatar>
                <a-avatar class="avatar" @click="redirectToManagePage" v-else>
                    <template #icon>
                        <user-outlined />
                    </template>
                </a-avatar>
                <a-button type="text" @click="redirectToManagePage">{{ person || asn }}</a-button>
                <a-popconfirm placement="bottomRight" :title="t('header.signOutConfirm')" @confirm="signOut">
                    <a-button type="dashed">
                        <template #icon>
                            <logout-outlined />
                        </template>
                        {{ t('header.signOut') }}
                    </a-button>
                </a-popconfirm>
            </template>
        </div>
    </a-layout-header>
</template>

<style scoped>
#header {
    position: fixed;
    width: 100%;
    z-index: 100;
    background-color: #ffffff;
    opacity: 0.95;
    box-shadow: 0 2px 8px #f0f1f2;
    height: 64px;
    display: flex;
}
#header .logo {
    width: 100px;
    margin-right: 30px;
}
#header:deep(.menu) {
    flex: 1 0 auto;
    border-bottom: none;
}
.signBox {
    margin: 0 auto;
}
.signBox .avatar {
    background-color: #f56a00;
    cursor: pointer;
}
.flag {
    vertical-align: sub;
}
</style>
