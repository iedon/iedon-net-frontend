<script setup lang="ts">
import { computed, ref } from 'vue'
import { SendOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { splitMessageToVNodes } from '../../common/helper'
import { AuthQueryResponse, AvailableAuthMethod } from '../../common/packetHandler'
import { RadioChangeEvent } from 'ant-design-vue'

const props = defineProps<{
    authQueryResp: AuthQueryResponse | null,
    requestChallenge: Function,
    loading: boolean,
    prevStep: Function
}>()

const t = useI18n().t
const requestChallengeForm = ref({ method: 0 })

const isLoading = computed(() => props.loading)
const data = computed(() => props.authQueryResp)
const activeKey = ref('desc_0')

const onRadioChange = (e: RadioChangeEvent) => {
    activeKey.value = `desc_${e.target?.value}`
}

const onCollapseChange = (key: string) => {
    if (key) requestChallengeForm.value.method = Number(key.split('desc_')[1])
}
</script>

<template>
    <a-spin :tip="`${t('pages.signIn.pleaseWait')}`" :spinning="isLoading">
        <a-alert :message="splitMessageToVNodes(t('pages.signIn.step2Introduction'))" type="success" />
        <br />
        <a-form :model="requestChallengeForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-collapse accordion v-model:activeKey="activeKey" @change="onCollapseChange">
                <template v-for="method in data?.availableAuthMethods" :key="`desc_${method.id}`">
                    <a-collapse-panel>
                        <template #header>
                            <b>{{ method.id + 1 }}</b><span
                                style="margin-left:20px;font-style:italic">{{ t(`pages.signIn.authMethods[${method.type}]`) }}</span>
                        </template>
                        <span style="word-break:break-all;font-size:12px;user-select:text">{{ method.data ||
                            (method.type === AvailableAuthMethod.PASSWORD ?
                            t('pages.signIn.useSitePassword') : '') }}</span>
                    </a-collapse-panel>
                </template>
            </a-collapse>
            <br />
            <a-form-item :label="t('pages.signIn.authenticateWith')">
                <a-radio-group v-model:value="requestChallengeForm.method">
                    <a-radio v-for="method in data?.availableAuthMethods" :key="`method_${method.id}`"
                        :value="method.id" @change="onRadioChange">
                        {{ method.id + 1 }} ({{ t(`pages.signIn.authMethods[${method.type}]`) }})
                    </a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button style="margin-right:20px" @click="props.prevStep()">{{ t('pages.peering.back') }}</a-button>
                <a-button type="primary" @click="props.requestChallenge(requestChallengeForm.method)"
                    :disabled="loading">
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
