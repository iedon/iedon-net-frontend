<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SearchOutlined, UserOutlined, HeartOutlined, SmileOutlined, LoadingOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
    step: 'query' | 'choose' | 'challenge' | 'done',
    customQueryTitle: string,
    customChooseTitle: string,
    loading: boolean
}>()

const t = useI18n().t

const statusQuery = ref('finish')
const statusChoose = ref('wait')
const statusChallenge = ref('wait')
const statusDone = ref('wait')

const currentStep = computed(() => props.step)
const isLoading = computed(() => props.loading)
const customQuery = computed(() => props.customQueryTitle)
const customChoose = computed(() => props.customChooseTitle)

const watchStop = watch(() => currentStep.value, (newValue: string) => {
    switch (newValue) {
        case 'choose': {
            statusQuery.value = 'finish'
            statusChoose.value = 'process'
            statusChallenge.value = 'wait'
            statusDone.value = 'wait'
        }
        break;
        case 'challenge': {
            statusQuery.value = 'finish'
            statusChoose.value = 'finish'
            statusChallenge.value = 'process'
            statusDone.value = 'wait'
        }
        break;
        case 'done': {
            statusQuery.value = 'finish'
            statusChoose.value = 'finish'
            statusChallenge.value = 'finish'
            statusDone.value = 'finish'
        }
        break;
        default: case 'query': {
            statusQuery.value = 'finish'
            statusChoose.value = 'wait'
            statusChallenge.value = 'wait'
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
        <a-step :status="statusQuery" :title="`${customQuery || t('pages.signIn.step1')}`">
            <template #icon>
                <loading-outlined v-if="currentStep === 'query' && isLoading" />
                <search-outlined v-else />
            </template>
        </a-step>
        <a-step :status="statusChoose" :title="`${customChoose || t('pages.signIn.step2')}`">
            <template #icon>
                <loading-outlined v-if="currentStep === 'choose' && isLoading" />
                <heart-outlined v-else />
            </template>
        </a-step>
        <a-step :status="statusChallenge" :title="t('pages.signIn.step3')">
            <template #icon>
                <loading-outlined v-if="currentStep === 'challenge' && isLoading" />
                <user-outlined v-else />
            </template>
        </a-step>
        <a-step :status="statusDone" :title="`${t('pages.signIn.step4')}`">
            <template #icon>
                <loading-outlined v-if="currentStep === 'done' && isLoading" />
                <smile-outlined v-else />
            </template>
        </a-step>
    </a-steps>
</template>

<style scoped>
</style>
