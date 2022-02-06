<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { FieldTimeOutlined, NodeIndexOutlined, HeartOutlined, SmileOutlined, LoadingOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
    step: 'preference' | 'interface' | 'setup' | 'done',
    loading: boolean
}>()

const t = useI18n().t

const statusPreference = ref('finish')
const statusInterface = ref('wait')
const statusSetup = ref('wait')
const statusDone = ref('wait')

const currentStep = computed(() => props.step)
const isLoading = computed(() => props.loading)

const watchStop = watch(() => currentStep.value, (newValue: string) => {
    switch (newValue) {
        case 'interface': {
            statusPreference.value = 'finish'
            statusInterface.value = 'process'
            statusSetup.value = 'wait'
            statusDone.value = 'wait'
        }
        break;
        case 'setup': {
            statusPreference.value = 'finish'
            statusInterface.value = 'finish'
            statusSetup.value = 'process'
            statusDone.value = 'wait'
        }
        break;
        case 'done': {
            statusPreference.value = 'finish'
            statusInterface.value = 'finish'
            statusSetup.value = 'finish'
            statusDone.value = 'finish'
        }
        break;
        default: case 'preference': {
            statusPreference.value = 'finish'
            statusInterface.value = 'wait'
            statusSetup.value = 'wait'
            statusDone.value = 'wait'
        }
        break;
    }
})

onUnmounted(() => {
    watchStop()
})

</script>

<template>
    <a-steps>
        <a-step :status="statusPreference" :title="t('pages.peering.step1')">
            <template #icon>
                <loading-outlined v-if="currentStep === 'preference' && isLoading" />
                <heart-outlined v-else />
            </template>
        </a-step>
        <a-step :status="statusInterface" :title="t('pages.peering.step2')">
            <template #icon>
                <loading-outlined v-if="currentStep === 'interface' && isLoading" />
                <node-index-outlined v-else />
            </template>
        </a-step>
        <a-step :status="statusSetup" :title="t('pages.peering.step3')">
            <template #icon>
                <loading-outlined v-if="currentStep === 'setup' && isLoading" />
                <field-time-outlined v-else />
            </template>
        </a-step>
        <a-step :status="statusDone" :title="t('pages.peering.step4')">
            <template #icon>
                <loading-outlined v-if="currentStep === 'done' && isLoading" />
                <smile-outlined v-else />
            </template>
        </a-step>
    </a-steps>
</template>

<style scoped>
</style>
