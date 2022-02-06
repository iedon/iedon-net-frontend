<script setup lang="ts">
import { Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { AuthQueryResponse, AuthRequestResponse, AuthChallengeResponse, makeRequest } from '../../common/packetHandler'
import { loggedIn, splitMessageToVNodes } from '../../common/helper'
import stepsBar from './stepsBar.vue'
import queryBox from './queryBox.vue'
import chooseBox from './chooseBox.vue'
import challengeBox from './challengeBox.vue'
import doneBox from './doneBox.vue'
import "ant-design-vue/es/modal/style/css"
import "ant-design-vue/es/message/style/css"

const ASN_MIN = 0
const ASN_MAX = 4294967295

const t = useI18n().t

const _asn = ref('0')
const currentStep: Ref<'query' | 'choose' | 'challenge' | 'done'> = ref('query')
const loading = ref(false)

const customQuery = ref('')
const customChoose = ref('')

const authQueryResp: Ref<AuthQueryResponse | null> = ref(null)
const authRequestResp: Ref<AuthRequestResponse | null> = ref(null)
const queryAsn = async (asn: number) => {
    _asn.value = '0'

    if (!asn || asn < ASN_MIN || asn > ASN_MAX) {
        message.error(`${t('pages.signIn.pleaseInput')} ${t('pages.signIn.asn')}`)
        return
    }

    try {
        authQueryResp.value = null
        loading.value = true
        const resp = await makeRequest(t, '/auth', {
            action: 'query',
            asn
        }) as AuthQueryResponse

        if (resp.availableAuthMethods.length === 0) {
            Modal.error({
                title: t('pages.signIn.signIn'),
                content: splitMessageToVNodes(t('pages.signIn.couldNotFindAuthMethod')),
            })
            return
        }

        authQueryResp.value = resp
        currentStep.value = 'choose'
        customQuery.value = `${t('pages.signIn.hi')} ${resp.person}`
        _asn.value = asn.toString()
        window.scrollTo(0, 0)

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const requestChallenge = async (selectedMethod: number) => {
    try {
        authRequestResp.value = null
        loading.value = true
        const resp = await makeRequest(t, '/auth', {
            action: 'request',
            authMethod: selectedMethod,
            authState: authQueryResp.value?.authState
        }) as AuthRequestResponse

        if (!resp.authState || !resp.authChallenge) {
            Modal.error({
                title: t('pages.signIn.signIn'),
                content: splitMessageToVNodes(t('pages.signIn.errorOccurred')),
            })
            return
        }

        authRequestResp.value = resp
        currentStep.value = 'challenge'
        customChoose.value = authQueryResp.value?.availableAuthMethods[selectedMethod].type as string
        window.scrollTo(0, 0)

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const challenge = async (data: { publicKey: string, challengeText: string }) => {
    if (data.challengeText === '') {
        message.error(`${t('pages.signIn.pleaseInput')} ${t('pages.signIn.challengeText')}`)
        return
    }
    try {
        loading.value = true

        let challengeData: string | object = ''
        if (!data.publicKey) {
            challengeData = data.challengeText;
        } else {
            challengeData = {
                publicKey: data.publicKey,
                signedMessage: data.challengeText
            }
        }

        const resp = await makeRequest(t, '/auth', {
            action: 'challenge',
            authState: authRequestResp.value?.authState,
            data: challengeData
        }) as AuthChallengeResponse

        if (!resp || !resp.authResult) {
            Modal.error({
                title: t('pages.signIn.signIn'),
                content: splitMessageToVNodes(t('pages.signIn.signInFailed')),
            })
            return
        }

        localStorage.setItem('person', authQueryResp.value?.person || '')
        localStorage.setItem('asn', _asn.value)
        loggedIn.value = true

        currentStep.value = 'done'
        message.info(`${t('pages.signIn.welcomeBack')} ${authQueryResp.value?.person}`)
        window.scrollTo(0, 0)

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <h1 class="header">{{ t('pages.signIn.signIn') }}</h1>
    <a-layout-content id="signin">
        <steps-bar class="steps" :step="currentStep" :custom-query-title="customQuery" :custom-choose-title="customChoose" :loading="loading"></steps-bar>
        <section class="box">
            <template v-if="currentStep === 'query'">
                <query-box :loading="loading" :query-asn="queryAsn"></query-box>
            </template>
            <template v-else-if="currentStep === 'choose'">
                <choose-box :prev-step="() => currentStep='query'" :loading="loading" :auth-query-resp="authQueryResp" :request-challenge="requestChallenge"></choose-box>
            </template>
            <template v-else-if="currentStep === 'challenge'">
                <challenge-box :prev-step="() => currentStep='choose'" :loading="loading" :auth-request-resp="authRequestResp" :challenge="challenge" :type="customChoose"></challenge-box>
            </template>
            <template v-else-if="currentStep === 'done'">
                <done-box></done-box>
            </template>
        </section>
    </a-layout-content>
</template>

<style scoped>
.header {
    font-size: 32px;
    letter-spacing: 0.5px;
    margin-top: 30px;
    margin-bottom: 0;
    text-align: center;
    font-weight: normal;
}
#signin {
    margin-top: 15px;
    margin-bottom: 80px;
    padding: 0 24px;
    min-height: 280px;
}
#signin:deep(.box) {
    max-width: 600px;
    margin: 30px auto;
}
#signin:deep(.steps) {
    max-width: 1000px;
    margin: 0 auto 80px auto;
}
</style>
