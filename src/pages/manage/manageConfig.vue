<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { SendOutlined } from '@ant-design/icons-vue'
import { ASN_MAX, ASN_MIN, loggedIn, nullOrEmpty, refreshSiteConfig, siteConfig } from '../../common/helper'
import { makeRequest } from '../../common/packetHandler'

const t = useI18n().t
const router = useRouter()

const loading = ref(false)
const configForm = ref({ ...siteConfig.value })

onMounted(async () => {
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }
})

const saveConfig = async () => {
    if (nullOrEmpty(configForm.value.netAsn) || nullOrEmpty(configForm.value.netName) ||
        isNaN(Number(configForm.value.netAsn)) || Number(configForm.value.netAsn) < ASN_MIN || Number(configForm.value.netAsn) > ASN_MAX) {
        Modal.error({
            centered: true,
            title: t('pages.manage.config.changeConfig'),
            content: t('pages.peering.inputValid'),
        })
        return
    }
    try {
        loading.value = true
        await makeRequest(t, '/admin', {
            action: 'config',
            netAsn: configForm.value.netAsn,
            netName: configForm.value.netName,
            netDesc: configForm.value.netDesc || null,
            footerText: configForm.value.footerText || null,
            maintenanceText: configForm.value.maintenanceText || null
        })
    } catch (error) {
        console.error(error)
    } finally {
        await refreshSiteConfig(t)
        loading.value = false
    }
}

</script>

<template>
    <a-spin :spinning="loading">
        <h2>{{ t('pages.manage.config.changeConfig') }}</h2>
        <a-form :model="configForm" class="configForm">
            <a-form-item name="netAsn" :label="t('pages.manage.config.netAsn')">
                <a-input v-model:value="configForm.netAsn" type="number" addon-before="AS" placeholder="424242〇〇〇〇" />
            </a-form-item>
            <a-form-item name="netName" :label="t('pages.manage.config.netName')">
                <a-input v-model:value="configForm.netName" :placeholder="t('pages.manage.config.netName')" />
            </a-form-item>
            <a-form-item name="netDesc" :label="t('pages.manage.config.netDesc')">
                <a-textarea auto-size v-model:value="configForm.netDesc" :placeholder="t('pages.manage.config.netDesc')" />
            </a-form-item>
            <a-form-item name="footerText" :label="t('pages.manage.config.footerText')">
                <a-textarea auto-size v-model:value="configForm.footerText" :placeholder="t('pages.manage.config.footerText')" />
            </a-form-item>
            <a-form-item name="maintenanceText" :label="t('pages.manage.config.maintenanceText')">
                <a-textarea auto-size v-model:value="configForm.maintenanceText" :placeholder="t('pages.manage.config.maintenanceText')" />
            </a-form-item>
            <br />
            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button type="primary" @click="saveConfig">
                    <template #icon>
                        <send-outlined />
                    </template>
                    {{ t('pages.manage.config.save') }}
                </a-button>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<style scoped>
.configForm {
    max-width: 500px;
    margin: 0 auto 80px auto;
}
</style>
