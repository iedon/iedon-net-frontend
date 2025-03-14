<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserOutlined, NodeIndexOutlined, SettingOutlined, BookOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import { isAdmin, themeName, VAR_SIZE_LG } from '../../common/helper'
import MenuTrigger from '../../components/MenuTrigger.vue'
import MySessions from './mySessions.vue'
import MyAccount from './myAccount.vue'
import ManageSessions from './manageSessions.vue'
import ManageConfig from './manageConfig.vue'
import ManagePosts from './managePosts.vue'
import ManageNodes from './manageNodes.vue'

const t = useI18n().t

const selectedKeys: Ref<string[]> = ref([ 'mySessions' ])

const title = {
    mySessions: t('pages.manage.mySessions'),
    myAccount: t('pages.manage.myAccount'),
    manageSessions: t('pages.manage.manageSessions'),
    managePosts: t('pages.manage.managePosts'),
    manageConfig: t('pages.manage.manageConfig'),
    manageNodes: t('pages.manage.manageNodes'),
}

onMounted(async () => {
    selectedKeys.value[0] = isAdmin.value ? 'manageSessions' : 'mySessions'
})

const collapsed: Ref<boolean> =  ref(false)
const toggleMenu = () => {
    collapsed.value = !collapsed.value
    window.scrollTo(0, 0)
}
const backToTop = () => {
    window.scrollTo(0, 0)
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (width < VAR_SIZE_LG) {
        collapsed.value = true
    }
}
</script>

<template>
    <section id="wrapper">
        <a-layout-sider :class="`sider ${themeName}`" width="200" collapsible v-model:collapsed="collapsed" :trigger="null" breakpoint="lg" :collapsedWidth="40" v-show="!collapsed">
            <a-menu class="menu" mode="inline" v-model:selectedKeys="selectedKeys">
                <template v-if="!isAdmin">
                    <a-menu-item key="mySessions" @click="backToTop()">
                        <template #icon>
                            <node-index-outlined />
                        </template>
                        {{ title.mySessions }}
                    </a-menu-item>
                    <a-menu-item key="myAccount" @click="backToTop()">
                        <template #icon>
                            <user-outlined />
                        </template>
                        {{ title.myAccount }}
                    </a-menu-item>
                </template>
                <template v-else>
                    <a-menu-item key="manageSessions" @click="backToTop()">
                        <template #icon>
                            <node-index-outlined />
                        </template>
                        {{ title.manageSessions }}
                    </a-menu-item>
                    <a-menu-item key="manageNodes" @click="backToTop()">
                        <template #icon>
                            <global-outlined />
                        </template>
                        {{ title.manageNodes }}
                    </a-menu-item>
                    <a-menu-item key="managePosts" @click="backToTop()">
                        <template #icon>
                            <book-outlined />
                        </template>
                        {{ title.managePosts }}
                    </a-menu-item>
                    <a-menu-item key="manageConfig" @click="backToTop()">
                        <template #icon>
                            <setting-outlined />
                        </template>
                        {{ title.manageConfig }}
                    </a-menu-item>
                    <a-menu-item key="myAccount" @click="backToTop()">
                        <template #icon>
                            <user-outlined />
                        </template>
                        {{ title.myAccount }}
                    </a-menu-item>
                </template>
            </a-menu>
        </a-layout-sider>
        <a-layout-content class="content">
            <h1 class="header">
                {{ title[selectedKeys[0] as keyof typeof title] || '' }}
            </h1>
            <a-divider dashed></a-divider>
            <template v-if="!isAdmin">
                <my-sessions v-if="selectedKeys[0] === 'mySessions'"></my-sessions>
                <my-account v-else-if="selectedKeys[0] === 'myAccount'"></my-account>
            </template>
            <template v-else>
                <manage-sessions v-if="selectedKeys[0] === 'manageSessions'"></manage-sessions>
                <manage-config v-if="selectedKeys[0] === 'manageConfig'"></manage-config>
                <manage-posts v-if="selectedKeys[0] === 'managePosts'"></manage-posts>
                <manage-nodes v-if="selectedKeys[0] === 'manageNodes'"></manage-nodes>
                <my-account v-else-if="selectedKeys[0] === 'myAccount'"></my-account>
            </template>
        </a-layout-content>
        <menu-trigger :trigger="collapsed" @click="toggleMenu" />
    </section>
</template>

<style scoped>
#wrapper {
    width: 100%;
    display: flex;
}
.sider {
    background-color: #fafafa;
    min-height: 500px;
}
.sider.light {
    background-color: #fafafa;
}
.sider.dark {
    background-color: #1d1d1d;
}
.menu {
    height: 100%;
    border-right: none;
}
.content {
    padding: 0 30px;
    min-height: 500px;
    overflow: hidden;
}
.content .header {
    font-size: 28px;
    letter-spacing: 0.5px;
    text-align: center;
    font-weight: normal;
}
</style>
