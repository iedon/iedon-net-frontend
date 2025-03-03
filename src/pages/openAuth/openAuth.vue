<script setup lang="ts">
import { h, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { AuthOpenResponse, makeRequest } from '../../common/packetHandler'
import { loggedIn, splitMessageToVNodes } from '../../common/helper'

const t = useI18n().t
const router = useRouter()
const route = useRoute()

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '72px',
    },
    spin: true,
});

onMounted(async () => {
    window.scrollTo(0, 0)
    await router.isReady()

    let type = route.query.type
    if (!type) {
        // Compatibility mode for kioubit
        const token = route.query.token
        if (token === 'kioubit.dn42') type = 'kioubit';
    }
    if (!type) return signInFailed()

    if (type === 'kioubit') kioubit()
})

const signInFailed = () => {
    Modal.error({
        centered: true,
        title: t('pages.signIn.signIn'),
        content: splitMessageToVNodes(t('pages.signIn.signInFailed')),
    })
    router.replace({ path: '/signin' })
}

const kioubit = async () => {
    try {
        const { params, signature } = route.query
        if (!params || !signature) return signInFailed()
        const resp = await makeRequest(t, '/auth', {
            action: 'open',
            type: "kioubit",
            data: {
                params,
                signature
            }
        })
        if (resp.success && resp.response) {
            const data = resp.response as AuthOpenResponse
            if (!data || !data.authResult) return signInFailed()

            localStorage.setItem('token', data.token)
            localStorage.setItem('asn', data.asn.toString())
            localStorage.setItem('lastAsn', data.asn.toString())

            if (data.person) localStorage.setItem('person', data.person)
            if (data.email) localStorage.setItem('email', data.email)

            loggedIn.value = true

            message.info(`${t('pages.signIn.welcomeBack')} ${data.person || data.asn}`)
            router.replace({ path: '/' })
            window.scrollTo(0, 0)
        }
    } catch (error) {
        console.error(error)
    }
}

</script>

<template>
    <section>
        <h1 class="header">{{ t('pages.signIn.signIn') }}</h1>
        <a-layout-content id="openAuth">
            <div class="loading">
                <a-spin :indicator="indicator" />
            </div>
        </a-layout-content>
    </section>
</template>

<style scoped>
.header {
    font-size: 28px;
    letter-spacing: 0.5px;
    margin-top: 30px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: normal;
}

#openAuth {
    margin-top: 15px;
    margin-bottom: 80px;
    min-height: 280px;
}

.loading {
    margin: 200px auto;
    text-align: center;
}
</style>
