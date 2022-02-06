<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { RouterMetadata } from '../../common/packetHandler'

const t = useI18n().t
const router = useRouter()

const props = defineProps<{
    router: RouterMetadata
}>()

const manageSessions = () => { router.replace({ path: '/manage' }) }
const topPage = () => { router.replace({ path: '/' }) }
</script>

<template>
    <a-result status="success" :title="t('pages.peering.thankYou')"
        :sub-title="props.router.autoPeering ? t('pages.peering.step4Introduction') : t('pages.peering.step4IntroductionReview')"
    >
        <template #extra>
            <a-button key="manageSessions" type="primary" @click="manageSessions">{{ t('pages.signIn.manageSessions') }}</a-button>
            <a-button key="topPage" @click="topPage">{{ t('pages.signIn.topPage') }}</a-button>
        </template>
    </a-result>
</template>

<style scoped>
</style>
