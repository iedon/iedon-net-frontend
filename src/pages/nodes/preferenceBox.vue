<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { SendOutlined } from '@ant-design/icons-vue'
import { isAdmin, splitMessageToVNodes } from '../../common/helper'
import { RouterMetadata, RoutingPolicy } from '../../common/packetHandler'


const props = defineProps<{
    router: RouterMetadata,
    nextStep: Function,
    preferenceForm: {
        asn: string,
        linkType: string,
        bgpExtensions: ("mp-bgp" | "extended-nexthop")[],
        routingPolicy: number
    },
    isEditMode?: boolean,
    existingSession?: any,
    reuseExistingConfig?: boolean
}>()

const emit = defineEmits<{
    'update:reuseExistingConfig': [value: boolean]
}>()

const updateReuseConfig = (value: boolean) => {
    emit('update:reuseExistingConfig', value)
}

const t = useI18n().t

const router = useRouter()
const backToTop = () => {
    router.back()
    window.scrollTo(0, 0)
}

// Get routing policy options as array for display
const getRoutingPolicyOptions = () => {
    const options = []
    for (let i = 0; i <= 4; i++) {
        // Hide UPSTREAM (4) option for non-admin users
        if (i === RoutingPolicy.UPSTREAM && !isAdmin.value) continue
        
        options.push({
            value: i,
            label: t(`pages.peering.routingPolicyTypes.${RoutingPolicy[i]}`),
            description: t(`pages.peering.routingPolicyTypes.${RoutingPolicy[i]}_DESC`)
        })
    }
    return options
}

const routingPolicyOptions = getRoutingPolicyOptions()
</script>

<template>
    <a-alert :message="splitMessageToVNodes(t('pages.peering.step1Introduction'))" type="info" />
    <br />
    <a-form :model="props.preferenceForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" class="peerInfoForm">
        <a-form-item v-if="isAdmin" name="peerAsn" :label="t('pages.peering.asn')">
            <a-input type="number" v-model:value="props.preferenceForm.asn" addon-before="AS" :placeholder="`${t('pages.signIn.pleaseInput')} ${t('pages.peering.asn')}`"></a-input>
        </a-form-item>

        <a-form-item :label="t('pages.peering.linkType')">
            <a-radio-group v-model:value="props.preferenceForm.linkType">
                <a-radio v-for="linkType in props.router.linkTypes" :key="`linkType_${linkType}`" :value="linkType">
                    {{ t(`pages.peering.${linkType}`) }}
                </a-radio>
            </a-radio-group>
        </a-form-item>

        <a-form-item :label="t('pages.peering.bgpExtensions')">
            <a-checkbox-group v-model:value="props.preferenceForm.bgpExtensions">
                <a-checkbox v-for="extension in props.router.extensions" :key="`extension_${extension}`" :value="extension">{{ t(`pages.peering['${extension}']`) }}</a-checkbox>
            </a-checkbox-group>
        </a-form-item>
        <a-form-item :label="t('pages.peering.routingPolicy')">
            <a-radio-group v-model:value="props.preferenceForm.routingPolicy">
                <a-space direction="vertical" style="width: 100%">
                    <a-radio v-for="option in routingPolicyOptions" :key="`policy_${option.value}`" :value="option.value">
                        <div>
                            <div><b>{{ option.label }}</b></div>
                            <div class="policy-description">{{ option.description }}</div>
                        </div>
                    </a-radio>
                </a-space>
            </a-radio-group>
        </a-form-item>
        <!-- Reuse existing config option for edit mode -->
        <a-form-item v-if="props.isEditMode && props.existingSession?.type === props.preferenceForm.linkType" :wrapper-col="{ offset: 8, span: 16 }">
            <a-checkbox :checked="props.reuseExistingConfig" @change="(e: Event) => updateReuseConfig((e.target as HTMLInputElement)?.checked)">
                {{ t('pages.peering.reuseExistingConfig') }}
            </a-checkbox>
        </a-form-item>

        <br />
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button style="margin-right:20px" @click="backToTop()">{{ t('pages.peering.backTop') }}</a-button>
            <a-button type="primary" @click="props.nextStep()">
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

.policy-description {
    font-size: 0.9em;
    margin-top: 2px;
    margin-bottom: 8px;
    max-width: 500px;
}
</style>
