<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { AuthQueryResponse, AuthRequestResponse, AuthChallengeResponse, makeRequest, AvailableAuthMethod } from '../../common/packetHandler'
import { loggedIn, registerPageTitle, splitMessageToVNodes } from '../../common/helper'
import stepsBar from './stepsBar.vue'
import queryBox from './queryBox.vue'
import chooseBox from './chooseBox.vue'
import challengeBox from './challengeBox.vue'
import doneBox from './doneBox.vue'

onMounted(() => {
    window.scrollTo(0, 0)
    registerPageTitle(t('pages.signIn.signIn'))
})

const ASN_MIN = 0
const ASN_MAX = 4294967295

const t = useI18n().t

const _asn = ref('0')
const currentStep: Ref<'query' | 'choose' | 'challenge' | 'done'> = ref('query')
const loading = ref(false)

const customQuery = ref('')
const customChoose = ref(AvailableAuthMethod.PASSWORD)
const customChooseTitle = ref('')
const customChooseIndex = ref(0)

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
        })
        if (resp.success && resp.response) {
            const data = resp.response as AuthQueryResponse
            if (!data || data.availableAuthMethods.length === 0) {
                Modal.error({
                    centered: true,
                    title: t('pages.signIn.signIn'),
                    content: splitMessageToVNodes(t('pages.signIn.couldNotFindAuthMethod')),
                })
                return
            }
            authQueryResp.value = data
            currentStep.value = 'choose'
            customQuery.value = `${t('pages.signIn.hi')} ${data.person}`
            _asn.value = asn.toString()
            window.scrollTo(0, 0)
        }
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
        })

        if (resp.success && resp.response) {
            const data = resp.response as AuthRequestResponse
            if (!data || !data.authState || !data.authChallenge) {
                Modal.error({
                    centered: true,
                    title: t('pages.signIn.signIn'),
                    content: splitMessageToVNodes(t('pages.signIn.errorOccurred')),
                })
                return
            }

            authRequestResp.value = data
            currentStep.value = 'challenge'
            if (authQueryResp.value) {
                customChooseIndex.value = selectedMethod
                customChoose.value = authQueryResp.value.availableAuthMethods[selectedMethod].type
                customChooseTitle.value = t(`pages.signIn.authMethodsTiny[${authQueryResp.value.availableAuthMethods[selectedMethod].type}]`)
                window.scrollTo(0, 0)
            }
        }
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
        })

        if (resp.success && resp.response) {
            const data = resp.response as AuthChallengeResponse
            if (!data || !data.authResult) {
                Modal.error({
                    centered: true,
                    title: t('pages.signIn.signIn'),
                    content: splitMessageToVNodes(t('pages.signIn.signInFailed')),
                })
                return
            }

            if (data.token) {
                localStorage.setItem('token', data.token)
            }

            localStorage.setItem('person', authQueryResp.value?.person || '')
            authQueryResp.value?.availableAuthMethods.forEach(m => {
                if (m && m.type === AvailableAuthMethod.EMAIL && m.data) {
                    localStorage.setItem('email', m.data)
                }
            })
            localStorage.setItem('asn', _asn.value)
            localStorage.setItem('lastAsn', _asn.value)
            loggedIn.value = true

            currentStep.value = 'done'
            message.info(`${t('pages.signIn.welcomeBack')} ${authQueryResp.value?.person || _asn.value}`)
            window.scrollTo(0, 0)
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <section>
        <h1 class="header">{{ t('pages.signIn.signIn') }}</h1>
        <a-layout-content id="signin">
            <steps-bar class="steps" :step="currentStep" :custom-query-title="customQuery"
                :custom-choose-title="customChooseTitle" :loading="loading"></steps-bar>
            <section class="box">
                <template v-if="currentStep === 'query'">
                    <query-box :loading="loading" :query-asn="queryAsn"></query-box>
                </template>
                <template v-else-if="currentStep === 'choose'">
                    <choose-box :prev-step="() => currentStep = 'query'" :loading="loading"
                        :auth-query-resp="authQueryResp" :request-challenge="requestChallenge"></choose-box>
                </template>
                <template v-else-if="currentStep === 'challenge'">
                    <challenge-box :prev-step="() => currentStep = 'choose'" :loading="loading"
                        :auth-request-resp="authRequestResp" :auth-query-resp="authQueryResp" :selectedIndex="customChooseIndex" :challenge="challenge"
                        :type="customChoose"></challenge-box>
                </template>
                <template v-else-if="currentStep === 'done'">
                    <done-box></done-box>
                </template>
            </section>
        </a-layout-content>
    </section>
</template>

<style scoped>
.box:deep(.ant-alert-message) p:first-child {
    margin-top: auto;
}

.box:deep(.ant-alert-message) p:last-child {
    margin-bottom: auto;
}

.header {
    font-size: 28px;
    letter-spacing: 0.5px;
    margin-top: 50px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: normal;
}

#signin {
    margin-top: 15px;
    margin-bottom: 80px;
    min-height: 280px;
}

#signin:deep(.box) {
    max-width: 600px;
    margin: 30px auto;
}

#signin:deep(.steps) {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 10px 50px 10px;
}

@media (min-width: 0px) and (max-width: 700px) {
    #signin:deep(.steps) {
        padding: 0 10px;
    }
}
</style>
