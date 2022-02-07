<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { UserOutlined, NodeIndexOutlined, SettingOutlined, BookOutlined, GlobalOutlined } from '@ant-design/icons-vue'
import { isAdmin } from '../../common/helper'
import MySessions from './mySessions.vue'
import MyAccount from './myAccount.vue'
import ManageSessions from './manageSessions.vue'
import ManageConfig from './manageConfig.vue'
import ManagePosts from './managePosts.vue'
import ManageNodes from './manageNodes.vue'

const t = useI18n().t
const router = useRouter()


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

</script>

<template>
    <a-layout-sider class="sider" width="200">
        <a-menu class="menu" mode="inline" v-model:selectedKeys="selectedKeys">
            <template v-if="!isAdmin">
                <a-menu-item key="mySessions">
                    <template #icon>
                        <node-index-outlined />
                    </template>
                    {{ title.mySessions }}
                </a-menu-item>
                <a-menu-item key="myAccount">
                    <template #icon>
                        <user-outlined />
                    </template>
                    {{ title.myAccount }}
                </a-menu-item>
            </template>
            <template v-else>
                <a-menu-item key="manageSessions">
                    <template #icon>
                        <node-index-outlined />
                    </template>
                    {{ title.manageSessions }}
                </a-menu-item>
                <a-menu-item key="manageNodes">
                    <template #icon>
                        <global-outlined />
                    </template>
                    {{ title.manageNodes }}
                </a-menu-item>
                <a-menu-item key="managePosts">
                    <template #icon>
                        <book-outlined />
                    </template>
                    {{ title.managePosts }}
                </a-menu-item>
                <a-menu-item key="manageConfig">
                    <template #icon>
                        <setting-outlined />
                    </template>
                    {{ title.manageConfig }}
                </a-menu-item>
                <a-menu-item key="myAccount">
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
            {{ title[selectedKeys[0]] || '' }}
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
</template>

<style scoped>
.sider {
    background-color: #fafafa;
    min-height: 500px;
}
.menu {
    height: 100%;
}
.content {
    padding: 0 30px;
    min-height: 500px;
}
.content .header {
    font-size: 32px;
    letter-spacing: 0.5px;
    margin-top: 30px;
    text-align: center;
    font-weight: normal;
}
</style>
