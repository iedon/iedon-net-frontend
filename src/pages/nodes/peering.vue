<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { CurrentSessionMetadata, GetCurrentSessionResponse, makeRequest, RouterInfoResponse, RouterMetadata, RoutingPolicy, SessionMetadata } from '../../common/packetHandler'
import { ASN_MAX, ASN_MIN, isAdmin, loggedIn, registerPageTitle } from '../../common/helper'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'
import stepsBar from './stepsBar.vue'
import preferenceBox from './preferenceBox.vue'
import interfaceBox from './interfaceBox.vue'
import setupBox from './setupBox.vue'
import doneBox from './doneBox.vue'

const t = useI18n().t
const router = useRouter()
const loading = ref(false)

const nodeUuid = router.currentRoute.value.params.uuid as string || null
const sessionId = router.currentRoute.value.params.sessionId as string || null
const isEditMode = !!sessionId
const node: Ref<RouterMetadata | null> = ref(null)
const existingSession: Ref<CurrentSessionMetadata | null> = ref(null)
try {
    const nodes = localStorage.getItem('routers')
    if (nodes) node.value = (JSON.parse(nodes) as RouterMetadata[]).find(r => r.uuid === nodeUuid) || null
} catch (error) {
    console.error(error)
}

const currentStep: Ref<'preference' | 'interface' | 'setup' | 'done'> = ref('preference')

onMounted(async () => {
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

    registerPageTitle(`${node.value?.name} ${t('header.nodes')}`)

    // Load existing session data if in edit mode
    if (isEditMode) {
        await loadExistingSession()
    }
})

onUnmounted(() => {
    closeWatchLinkTypeChange()
})

const preferenceForm = ref({
    asn: '424242',
    linkType: node.value?.linkTypes[0] || '',
    bgpExtensions: node.value?.extensions || [],
    routingPolicy: RoutingPolicy.FULL, // Default to FULL
})

const routerInfo: Ref<RouterInfoResponse | null> = ref(null)
const reuseExistingConfig = ref(false)
const oldRouterInfo: Ref<RouterInfoResponse | null> = ref(null)

// Watch for link type changes to reset reuse config
const closeWatchLinkTypeChange = watch(() => preferenceForm.value.linkType, (newLinkType) => {
    if (isEditMode && existingSession.value) {
        if (existingSession.value.type === newLinkType && oldRouterInfo.value) {
            // Same link type and we have old router info, default to reuse
            reuseExistingConfig.value = true
        } else {
            // Different link type or no old router info, don't reuse
            reuseExistingConfig.value = false
        }
    }
})

const getRouterInfo = async () => {
    if (isAdmin.value) {
        if (preferenceForm.value.asn === '' || isNaN(Number(preferenceForm.value.asn)) || Number(preferenceForm.value.asn) < ASN_MIN || Number(preferenceForm.value.asn) > ASN_MAX) {
            Modal.error({
                centered: true,
                title: 'Admin Peering',
                content: `${t('pages.signIn.pleaseInput')} ${t('pages.peering.asn')}`,
            })
            return
        }
    }

    try {
        loading.value = true

        // If user chose to reuse existing config and we have old router info, use it
        if (isEditMode && reuseExistingConfig.value && oldRouterInfo.value) {
            routerInfo.value = oldRouterInfo.value
        } else {
            // Get new router info from server
            routerInfo.value = null
            const resp = await makeRequest(t, '/session', {
                action: 'info',
                router: node.value?.uuid,
                data: {
                    linkType: preferenceForm.value.linkType,
                    bgpExtensions: preferenceForm.value.bgpExtensions
                }
            })
            if (resp.success && resp.response) {
                const data = resp.response as RouterInfoResponse
                if (data) {
                    routerInfo.value = data
                }
            }
        }

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
    credential: '',
    mtu: 1280
})

const startPeering = async () => {
    try {
        loading.value = true
        const options = {
            action: isEditMode ? 'modify' : 'add',
            router: node.value?.uuid,
            ipv4: interfaceForm.value.ipv4,
            ipv6: interfaceForm.value.ipv6,
            ipv6LinkLocal: interfaceForm.value.ipv6LinkLocal,
            type: preferenceForm.value.linkType,
            extensions: preferenceForm.value.bgpExtensions,
            policy: preferenceForm.value.routingPolicy,
            mtu: interfaceForm.value.mtu,
            endpoint: interfaceForm.value.endpoint,
            credential: interfaceForm.value.credential,
            data: routerInfo.value
        }

        // Add session ID for modify action
        if (isEditMode && sessionId) {
            Object.assign(options, { session: sessionId })
        }

        if (isAdmin.value) Object.assign(options, { asn: Number(preferenceForm.value.asn) })

        if ((await makeRequest(t, '/session', options)).success) {
            currentStep.value = 'done'
            window.scrollTo(0, 0)
            return
        }

        Modal.error({
            centered: true,
            title: t('pages.peering.step3'),
            content: t('pages.signIn.errorOccurred'),
        })

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const loadExistingSession = async () => {
    if (!isEditMode || !sessionId) return

    try {
        loading.value = true
        const resp = await makeRequest(t, '/session', {
            action: 'get',
            session: sessionId
        })
        if (resp.success && resp.response) {
            const exist = (resp.response as unknown as GetCurrentSessionResponse).session
            existingSession.value = exist
            // Pre-populate the forms with existing session data
            if (existingSession.value) {
                preferenceForm.value.asn = existingSession.value.asn.toString()
                preferenceForm.value.linkType = existingSession.value.type
                preferenceForm.value.bgpExtensions = existingSession.value.extensions
                preferenceForm.value.routingPolicy = existingSession.value.policy

                interfaceForm.value.ipv4 = existingSession.value.ipv4 || ""
                interfaceForm.value.ipv6 = existingSession.value.ipv6 || ""
                interfaceForm.value.ipv6LinkLocal = existingSession.value.ipv6LinkLocal || ""
                interfaceForm.value.endpoint = existingSession.value.endpoint || ""
                interfaceForm.value.credential = existingSession.value.credential || ""
                interfaceForm.value.mtu = parseInt(existingSession.value.interface) || 1280

                // Set IPv4/IPv6 usage flags based on data
                interfaceForm.value.useIpv4 = !!existingSession.value.ipv4
                interfaceForm.value.useIpv6 = !!existingSession.value.ipv6
                interfaceForm.value.useIpv6LinkLocal = !!existingSession.value.ipv6LinkLocal

                // Store old router info if available
                if (existingSession.value.data && typeof existingSession.value.data === 'object' && 'info' in existingSession.value.data && 'passthrough' in existingSession.value.data) {
                    oldRouterInfo.value = {
                        info: existingSession.value.data.info,
                        passthrough: existingSession.value.data.passthrough
                    }
                    // Default to reusing existing config in edit mode
                    reuseExistingConfig.value = true
                }
            }
        }
    } catch (error) {
        console.error('Failed to load existing session:', error)
        message.error(t('pages.peering.couldNotGetData'))
        router.back()
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <section>
        <h1 class="header" v-if="node">
            <div class="avatar"><router-location-avatar :router="node"></router-location-avatar></div>
            {{ node?.name }}
            <span v-if="isEditMode" style="font-size: 0.7em; color: #666; margin-left: 10px;">
                ({{ t('pages.manage.session.edit') }})
            </span>
        </h1>
        <a-layout-content id="peering" v-if="node">
            <steps-bar class="steps" :step="currentStep" :loading="loading"></steps-bar>
            <a-spin :spinning="loading">
                <section :class="`box ${currentStep || ''}`"> <template v-if="currentStep === 'preference'">
                        <preference-box :router="node" :preference-form="preferenceForm" :nextStep="getRouterInfo"
                            :is-edit-mode="isEditMode" :existing-session="existingSession"
                            v-model:reuseExistingConfig="reuseExistingConfig"></preference-box>
                    </template>
                    <template v-else-if="currentStep === 'interface'">
                        <interface-box :router="node" :router-info="routerInfo" :preference-form="preferenceForm"
                            :interface-form="interfaceForm" :nextStep="() => currentStep = 'setup'"
                            :prevStep="() => currentStep = 'preference'"></interface-box>
                    </template>
                    <template v-else-if="currentStep === 'setup'">
                        <setup-box :preference-form="preferenceForm" :loading="loading" :router="node"
                            :router-info="routerInfo" :interface-form="interfaceForm" :nextStep="startPeering"
                            :prevStep="() => currentStep = 'interface'"></setup-box>
                    </template>
                    <template v-else-if="currentStep === 'done'">
                        <done-box :router="node"></done-box>
                    </template>
                </section>
            </a-spin>
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
    margin-top: 30px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: normal;
    display: flex;
    justify-content: center;
    align-items: center;
}

.header:deep(.avatar),
.header:deep(.ant-badge-status) {
    margin-right: 20px;
    vertical-align: text-top;
    overflow: visible;
    display: inline-block;
}

#peering {
    margin-top: 15px;
    margin-bottom: 80px;
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
    margin: 0 auto;
    padding: 0 10px 50px 10px;
}

@media (min-width: 0px) and (max-width: 768px) {
    #peering:deep(.steps) {
        padding: 0 10px;
    }
}
</style>
