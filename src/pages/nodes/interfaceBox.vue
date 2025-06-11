<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Modal } from 'ant-design-vue'
import { SendOutlined } from '@ant-design/icons-vue'
import { IPV4_REGEX, IPV6_REGEX } from '../../common/helper'
import { RouterInfoResponse, RouterMetadata } from '../../common/packetHandler'
import PeerInfoCard from './peerInfoCard.vue'
import { onUnmounted, watchEffect } from 'vue'

const props = defineProps<{
    router: RouterMetadata,
    nextStep: Function,
    prevStep: Function,
    routerInfo: RouterInfoResponse | null,    preferenceForm: {
        linkType: string,
        bgpExtensions: ("mp-bgp" | "extended-nexthop")[],
        routingPolicy: number
    },
    interfaceForm: {
        useIpv4: boolean,
        ipv4: string,
        useIpv6: boolean,
        ipv6: string,
        useIpv6LinkLocal: boolean,
        ipv6LinkLocal: string,
        endpoint: string,
        credential: string,
        mtu: number
    }
}>()

const t = useI18n().t

// Set default MTU based on linkType
const closeWatch = watchEffect(() => {
    if (props.preferenceForm.linkType === 'wireguard') {
        props.interfaceForm.mtu = 1420
    } else if (props.preferenceForm.linkType === 'direct') {
        props.interfaceForm.mtu = 1500
    } else if (props.preferenceForm.linkType === 'gre') {
        props.interfaceForm.mtu = 1476
    } else if (props.preferenceForm.linkType === 'ip6gre') {
        props.interfaceForm.mtu = 1456
    }
})

onUnmounted(() => {
    closeWatch()
})

const checkAndContinue = () => {
    if ((!props.interfaceForm.ipv4 && !props.interfaceForm.ipv6 && !props.interfaceForm.ipv6LinkLocal) ||
        (!props.interfaceForm.useIpv4 && !props.interfaceForm.useIpv6 && !props.interfaceForm.useIpv6LinkLocal)) {
        Modal.error({
            centered: true,
            title: t('pages.peering.step2'),
            content: t('pages.peering.mustEnableAtleastOneProtocol'),
        })
        return
    }
    
    if (props.preferenceForm.linkType !== 'direct' &&
        props.preferenceForm.linkType !== 'gre' &&
        props.preferenceForm.linkType !== 'ip6gre' &&
        !props.interfaceForm.credential) {
        Modal.error({
            centered: true,
            title: t('pages.peering.step2'),
            content: t('pages.peering.mustEnterTunnelInformation'),
        })
        return
    }
    
    if (!props.interfaceForm.mtu || props.interfaceForm.mtu < 1280 || props.interfaceForm.mtu > 9999) {
        Modal.error({
            centered: true,
            title: t('pages.peering.step2'),
            content: t('pages.peering.inputValidMTU') || 'Please input a valid MTU (1280-9999)',
        })
        return
    }

    if (!props.routerInfo || !props.routerInfo.passthrough) {
        Modal.error({
            centered: true,
            title: t('pages.peering.step2'),
            content: t('pages.signIn.errorOccurred'),
        })
        return
    }

    if ((props.interfaceForm.useIpv4 && !props.interfaceForm.ipv4) ||
        (props.interfaceForm.useIpv6 && !props.interfaceForm.ipv6) ||
        (props.interfaceForm.ipv6LinkLocal && !props.interfaceForm.ipv6LinkLocal)) {
        Modal.error({
            centered: true,
            title: t('pages.peering.step2'),
            content: t('pages.peering.inputValid'),
        })
        return
    }

    if (!props.interfaceForm.useIpv4) props.interfaceForm.ipv4 = ''
    if (!props.interfaceForm.useIpv6) props.interfaceForm.ipv6 = ''
    if (!props.interfaceForm.useIpv6LinkLocal) props.interfaceForm.ipv6LinkLocal = ''

    try {

        if (props.interfaceForm.ipv4 !== '' && !IPV4_REGEX.test(props.interfaceForm.ipv4) ||
            props.interfaceForm.ipv6 !== '' && !IPV6_REGEX.test(props.interfaceForm.ipv6) ||
            props.interfaceForm.ipv6LinkLocal !== '' && !IPV6_REGEX.test(props.interfaceForm.ipv6LinkLocal)) {
            throw new Error('Invalid IP')
        }

        if (props.interfaceForm.endpoint.trim() !== '') {
            if (props.interfaceForm.endpoint.indexOf(':') === -1 &&
                props.preferenceForm.linkType !== 'gre' &&
                props.preferenceForm.linkType !== 'ip6gre' &&
                props.preferenceForm.linkType !== 'direct'
            ) throw new Error('Invalid endpoint')

            if (props.preferenceForm.linkType === 'gre' ||
                props.preferenceForm.linkType === 'ip6gre' ||
                props.preferenceForm.linkType === 'direct') {
                    if (props.preferenceForm.linkType === 'gre') {
                        if (!IPV4_REGEX.test(props.interfaceForm.endpoint)) throw new Error('Invalid endpoint for GRE')
                    } else if (props.preferenceForm.linkType === 'ip6gre') {
                        if (!IPV6_REGEX.test(props.interfaceForm.endpoint)) throw new Error('Invalid endpoint for IP6GRE')
                    }
            } else {
                const url = new URL(`https://${props.interfaceForm.endpoint}`)
                props.interfaceForm.endpoint = url.host
            }
        } else {
            if (props.preferenceForm.linkType !== 'wireguard') throw new Error('Invalid endpoint')
            props.interfaceForm.endpoint = ''
        }

    } catch /*(error)*/ {
        Modal.error({
            centered: true,
            title: t('pages.peering.step2'),
            content: t('pages.peering.inputValid'),
        })
        // console.error(error)
        return
    }

    props.nextStep()
    window.scrollTo(0, 0)
}
</script>

<template>
    <peer-info-card :router="props.router" :router-info="props.routerInfo"></peer-info-card>
    <a-form :model="props.preferenceForm" class="peerInfoForm">
        <a-form-item :label="t('pages.peering.useIpv4')">
            <a-switch v-model:checked="props.interfaceForm.useIpv4" />
        </a-form-item>

        <a-form-item v-if="props.interfaceForm.useIpv4" name="ipv4" :label="t('pages.peering.ipv4')">
            <a-textarea auto-size v-model:value="props.interfaceForm.ipv4"
                :placeholder="`${t('pages.signIn.pleaseInput')} ${t('pages.peering.ipv4')}`" />
        </a-form-item>

        <a-form-item :label="t('pages.peering.useIpv6')">
            <a-switch v-model:checked="interfaceForm.useIpv6" />
        </a-form-item>

        <a-form-item v-if="props.interfaceForm.useIpv6" name="ipv6" :label="t('pages.peering.ipv6')">
            <a-textarea auto-size v-model:value="props.interfaceForm.ipv6"
                :placeholder="`${t('pages.signIn.pleaseInput')} ${t('pages.peering.ipv6')}`" />
        </a-form-item>

        <a-form-item :label="t('pages.peering.useIpv6LinkLocal')">
            <a-switch v-model:checked="interfaceForm.useIpv6LinkLocal" />
        </a-form-item>

        <a-form-item v-if="props.interfaceForm.useIpv6LinkLocal" name="ipv6LinkLocal"
            :label="t('pages.peering.ipv6LinkLocal')">
            <a-textarea auto-size v-model:value="props.interfaceForm.ipv6LinkLocal"
                :placeholder="`${t('pages.signIn.pleaseInput')} ${t('pages.peering.ipv6LinkLocal')}`" />
        </a-form-item>
        <a-form-item name="endpoint" :label="t('pages.peering.endpoint')">
            <a-textarea auto-size v-model:value="props.interfaceForm.endpoint"
                :placeholder="`${t('pages.peering.tunnelEndpointHint')}`" />
        </a-form-item>
        <a-form-item v-if="props.preferenceForm.linkType !== 'direct' && props.preferenceForm.linkType !== 'gre' && props.preferenceForm.linkType !== 'ip6gre'" name="credential" :label="t('pages.peering.credential')">
            <a-textarea auto-size v-model:value="props.interfaceForm.credential"
                :placeholder="`${t('pages.peering.tunnelCredentialHint')}`" />
        </a-form-item>

        <a-form-item name="mtu" :label="t('pages.peering.mtu')">
            <a-input-number 
                v-model:value="props.interfaceForm.mtu" 
                :min="1280" 
                :max="9999"
                :placeholder="`${t('pages.signIn.pleaseInput')} MTU`" />
        </a-form-item>

        <br />
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button style="margin-right:20px" @click="props.prevStep()">{{ t('pages.peering.back') }}</a-button>
            <a-button type="primary" @click="checkAndContinue">
                <template #icon>
                    <send-outlined />
                </template>
                {{ t('pages.signIn.continue') }}
            </a-button>
        </a-form-item>
    </a-form>
</template>

<style scoped>
.peerInfoForm {
    padding: 0 20px
}
</style>
