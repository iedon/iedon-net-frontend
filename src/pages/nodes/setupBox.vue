<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SendOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { RouterInfoResponse, RouterMetadata } from '../../common/packetHandler'
import PeerInfoCard from './peerInfoCard.vue'

const t = useI18n().t

// This step is reserved for further extension.
// Currently used to summary information.

const props = defineProps<{
    nextStep: Function,
    prevStep: Function,
    router: RouterMetadata,
    routerInfo: RouterInfoResponse | null,
    loading: boolean,
    preferenceForm: {
        linkType: string,
        bgpExtensions: ("mp-bgp" | "extended-nexthop")[]
    },
    interfaceForm: {
        useIpv4: boolean,
        ipv4: string,
        useIpv6: boolean,
        ipv6: string,
        useIpv6LinkLocal: boolean,
        ipv6LinkLocal: string,
        endpoint: string,
        credential: string
    }
}>()

const interfaceForm = computed(() => {
    const result = {}
    for (const key in props.interfaceForm) {
        const data: string | boolean = props.interfaceForm[key as keyof typeof props.interfaceForm]
        if ((typeof data === 'string' && data !== '') || (typeof data !== 'string' && !data)) Object.assign(result, {
            [key]: data
        })
    }
    return result
})

const preferenceForm = computed(() => {
    const result = {}
    for (const key in props.preferenceForm) {
        const data: string | ("mp-bgp" | "extended-nexthop")[] = props.preferenceForm[key as keyof typeof props.preferenceForm]
        if (key !== 'asn') Object.assign(result, { [key]: data })
    }
    return result
})

const loading = computed(() => props.loading)
</script>

<template>
    <a-spin :spinning="loading">
        <h2 class="header">{{ t('pages.peering.step3Introduction') }}</h2>
        <a-descriptions layout="vertical" bordered size="small" :column="2" class="summary">
            <a-descriptions-item v-for="data, key in preferenceForm" :key="`preferenceForm_${key}`" :label="t(`pages.peering['${key}']` as string)">
                <template v-if="key === 'linkType'">
                    {{ t(`pages.peering['${data}']` as string) }}
                </template>
                <template v-else-if="key === 'bgpExtensions' && Array.isArray(data)">
                    <span class="tag" v-for="item in data" :key="item">{{ t(`pages.peering['${item}']`) }}</span>
                </template>
                <template v-else>
                    {{ data }}
                </template>
            </a-descriptions-item>
            <a-descriptions-item v-for="data, key in interfaceForm" :key="`interfaceForm_${key}`" :label="t(`pages.peering['${key}']` as string)">
                <template v-if="typeof data === 'boolean'">
                    <check-circle-outlined v-if="data" />
                    <close-outlined v-else />
                </template>
                <template v-else>
                    {{ data }}
                </template>
            </a-descriptions-item>
        </a-descriptions>
        <peer-info-card :router="props.router" :router-info="props.routerInfo"></peer-info-card>
        <div class="buttons">
            <a-button @click="props.prevStep()">{{ t('pages.peering.back') }}</a-button>
            <a-button type="primary" @click="props.nextStep()">
                <template #icon>
                    <send-outlined />
                </template>
                {{ t('pages.signIn.continue') }}
            </a-button>
        </div>
    </a-spin>
</template>

<style scoped>
.header {
    margin-bottom: 20px;
    text-align: center;
}
.summary {
    margin-bottom: 20px;
}
.buttons {
    margin: 20px auto;
    text-align: center;
}
.buttons > button:first-child {
    margin-right: 20px;
}
.tag {
    border-radius: 5px;
    color: #666;
    font-size: 13px;
    padding: 0.15em 0.3em;
    line-height: 200%;
}
.tag:not(:last-child) {
    margin-right: 10px;
}
</style>
