<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { SendOutlined, UserOutlined } from '@ant-design/icons-vue'
import { loggedIn, themeName } from '../../common/helper'
import { makeRequest, SetPasswordResponse } from '../../common/packetHandler'
import config from "../../config"

//@ts-ignore
import md5 from 'md5'

const t = useI18n().t
const router = useRouter()

const loading = ref(false)
const asn = ref('')
const person = ref('')
const email = ref('')

const getGravatar = (_email: string) => `${config.gravatarUrlPrefix}${md5(_email.trim().toLocaleLowerCase())}`

onMounted(async () => {
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }
    asn.value = localStorage.getItem('asn') || ''
    person.value = localStorage.getItem('person') || ''
    email.value = localStorage.getItem('email') || ''
    if (email.value.length !== 0) email.value = getGravatar(email.value)
})

const setPasswordForm = ref({
    password: '',
    confirmPassword: '',
})

const setPassword = async () => {
    if (setPasswordForm.value.password !== setPasswordForm.value.confirmPassword) {
        Modal.error({
            centered: true,
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
        })
        if (resp.success && resp.response) {
            const data = resp.response as SetPasswordResponse
            if (data && data.success) {
                message.success(t('pages.manage.account.successSetPassword'))
                return
            }
        }

        Modal.error({
            centered: true,
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
        <div class="hint">
            <a-alert
                :message="[h('p', t('pages.manage.account.hint1')), h('p', t('pages.manage.account.hint2')), h('p', t('pages.manage.account.hint3'))]"
                type="info" />
        </div>
        <div class="user-info">
            <div class="avatar-section">
                <a-avatar class="avatar" size="large" v-if="email.length !== 0" :src="email"></a-avatar>
                <a-avatar class="avatar" size="large"
                    v-else-if="person.substring(0, 1) || asn.substring(asn.length - 4 - 1)">{{ person.substring(0, 1) ||
                        asn.substring(asn.length - 4 - 1) }}</a-avatar>
                <a-avatar class="avatar" size="large" v-else>
                    <template #icon>
                        <user-outlined />
                    </template>
                </a-avatar>
                <div class="user-details">
                    <div class="user-name">{{ person || asn }}</div>
                    <div class="user-asn">{{ asn }}</div>
                </div>
            </div>
        </div>
        <a-form :model="setPasswordForm" class="setPasswordForm">
            <a-form-item style="display:none">
                <input type="text" name="username" :value="asn" autocomplete="username" />
            </a-form-item>
            <a-form-item name="password" :label="t('pages.manage.account.password')">
                <a-input-password autocomplete="new-password" v-model:value="setPasswordForm.password"
                    :placeholder="t('pages.manage.account.password')" />
            </a-form-item>
            <a-form-item name="confirmPassword" :label="t('pages.manage.account.confirmPassword')">
                <a-input-password autocomplete="new-password" v-model:value="setPasswordForm.confirmPassword"
                    :placeholder="t('pages.manage.account.confirmPassword')" />
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

.hint {
    max-width: 500px;
    margin: 0 auto;
    margin-bottom: 20px;
}

.hint:deep(.ant-alert-message) p:first-child {
    margin-top: auto;
}

.hint:deep(.ant-alert-message) p:last-child {
    margin-bottom: auto;
}

.user-info {
    max-width: 500px;
    margin: 0 auto;
    margin-bottom: 30px;
}

.avatar-section {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Light theme (default) */
.avatar-section {
    background: #fafafa;
    border-color: #f0f0f0;
}

/* Dark theme support */
.dark .avatar-section {
    background: #1f1f1f;
    border-color: #434343;
}

.avatar {
    margin-right: 16px;
}

.user-details {
    flex: 1;
}

.user-name {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
    transition: color 0.3s ease;
}

/* Light theme (default) */
.user-name {
    color: #262626;
}

/* Dark theme support */
.dark .user-name {
    color: #ffffff;
}

.user-asn {
    font-size: 14px;
    transition: color 0.3s ease;
}

/* Light theme (default) */
.user-asn {
    color: #8c8c8c;
}

/* Dark theme support */
.dark .user-asn {
    color: #bfbfbf;
}
</style>
