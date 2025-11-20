<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { GlobalOutlined, CloseOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { loggedIn, nullOrEmpty } from '../../common/helper'
import { makeRequest, RouterMetadata, RoutersResponse, RoutingPolicy } from '../../common/packetHandler'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'

const t = useI18n().t
const router = useRouter()

const loading = ref(false)

const routers: Ref<RouterMetadata[]> = ref([])
const fetchRouters = async () => {
    try {
        loading.value = true
        const resp = await makeRequest(t, '/admin', {
            action: "enumRouters",
        })
        if (resp.success && resp.response) {
            const data = resp.response as RoutersResponse
            if (data && Array.isArray(data.routers)) {
                routers.value = data.routers
            }
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
    await fetchRouters()
})

const columns = ref([
    {
        title: t('pages.manage.nodes.name'),
        dataIndex: 'name',
        key: 'name',
        sorter: (a: RouterMetadata, b: RouterMetadata) => ('' + (a.name || '')).localeCompare((b.name || '')),
    },
    {
        title: t('pages.manage.nodes.location'),
        dataIndex: 'location',
        key: 'location',
        sorter: (a: RouterMetadata, b: RouterMetadata) => ('' + (a.location || '')).localeCompare((b.location || '')),
    },
    {
        title: t('pages.manage.nodes.public'),
        dataIndex: 'public',
        key: 'public',
        sorter: (a: RouterMetadata, b: RouterMetadata) => (a.public ? 1 : 0) - (b.public ? 1 : 0)
    },
    {
        title: t('pages.manage.nodes.openPeering'),
        dataIndex: 'openPeering',
        key: 'openPeering',
        sorter: (a: RouterMetadata, b: RouterMetadata) => (a.openPeering ? 1 : 0) - (b.openPeering ? 1 : 0)
    },

    {
        title: t('pages.manage.nodes.autoPeering'),
        dataIndex: 'autoPeering',
        key: 'autoPeering',
        sorter: (a: RouterMetadata, b: RouterMetadata) => (a.autoPeering ? 1 : 0) - (b.autoPeering ? 1 : 0)
    },
    {
        title: t('pages.manage.nodes.sessionCapacity'),
        dataIndex: 'sessionCapacity',
        key: 'sessionCapacity',
        sorter: (a: RouterMetadata, b: RouterMetadata) => a.sessionCapacity - b.sessionCapacity
    },
    {
        title: 'IPv4',
        dataIndex: 'ipv4',
        key: 'ipv4',
        sorter: (a: RouterMetadata, b: RouterMetadata) => ('' + (a.ipv4 || '')).localeCompare((b.ipv4 || '')),
    },
    {
        title: 'IPv6',
        dataIndex: 'ipv6',
        key: 'ipv6',
        sorter: (a: RouterMetadata, b: RouterMetadata) => ('' + (a.ipv6 || '')).localeCompare((b.ipv6 || '')),
    },
    {
        title: 'IPv6 Link Local',
        dataIndex: 'ipv6LinkLocal',
        key: 'ipv6LinkLocal',
        sorter: (a: RouterMetadata, b: RouterMetadata) => ('' + (a.ipv6LinkLocal || '')).localeCompare((b.ipv6LinkLocal || '')),
    },
    {
        title: t('pages.manage.session.action'),
        dataIndex: 'action',
        key: 'action',
    }
])

const remove = async (record: RouterMetadata) => {
    try {
        loading.value = true
        await makeRequest(t, '/admin', {
            action: 'deleteRouter',
            router: record.uuid
        })
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
        fetchRouters()
    }
}

const modalVisible = ref(false)
const modalLoading = ref(false)
const modalForm = ref({
    name: '',
    description: '',
    location: '',
    public: true,
    openPeering: true,
    autoPeering: true,
    sessionCapacity: 30,
    callbackUrl: '',
    agentSecret: '',
    ipv4: '',
    ipv6: '',
    ipv6LinkLocal: '',
    linkTypes: ['wireguard'],
    extensions: ['mp-bgp', 'extended-nexthop'],
    allowedPolicies: [
        RoutingPolicy.FULL,
        RoutingPolicy.TRANSIT,
        RoutingPolicy.PEER,
        RoutingPolicy.DOWNSTREAM,
        RoutingPolicy.UPSTREAM
    ],
    uuid: ''
})

const addOrEdit = async () => {
    if (nullOrEmpty(modalForm.value.name) ||
        nullOrEmpty(modalForm.value.sessionCapacity) ||
        isNaN(Number(modalForm.value.sessionCapacity)) ||
        nullOrEmpty(modalForm.value.agentSecret) ||
        nullOrEmpty(modalForm.value.callbackUrl) ||
        !Array.isArray(modalForm.value.linkTypes) ||
        modalForm.value.linkTypes.length < 1 ||
        !Array.isArray(modalForm.value.allowedPolicies) ||
        modalForm.value.allowedPolicies.length < 1) {
        Modal.error({
            centered: true,
            title: t('pages.manage.nodes.addOrEdit'),
            content: t('pages.peering.inputValid'),
        })
        return
    }
    try {
        loading.value = true
        modalLoading.value = true
        const data = {
            action: 'setRouter',
            type: modalForm.value.uuid !== '' ? 'update' : 'add',
            name: modalForm.value.name,
            description: modalForm.value.description || null,
            location: modalForm.value.location || null,
            public: !!modalForm.value.public,
            openPeering: !!modalForm.value.openPeering,
            autoPeering: !!modalForm.value.autoPeering,
            sessionCapacity: Number(modalForm.value.sessionCapacity),
            callbackUrl: modalForm.value.callbackUrl,
            agentSecret: modalForm.value.agentSecret || null,
            ipv4: modalForm.value.ipv4 || null,
            ipv6: modalForm.value.ipv6 || null,
            ipv6LinkLocal: modalForm.value.ipv6LinkLocal || null,
            linkTypes: modalForm.value.linkTypes,
            extensions: modalForm.value.extensions,
            allowedPolicies: modalForm.value.allowedPolicies,
        }
        if (modalForm.value.uuid !== '') Object.assign(data, { router: modalForm.value.uuid })
        await makeRequest(t, '/admin', data)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
        modalLoading.value = false
        modalVisible.value = false
        fetchRouters()
    }
}

const showAddOrEdit = async (record?: RouterMetadata) => {
    modalVisible.value = true
    if (!record) {
        modalForm.value = {
            name: '',
            description: '',
            location: '',
            public: true,
            openPeering: true,
            autoPeering: true,
            sessionCapacity: 30,
            callbackUrl: '',
            agentSecret: '',
            ipv4: '',
            ipv6: '',
            ipv6LinkLocal: '',
            linkTypes: ['wireguard'],
            extensions: ['mp-bgp', 'extended-nexthop'],
            allowedPolicies: [
                RoutingPolicy.FULL,
                RoutingPolicy.TRANSIT,
                RoutingPolicy.PEER,
                RoutingPolicy.DOWNSTREAM,
                RoutingPolicy.UPSTREAM
            ],
            uuid: ''
        }
    } else {
        modalForm.value.name = record.name
        modalForm.value.description = record.description
        modalForm.value.location = record.location
        modalForm.value.public = record.public || false
        modalForm.value.openPeering = record.openPeering
        modalForm.value.autoPeering = record.autoPeering
        modalForm.value.sessionCapacity = record.sessionCapacity
        modalForm.value.callbackUrl = record.callbackUrl || ''
        modalForm.value.agentSecret = record.agentSecret || ''
        modalForm.value.ipv4 = record.ipv4
        modalForm.value.ipv6 = record.ipv6
        modalForm.value.ipv6LinkLocal = record.ipv6LinkLocal
        modalForm.value.linkTypes = record.linkTypes
        modalForm.value.extensions = record.extensions
        modalForm.value.allowedPolicies = [...record.allowedPolicies]
        modalForm.value.uuid = record.uuid
    }
}
</script>

<template>
    <div class="buttons">
        <a-button @click="showAddOrEdit()">
            <template #icon>
                <global-outlined />
            </template>
            {{ t('pages.manage.nodes.add') }}
        </a-button>
        <a-button @click="fetchRouters" :loading="loading" class="refresh-button">
            <template #icon>
                <reload-outlined />
            </template>
            {{ t('pages.metrics.refresh') }}
        </a-button>
    </div>
    <a-table :columns="columns" :data-source="routers" :loading="loading" bordered size="small"
        :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'location'">
                <router-location-avatar v-if="record.location" :router="record"
                    :hide-peering-dot="true"></router-location-avatar>
                <close-outlined v-else />
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
            <template v-else-if="column.key === 'public'">
                <check-circle-outlined v-if="record.public" />
                <close-outlined v-else />
            </template>
            <template v-else-if="column.key === 'openPeering'">
                <check-circle-outlined v-if="record.openPeering" />
                <close-outlined v-else />
            </template>
            <template v-else-if="column.key === 'autoPeering'">
                <check-circle-outlined v-if="record.autoPeering" />
                <close-outlined v-else />
            </template>
            <template v-if="column.key === 'action'">
                <span>
                    <a @click="showAddOrEdit(record)">{{ t('pages.manage.posts.edit') }}</a>
                    <a-divider type="vertical" />
                    <a-popconfirm placement="bottomRight" @confirm="remove(record)">
                        <template #title>
                            <p>{{ t('pages.manage.session.areYouSure') }}</p>
                        </template>
                        <a>{{ t('pages.manage.session.remove') }}</a>
                    </a-popconfirm>
                </span>
            </template>
        </template>
    </a-table>
    <a-modal v-model:open="modalVisible" :title="t('pages.manage.nodes.addOrEdit')" centered>
        <a-spin :spinning="modalLoading">
            <a-form :model="modalForm" class="modalForm">
                <a-form-item name="name" :label="t('pages.manage.nodes.name')">
                    <a-input v-model:value="modalForm.name" :placeholder="t('pages.manage.nodes.name')" />
                </a-form-item>
                <a-form-item name="description" :label="t('pages.manage.nodes.description')">
                    <a-textarea :rows="2" v-model:value="modalForm.description"
                        :placeholder="t('pages.manage.nodes.description')" />
                </a-form-item>
                <a-form-item name="location" :label="t('pages.manage.nodes.location')">
                    <a-input v-model:value="modalForm.location" :placeholder="t('pages.manage.nodes.location')" />
                </a-form-item>
                <a-form-item name="public" :label="t('pages.manage.nodes.public')">
                    <a-switch v-model:checked="modalForm.public" />
                </a-form-item>
                <a-form-item name="openPeering" :label="t('pages.manage.nodes.openPeering')">
                    <a-switch v-model:checked="modalForm.openPeering" />
                </a-form-item>
                <a-form-item name="autoPeering" :label="t('pages.manage.nodes.autoPeering')">
                    <a-switch v-model:checked="modalForm.autoPeering" />
                </a-form-item>
                <a-form-item name="sessionCapacity" :label="t('pages.manage.nodes.sessionCapacity')">
                    <a-input-number v-model:value="modalForm.sessionCapacity"
                        :placeholder="t('pages.manage.nodes.sessionCapacity')" />
                </a-form-item>
                <a-form-item name="callbackUrl" :label="t('pages.manage.nodes.callbackUrl')">
                    <a-input v-model:value="modalForm.callbackUrl" :placeholder="t('pages.manage.nodes.callbackUrl')" />
                </a-form-item>
                <a-form-item name="agentSecret" label="Agent Secret">
                    <a-input v-model:value="modalForm.agentSecret" placeholder="Agent Secret" />
                </a-form-item>
                <a-form-item name="ipv4" label="IPv4">
                    <a-input v-model:value="modalForm.ipv4" />
                </a-form-item>
                <a-form-item name="ipv6" label="IPv6">
                    <a-input v-model:value="modalForm.ipv6" />
                </a-form-item>
                <a-form-item name="ipv6LinkLocal" label="IPv6 Link Local">
                    <a-input v-model:value="modalForm.ipv6LinkLocal" />
                </a-form-item>
                <a-form-item :label="t('pages.peering.linkType')">
                    <a-checkbox-group v-model:value="modalForm.linkTypes">
                        <a-checkbox value="wireguard">{{ t('pages.peering[\'wireguard\']') }}</a-checkbox>
                        <a-checkbox value="openvpn">{{ t('pages.peering[\'openvpn\']') }}</a-checkbox>
                        <a-checkbox value="ipsec">{{ t('pages.peering[\'ipsec\']') }}</a-checkbox>
                        <a-checkbox value="gre">{{ t('pages.peering[\'gre\']') }}</a-checkbox>
                        <a-checkbox value="ip6gre">{{ t('pages.peering[\'ip6gre\']') }}</a-checkbox>
                        <a-checkbox value="direct">{{ t('pages.peering[\'direct\']') }}</a-checkbox>
                    </a-checkbox-group>
                </a-form-item>
                <a-form-item :label="t('pages.peering.bgpExtensions')">
                    <a-checkbox-group v-model:value="modalForm.extensions">
                        <a-checkbox value="mp-bgp">{{ t('pages.peering[\'mp-bgp\']') }}</a-checkbox>
                        <a-checkbox value="extended-nexthop">{{ t('pages.peering[\'extended-nexthop\']') }}</a-checkbox>
                    </a-checkbox-group>
                </a-form-item>
                <a-form-item :label="t('pages.manage.nodes.allowedPolicies')">
                    <a-checkbox-group v-model:value="modalForm.allowedPolicies">
                        <a-checkbox :value="RoutingPolicy.FULL">{{ t('pages.peering.routingPolicyTypes.FULL') }}</a-checkbox>
                        <a-checkbox :value="RoutingPolicy.TRANSIT">{{ t('pages.peering.routingPolicyTypes.TRANSIT') }}</a-checkbox>
                        <a-checkbox :value="RoutingPolicy.PEER">{{ t('pages.peering.routingPolicyTypes.PEER') }}</a-checkbox>
                        <a-checkbox :value="RoutingPolicy.DOWNSTREAM">{{ t('pages.peering.routingPolicyTypes.DOWNSTREAM') }}</a-checkbox>
                        <a-checkbox :value="RoutingPolicy.UPSTREAM">{{ t('pages.peering.routingPolicyTypes.UPSTREAM') }}</a-checkbox>
                    </a-checkbox-group>
                </a-form-item>
            </a-form>
        </a-spin>
        <template #footer>
            <a-spin :spinning="modalLoading">
                <a-button style="margin-right:10px" type="primary" @click="addOrEdit()">{{ t('pages.manage.config.save')
                    }}</a-button>
                <a-button @click="modalVisible = false">{{ t('pages.manage.posts.close') }}</a-button>
            </a-spin>
        </template>
    </a-modal>
</template>

<style scoped>
.buttons {
    margin: 20px;
    display: flex;
    gap: 10px;
}

.refresh-button {
    margin-left: 10px;
}

.small-text {
    font-size: 12px;
}
</style>
