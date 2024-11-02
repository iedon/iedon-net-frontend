<script setup lang="ts">
import { computed, ref } from 'vue'
import { SendOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { splitMessageToVNodes } from '../../common/helper'
import { AuthQueryResponse, AuthRequestResponse, AvailableAuthMethod } from '../../common/packetHandler'
import { message } from 'ant-design-vue'

const props = defineProps<{
    authRequestResp: AuthRequestResponse | null,
    authQueryResp: AuthQueryResponse | null,
    selectedIndex: number,
    challenge: Function,
    loading: boolean,
    type: AvailableAuthMethod,
    prevStep: Function
}>()

const t = useI18n().t
const challengeForm = ref({
    publicKey: '',
    challengeText: ''
})

const isLoading = computed(() => props.loading)
const activeKey = ref('challengeHint')

const copyChallengeText = async (c: string) => {
    try {
        await navigator.clipboard.writeText(c.trim())
        message.info(t('pages.nodes.copied'))
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <a-spin :tip="`${t('pages.signIn.pleaseWait')}`" :spinning="isLoading">
        <a-alert :message="splitMessageToVNodes(t('pages.signIn.step3Introduction'))" type="success" />
        <br />
        <a-form :model="challengeForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-collapse accordion v-model:activeKey="activeKey">
                <a-collapse-panel key="challengeHint">
                    <template #header>
                        <span style="font-style:italic">{{ t('pages.signIn.challengeHint') }}</span>
                    </template>
                    <span
                        @click.stop='copyChallengeText(
                            `echo "${props.authRequestResp?.authChallenge}" | gpg --clearsign --armor -u ${props.authQueryResp?.availableAuthMethods.find(v => Number(v.id) === selectedIndex)?.data}`
                        )'
                        v-if="props.type === AvailableAuthMethod.PGP_ASCII_ARMORED_CLEAR_SIGN"
                        style="word-break:break-all;font-size:12px;user-select:text;font-family:\'Courier New\',Courier,monospace;cursor:pointer">
                        {{
                            `echo "${props.authRequestResp?.authChallenge}" | gpg --clearsign --armor -u ${props.authQueryResp?.availableAuthMethods.find(v => Number(v.id) === selectedIndex)?.data}`
                        }}
                    </span>
                    <span @click.stop='copyChallengeText(props.authRequestResp?.authChallenge || "")' v-else
                        style="word-break:break-all;font-size:12px;user-select:text;font-family:\'Courier New\',Courier,monospace;cursor:pointer">{{
                            props.authRequestResp?.authChallenge
                        }}</span>
                </a-collapse-panel>
            </a-collapse>
            <br />

            <a-form-item v-if="props.type === AvailableAuthMethod.PGP_ASCII_ARMORED_CLEAR_SIGN" name="publicKey"
                :label="`${t('pages.signIn.pgpPublicKey')}`"
                :rules="[{ required: true, message: `${t('pages.signIn.pleaseInput')} ${t('pages.signIn.pgpPublicKey')}` }]">
                <a-textarea auto-size v-model:value="challengeForm.publicKey"
                    :placeholder="`${t('pages.signIn.pgpPublicKey')}`" />
            </a-form-item>

            <a-form-item name="challengeText" :label="t('pages.signIn.challengeText')"
                :rules="[{ required: true, message: `${t('pages.signIn.pleaseInput')} ${t('pages.signIn.challengeText')}` }]">
                <a-input-password v-if="props.type === AvailableAuthMethod.PASSWORD" autocomplete="password"
                    v-model:value="challengeForm.challengeText"
                    :placeholder="t('pages.signIn.challengeTextPlaceholder')" />
                <a-textarea v-else auto-size v-model:value="challengeForm.challengeText"
                    :placeholder="`${t('pages.signIn.challengeTextPlaceholder')}`" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button style="margin-right:20px" @click="props.prevStep()">{{ t('pages.peering.back') }}</a-button>
                <a-button type="primary" @click="props.challenge(challengeForm)" :disabled="loading">
                    <template #icon>
                        <send-outlined />
                    </template>
                    {{ t('pages.signIn.continue') }}
                </a-button>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<style scoped></style>
