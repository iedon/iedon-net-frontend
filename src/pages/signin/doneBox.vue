<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const t = useI18n().t
const router = useRouter()

const asn = ref('')
const person = ref('')

onMounted(() => {
    asn.value = localStorage.getItem('asn') || ''
    person.value = localStorage.getItem('person') || ''
})

const manageSessions = () => { router.replace({ path: '/manage' }) }
const topPage = () => { router.replace({ path: '/' }) }
</script>

<template>
    <a-result status="success" :title="`${t('pages.signIn.welcomeBack')} ${person || asn || ''}`"
        :sub-title="t('pages.signIn.step4Introduction')"
    >
        <template #extra>
            <a-button key="manageSessions" type="primary" @click="manageSessions">{{ t('pages.signIn.manageSessions') }}</a-button>
            <a-button key="topPage" @click="topPage">{{ t('pages.signIn.topPage') }}</a-button>
        </template>
    </a-result>
</template>

<style scoped>
</style>
