<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { makeRequest, RouterInfoResponse, RouterMetadata } from '../../common/packetHandler'
import { ASN_MAX, ASN_MIN, isAdmin, loggedIn } from '../../common/helper'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'
import stepsBar from './stepsBar.vue'
import preferenceBox from './preferenceBox.vue'
import interfaceBox from './interfaceBox.vue'
import setupBox from './setupBox.vue'
import doneBox from './doneBox.vue'
import "ant-design-vue/es/modal/style/css"
import "ant-design-vue/es/message/style/css"

const t = useI18n().t
const router = useRouter()
const loading = ref(false)

const nodeUuid = router.currentRoute.value.params.uuid as string || null
const node: Ref<RouterMetadata | null> = ref(null)
try {
    const nodes = localStorage.getItem('routers')
    if (nodes) node.value = (JSON.parse(nodes) as RouterMetadata[]).find(r => r.uuid === nodeUuid) || null
} catch (error) {
    console.error(error)
}

const currentStep: Ref<'preference' | 'interface' | 'setup' | 'done'> = ref('preference')

onMounted(() => {
    window.scrollTo(0, 0)
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }
    if (!node.value) {
        message.error(t('pages.peering.couldNotGetData'))
        router.back()
        return
    }
})

const preferenceForm = ref({
    asn: '424242',
    linkType: node.value?.linkTypes[0] || '',
    bgpExtensions: node.value?.extensions || [],
})

const routerInfo: Ref<RouterInfoResponse | null> = ref(null)
const getRouterInfo = async () => {
    if (isAdmin.value) {
        if (preferenceForm.value.asn === '' || isNaN(Number(preferenceForm.value.asn)) || Number(preferenceForm.value.asn) < ASN_MIN || Number(preferenceForm.value.asn) > ASN_MAX) {
            Modal.error({
                title: 'Admin Peering',
                content: `${t('pages.signIn.pleaseInput')} ${t('pages.peering.asn')}`,
            })
            return
        }
    }
    try {
        routerInfo.value = null
        loading.value = true
        routerInfo.value = await makeRequest(t, '/session', {
            action: 'info',
            router: node.value?.uuid,
            data: {
                linkType: preferenceForm.value.linkType,
                bgpExtensions: preferenceForm.value.bgpExtensions
            }
        }) as RouterInfoResponse
        currentStep.value = 'interface'
        window.scrollTo(0, 0)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const interfaceForm = ref({
    useIpv4: true,
    ipv4: '',
    useIpv6: true,
    ipv6: '',
    useIpv6LinkLocal: true,
    ipv6LinkLocal: '',
    endpoint: '',
    credential: ''
})

const startPeering = async () => {
    try {
        loading.value = true

        const options = {
            action: 'add',
            router: node.value?.uuid,
            ipv4: interfaceForm.value.ipv4,
            ipv6: interfaceForm.value.ipv6,
            ipv6LinkLocal: interfaceForm.value.ipv6LinkLocal,
            type: preferenceForm.value.linkType,
            extensions: preferenceForm.value.bgpExtensions,
            endpoint: interfaceForm.value.endpoint,
            credential: interfaceForm.value.credential,
            data: routerInfo.value
        }
        if (isAdmin.value) Object.assign(options, { asn: Number(preferenceForm.value.asn) })

        const resp = await makeRequest(t, '/session', options)

        if (resp !== null) {
            currentStep.value = 'done'
            window.scrollTo(0, 0)
            return
        }

        Modal.error({
            title: t('pages.peering.step3'),
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
    <h1 class="header" v-if="node">
        <div class="avatar"><router-location-avatar :router="node"></router-location-avatar></div>
        {{ node?.name }}
    </h1>
    <a-layout-content id="peering" v-if="node">
        <steps-bar class="steps" :step="currentStep" :loading="loading"></steps-bar>
        <a-spin :spinning="loading">
            <section :class="`box ${currentStep || ''}`">
                <template v-if="currentStep === 'preference'">
                    <preference-box :router="node" :preference-form="preferenceForm" :nextStep="getRouterInfo"></preference-box>
                </template>
                <template v-else-if="currentStep === 'interface'">
                    <interface-box :router="node" :router-info="routerInfo" :preference-form="preferenceForm" :interface-form="interfaceForm" :nextStep="() => currentStep = 'setup'" :prevStep="() => currentStep = 'preference'"></interface-box>
                </template>
                <template v-else-if="currentStep === 'setup'">
                <setup-box :preference-form="preferenceForm" :loading="loading" :router="node" :router-info="routerInfo" :interface-form="interfaceForm" :nextStep="startPeering" :prevStep="() => currentStep = 'interface'"></setup-box>
                </template>
                <template v-else-if="currentStep === 'done'">
                    <done-box :router="node"></done-box>
                </template>
            </section>
        </a-spin>
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
.header:deep(.avatar), .header:deep(.ant-badge-status) {
    margin-right: 20px;
    vertical-align: text-top;
    overflow: visible;
    display: inline-block;
}
#peering {
    margin-top: 15px;
    margin-bottom: 80px;
    padding: 0 24px;
    min-height: 280px;
}
#peering:deep(.box) {
    max-width: 700px;
    margin: 30px auto;
}
#peering:deep(.box).setup {
    max-width: 100%;
    margin: 30px 50px;
}
#peering:deep(.steps) {
    max-width: 1000px;
    margin: 0 auto 80px auto;
}
</style>
