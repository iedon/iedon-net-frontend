<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { SendOutlined } from '@ant-design/icons-vue'
import { loggedIn } from '../../common/helper'
import { makeRequest, SetPasswordResponse } from '../../common/packetHandler'
import "ant-design-vue/es/modal/style/css"
import "ant-design-vue/es/message/style/css"

const t = useI18n().t
const router = useRouter()

const loading = ref(false)
const asn = ref('')

onMounted(async () => {
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }
    asn.value = localStorage.getItem('asn') || ''
})

const setPasswordForm = ref({
    password: '',
    confirmPassword: '',
})

const setPassword = async () => {
    if (setPasswordForm.value.password !== setPasswordForm.value.confirmPassword) {
        Modal.error({
            title: t('pages.manage.account.setPassword'),
            content: t('pages.peering.inputValid'),
        })
        return
    }
    try {
        loading.value = true

        const resp = await makeRequest(t, '/settings', {
            action: 'password',
            password: setPasswordForm.value.password
        }) as SetPasswordResponse

        if (resp.success) {
            message.success(t('pages.manage.account.successSetPassword'))
            return
        }

        Modal.error({
            title: t('pages.manage.account.setPassword'),
            content: t('pages.signIn.errorOccurred'),
        })

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <a-spin :spinning="loading">
        <h2>{{ t('pages.manage.account.setYourPassword') }}</h2>
        <a-form :model="setPasswordForm" class="setPasswordForm">
            <a-form-item style="display:none">
                <input type="text" name="username" :value="asn" autocomplete="username" />
            </a-form-item>
            <a-form-item name="password" :label="t('pages.manage.account.password')">
                <a-input-password autocomplete="new-password" v-model:value="setPasswordForm.password" :placeholder="t('pages.manage.account.password')" />
            </a-form-item>
            <a-form-item name="confirmPassword" :label="t('pages.manage.account.confirmPassword')">
                <a-input-password autocomplete="new-password" v-model:value="setPasswordForm.confirmPassword" :placeholder="t('pages.manage.account.confirmPassword')" />
            </a-form-item>
            <br />
            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button type="primary" @click="setPassword">
                    <template #icon>
                        <send-outlined />
                    </template>
                    {{ t('pages.manage.account.setPassword') }}
                </a-button>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<style scoped>
.setPasswordForm {
    max-width: 500px;
    margin: 0 auto;
}
</style>
