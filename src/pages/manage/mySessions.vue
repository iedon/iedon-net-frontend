<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { ApiOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { loggedIn } from '../../common/helper'
import { makeRequest, RouterMetadata, RoutersResponse, SessionMetadata, SessionsResponse } from '../../common/packetHandler'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'
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

interface Session extends SessionMetadata {
    routerJoined?: RouterMetadata
}

const sessions: Ref<Session[]> = ref([])
const routers: Ref<RouterMetadata[]> = ref([])

const fetchSessions = async () => {
    try {
        loading.value = true

        const routersResp = await makeRequest(t, '/list', {
            type: "routers",
        }) as RoutersResponse

        if (Array.isArray(routersResp.routers)) {
            routers.value = routersResp.routers.sort((a, b) => ('' + a.name).localeCompare(b.name))
            localStorage.setItem('routers', JSON.stringify(routers.value))
        }

        const resp = await makeRequest(t, '/session', {
            action: "enum",
        }) as SessionsResponse

        const newData: Session[] = []

        if (Array.isArray(resp.sessions))  {
            resp.sessions.forEach(s => newData.push({ ...s, routerJoined: routers.value.find(r => r.uuid === s.router) }))
            sessions.value = newData
        }

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }
    await fetchSessions()
})

const modalVisible = ref(false)

const simpleActionHandler = async (session: Session, action: 'delete' | 'enable' | 'disable') => {
    try {
        loading.value = true

        await makeRequest(t, '/session', {
            action,
            router: session.router,
            session: session.uuid,
        })

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
        fetchSessions()
    }
}

const enable = (session: Session) => simpleActionHandler(session, 'enable')

const disable = (session: Session) => simpleActionHandler(session, 'disable')

const remove = (session: Session) => simpleActionHandler(session, 'delete')

const modalLoading = ref(false)
const modalRouterName = ref('')
const modalIpv4 = ref('')
const modalIpv6 = ref('')
const modalIpv6LinkLocal = ref('')
const modalHtml = ref('')
const modalInfoHtml = ref('')
const modalInterface = ref('')
const modalExtensions = ref('')
const modalEndpoint = ref('')
const modalRouter: Ref<RouterMetadata | undefined> = ref(undefined)
const info = async (session: Session, event: MouseEvent) => {
    event.stopPropagation()

    try {

        modalRouterName.value = ''
        modalIpv4.value = ''
        modalIpv6.value = ''
        modalIpv6LinkLocal.value = ''
        modalHtml.value = ''
        modalInterface.value = ''
        modalEndpoint.value = ''
        modalRouter.value = undefined

        modalRouter.value = session.routerJoined || undefined
        modalRouterName.value = session.routerJoined?.name || t('pages.manage.session.info')
        modalIpv4.value = session.routerJoined?.ipv4 || ''
        modalIpv6.value = session.routerJoined?.ipv6 || ''
        modalIpv6LinkLocal.value = session.routerJoined?.ipv6LinkLocal || ''
        modalEndpoint.value = session.endpoint
        modalInterface.value = session.interface
        modalExtensions.value = ''
        session.extensions.forEach((e, i) => {
            if (i !== 0) modalExtensions.value += ', '
            modalExtensions.value += t(`pages.peering['${e}']`)
        })
        modalHtml.value = session.data !== '' && session.data.info ? md.render(session.data.info) : ''
    } catch (error) {
        console.error(error)
    }
    modalVisible.value = true

    try {
        modalLoading.value = true

        const resp = await makeRequest(t, '/session', {
            action: 'query',
            router: session.router,
            session: session.uuid,
        }) as string

        if (typeof resp === 'string') modalInfoHtml.value = resp === '' ? '' : md.render(resp)

    } catch (error) {
        console.error(error)
    } finally {
        modalLoading.value = false
    }
}

const columns = ref([
  {
    title: t('pages.manage.session.node'),
    dataIndex: 'node',
    key: 'node',
    sorter: (a: Session, b: Session) => ('' + (a.routerJoined?.name || '')).localeCompare((b.routerJoined?.name || '')),
  },
  {
    title: t('pages.manage.session.type'),
    dataIndex: 'type',
    key: 'type',
    sorter: (a: Session, b: Session) => ('' + a.type).localeCompare(b.type)
  },
  {
    title: 'IPv4',
    dataIndex: 'ipv4',
    key: 'ipv4',
    sorter: (a: Session, b: Session) => ('' + (a.ipv4 || '')).localeCompare((b.ipv4 || '')),
  },
  {
    title: 'IPv6',
    dataIndex: 'ipv6',
    key: 'ipv6',
    sorter: (a: Session, b: Session) => ('' + (a.ipv6 || '')).localeCompare((b.ipv6 || '')),
  },
  {
    title: 'IPv6 Link Local',
    dataIndex: 'ipv6LinkLocal',
    key: 'ipv6LinkLocal',
        sorter: (a: Session, b: Session) => ('' + (a.ipv6LinkLocal || '')).localeCompare((b.ipv6LinkLocal || '')),
  },
  {
    title: t('pages.manage.session.status'),
    dataIndex: 'status',
    key: 'status',
    sorter: (a: Session, b: Session) => a.status - b.status
  },
  {
    title: t('pages.manage.session.action'),
    dataIndex: 'action',
    key: 'action',
  }
])

const redirectToNodes = () => {
    router.push({ path: '/nodes' })
}

const customRow = (record: any, index: number) => {
    return {
        onClick: (event: MouseEvent) => info(record, event)
    }
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation()

const searchKeywords = ref('')
const filteredSessions = computed(() => {
    if (searchKeywords.value.length === 0) return sessions.value
    return sessions.value.filter(
        (session: Session) =>
            (session.ipv4 !== undefined && session.ipv4 !== null && session.ipv4.indexOf(searchKeywords.value) !== -1) ||
            (session.ipv6 !== undefined && session.ipv6 !== null && session.ipv6.indexOf(searchKeywords.value) !== -1) ||
            (session.ipv6LinkLocal !== undefined && session.ipv6LinkLocal !== null && session.ipv6LinkLocal.indexOf(searchKeywords.value) !== -1)
    )
})
</script>

<template>
    <div class="buttons">
        <a-button @click="redirectToNodes">
            <template #icon>
                <api-outlined />
            </template>
            {{ t('pages.manage.session.newPeeringSession') }}
        </a-button>
        <a-input-search v-model:value="searchKeywords" :placeholder="t('pages.manage.session.search')" class="searchBox" enter-button />
    </div>
    <a-table :columns="columns" :data-source="filteredSessions" :loading="loading" bordered size="small" :customRow="customRow">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'node'">
                <router-location-avatar :router="record.routerJoined" :hide-peering-dot="true"></router-location-avatar>
                <span class="node small-text">
                    {{ record.routerJoined?.name }}
                </span>
            </template>
            <template v-if="column.key === 'type'">
                <span class="small-text">
                    {{ t(`pages.peering['${record.type}']`) }}
                </span>
            </template>
            <template v-else-if="column.key === 'status'">
                <span>
                    <a-tag :color="record.status === -1 ? 'volcano' : record.status === 0 ? 'geekblue' : 'green'">
                        {{ t(`pages.manage.session.statusCode['${record.status}']`) }}
                    </a-tag>
                </span>
            </template>
            <template v-else-if="column.key === 'ipv4'">
                <span v-if="record.ipv4" class="small-text">{{ record.ipv4 }}</span>
                <close-outlined v-else />
            </template>
            <template v-else-if="column.key === 'ipv6'">
                <span v-if="record.ipv6" class="small-text">{{ record.ipv6 }}</span>
                <close-outlined v-else />
            </template>
            <template v-else-if="column.key === 'ipv6LinkLocal'">
                <span v-if="record.ipv6LinkLocal" class="small-text">{{ record.ipv6LinkLocal }}</span>
                <close-outlined v-else />
            </template>
            <template v-else-if="column.key === 'action'">
            <span>
                <a @click="info(record, $event)">{{ t('pages.manage.session.info') }}</a>
                <a-divider type="vertical" />
                <a-popconfirm v-if="record.status === 1" placement="bottomRight" @confirm="disable(record)">
                    <template #title>
                        <p>{{ t('pages.manage.session.areYouSure') }}</p>
                    </template>
                    <a @click="stopPropagation">{{ t('pages.manage.session.disable') }}</a>
                </a-popconfirm>
                <a-popconfirm v-else-if="record.status === 0" placement="bottomRight" @confirm="enable(record)">
                    <template #title>
                        <p>{{ t('pages.manage.session.areYouSure') }}</p>
                    </template>
                    <a @click="stopPropagation">{{ t('pages.manage.session.enable') }}</a>
                </a-popconfirm>
                <a-divider v-if="record.status === 1 || record.status === 0" type="vertical" />
                <a-popconfirm placement="bottomRight" @confirm="remove(record)">
                    <template #title>
                        <p>{{ t('pages.manage.session.areYouSure') }}</p>
                    </template>
                    <a @click="stopPropagation">{{ t('pages.manage.session.remove') }}</a>
                </a-popconfirm>
            </span>
            </template>
        </template>
    </a-table>
    <a-modal v-model:visible="modalVisible" :title="modalRouterName" centered>
        <div class="avatar-container" v-if="modalRouter">
            <router-location-avatar :router="modalRouter" :hide-peering-dot="true"></router-location-avatar>
        </div>
        <ul class="detail">
            <li v-if="modalIpv4 !== ''">IPv4: <code>{{ modalIpv4 }}</code></li>
            <li v-if="modalIpv6 !== ''">IPv6: <code>{{ modalIpv6 }}</code></li>
            <li v-if="modalIpv6LinkLocal !== ''">IPv6 Link Local: <code>{{ modalIpv6LinkLocal }}</code></li>
            <li v-if="modalInterface !== ''">{{ t('pages.peering.interface') }}: <code>{{ modalInterface }}</code></li>
            <li v-if="modalEndpoint">{{ t('pages.peering.endpoint') }}: <code>{{ modalEndpoint }}</code></li>
            <li v-if="modalExtensions !== ''">{{ t('pages.peering.bgpExtensions') }}: <code>{{ modalExtensions }}</code></li>
        </ul>
        <div class="desc" v-if="modalHtml !== ''" v-html="modalHtml"></div>
        <a-spin :spinning="modalLoading">
            <div class="desc" v-if="modalInfoHtml !== ''" v-html="modalInfoHtml"></div>
        </a-spin>
        <template #footer>
            <a-button type="primary" @click="modalVisible=false">{{ t('pages.manage.session.ok') }}</a-button>
        </template>
    </a-modal>
</template>

<style scoped>
.buttons {
    margin: 20px;
}
.searchBox {
    max-width: 500px;
    min-width: 150px;
    width: 30%;
    float: right;
}
.avatar-container {
    text-align: center;
}
.node {
    margin-left: 15px;
    vertical-align: middle;
}
.small-text {
    font-size: 12px;
}
.detail, .desc, .desc:deep(pre) {
    user-select: text;
}
.desc:deep(pre) {
    border: #eee 1px solid;
    border-radius: 4px;
    margin-top: 10px;
    padding: 10px;
    max-height: 200px;
    font-size: 12px;
}
.detail {
    margin-top: 20px;
    width: 100%;
}
.detail code {
    background-color: #f1f1f1;
    border-radius: 5px;
    color: #666;
    font-size: 13px;
    padding: 0.15em 0.3em;
    margin-left: 10px;
    line-height: 200%;
}
.desc:deep(code) {
    font-size: 12px;
}
.desc:deep(p) {
    margin-bottom: 0.5em;
}
</style>
