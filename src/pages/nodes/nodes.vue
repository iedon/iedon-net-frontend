<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { ApiOutlined, LoadingOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { makeRequest, RouterMetadata, RoutersResponse } from '../../common/packetHandler'
import { loggedIn } from '../../common/helper'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'
import "ant-design-vue/es/modal/style/css"
import "ant-design-vue/es/message/style/css"

//@ts-ignore
import markdown_it from 'markdown-it'
//@ts-ignore
import mila from 'markdown-it-link-attributes'

const t = useI18n().t
const router = useRouter()

const md = new markdown_it()
md.use(mila, {
  attrs: {
    target: "_blank"
  },
})

const loading = ref(false)
const routers: Ref<RouterMetadata[]> = ref([])

const fetchRouters = async () => {
    try {
        loading.value = true

        const resp = await makeRequest(t, '/list', {
            type: "routers",
        }) as RoutersResponse

        if (Array.isArray(resp.routers)) {
            routers.value = resp.routers.sort((a, b) => ('' + a.name).localeCompare(b.name))
            localStorage.setItem('routers', JSON.stringify(routers.value))
        }
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    try {
        const oldRouters = localStorage.getItem('routers')
        if (oldRouters) routers.value = JSON.parse(oldRouters)
    } catch (error) {
        console.error(error)
    }
    await fetchRouters()
})

const copyRouterDescription = async (r: RouterMetadata) => {
    try {
        await navigator.clipboard.writeText(JSON.stringify(r))
        message.info(t('pages.nodes.copied'))
    } catch (error) {
        console.error(error)
    }
}

const redirectToPeering = (r: RouterMetadata) => {
    if (!r.openPeering) {
        Modal.error({
            title: r.name,
            content: t('pages.nodes.statusClosed')
        })
        return
    }
    if (r.sessionCount >= r.sessionCapacity) {
        Modal.error({
            title: r.name,
            content: t('pages.nodes.statusFull')
        })
        return
    }
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }
    router.push({ path: `/nodes/${r.uuid}` })
}

</script>

<template>
    <h1 class="header">{{ t('pages.nodes.nodes') }}</h1>
    <a-divider dashed></a-divider>
    <section id="routers">
        <a-card hoverable class="card" v-for="r in routers" :key="r.uuid" @click="redirectToPeering(r)">
            <template #actions>
                <copy-outlined @click.stop="copyRouterDescription(r)" />
                <api-outlined @click.stop="redirectToPeering(r)" />
            </template>
            <a-card-meta :title="r.name" :description="`${r.openPeering ? (r.sessionCount < r.sessionCapacity ? (r.autoPeering ? t('pages.nodes.statusOpen') : t('pages.nodes.statusOpenManuallyReview')) : t('pages.nodes.statusFull')) : t('pages.nodes.statusClosed')} ${t('pages.nodes.statusCapacity')}: ${r.sessionCount}/${r.sessionCapacity}`">
                <template #avatar>
                    <router-location-avatar :router="r"></router-location-avatar>
                </template>
            </a-card-meta>
            <ul class="detail">
                <li v-if="r.ipv4">IPv4<code>{{ r.ipv4 }}</code></li>
                <li v-if="r.ipv6">IPv6<code>{{ r.ipv6 }}</code></li>
                <li v-if="r.ipv6LinkLocal">IPv6 Link Local<code>{{ r.ipv6LinkLocal }}</code></li>
            </ul>
            <div class="desc" v-if="r.description" v-html="md.render(r.description)"></div>
        </a-card>
    </section>
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
#routers {
    margin: 10px auto 100px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
}
.card {
    margin: 10px;
    user-select: text;
}
.card:deep(.ant-card-body) {
    min-height: 280px;
}
.card > * {
    display: block;
}
.card > span {
    margin-bottom: 1rem;
}
.card:deep(.ant-card-meta-title) {
    font-size: 24px;
}
.card .detail {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}
.card .detail code, .card .desc:deep(code) {
    background-color: #f1f1f1;
    border-radius: 5px;
    color: #666;
    font-size: 13px;
    padding: 0.15em 0.3em;
    margin-left: 10px;
    line-height: 200%;
}
.card .desc {
    margin-top: 20px;
    min-width: 300px;
}
.card .desc:deep(p) {
    margin-bottom: 0.5em;
}
.card:deep(.ant-card-meta-detail) > div:not(:last-child) {
    margin-bottom: 0;
}
</style>
