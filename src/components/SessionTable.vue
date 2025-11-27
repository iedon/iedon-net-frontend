<script setup lang="ts">
import { computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    CloseOutlined,
    SearchOutlined,
    CaretRightOutlined,
    PauseOutlined,
    CheckCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
    ReloadOutlined
} from '@ant-design/icons-vue'
import { SessionStatus, RouterMetadata, SessionMetadata } from '../common/packetHandler'
import { formatRelativeTime, deriveProbeStatuses, getProbeStatusWeight, themeName, ProbeStatusKey } from '../common/helper'
import RouterLocationAvatar from './RouterLocationAvatar.vue'

const t = useI18n().t

interface Session extends SessionMetadata {
    routerJoined?: RouterMetadata
    asn?: string
}

// Props
const props = defineProps({
    sessions: {
        type: Array as PropType<Session[]>,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    showAsn: {
        type: Boolean,
        default: false
    },
    showActions: {
        type: Boolean,
        default: true
    },
    isAdminMode: {
        type: Boolean,
        default: false
    },
    searchKeywords: {
        type: String,
        default: ''
    }
})

// Emits
const emit = defineEmits<{
    viewMetrics: [session: Session, event: MouseEvent]
    enable: [session: Session]
    disable: [session: Session]
    remove: [session: Session]
    approve: [session: Session]
    edit: [session: Session]
}>()

// Computed columns
const columns = computed(() => {
    const baseColumns: any[] = [
        {
            title: t('pages.manage.session.node'),
            dataIndex: 'node',
            key: 'node',
            sorter: (a: Session, b: Session) => ('' + (a.routerJoined?.name || '')).localeCompare((b.routerJoined?.name || ''))
        }
    ]

    if (props.showAsn) {
        baseColumns.push({
            title: 'ASN',
            dataIndex: 'asn',
            key: 'asn',
            align: 'center',
            sorter: (a: Session, b: Session) => Number(a.asn || 0) - Number(b.asn || 0)
        })
    }

    baseColumns.push(
        {
            title: t('pages.manage.session.type'),
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            sorter: (a: Session, b: Session) => ('' + a.type).localeCompare(b.type)
        },
        {
            title: 'IP',
            dataIndex: 'addresses',
            key: 'addresses',
            align: 'center',
            sorter: (a: Session, b: Session) => getAddressSortValue(a).localeCompare(getAddressSortValue(b))
        },
        {
            title: t('pages.metrics.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            sorter: (a: Session, b: Session) => {
                const aTime = new Date(a.createdAt || 0).getTime()
                const bTime = new Date(b.createdAt || 0).getTime()
                return bTime - aTime // Descending order (newest first)
            }
        },
        {
            title: t('pages.manage.session.status'),
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            sorter: (a: Session, b: Session) => {
                return getStatusSortValue(b) - getStatusSortValue(a) // Descending order (better status first)
            }
        },
        {
            title: t('pages.manage.session.probeStatus'),
            dataIndex: 'probe',
            key: 'probe',
            align: 'center',
            sorter: (a: Session, b: Session) => getProbeSortValue(b) - getProbeSortValue(a)
        }
    )

    if (props.showActions) {
        baseColumns.push({
            title: t('pages.manage.session.action'),
            dataIndex: 'action',
            key: 'action'
        })
    }

    return baseColumns
})

// Filtered sessions
const filteredSessions = computed(() => {
    if (props.searchKeywords.length === 0) return props.sessions
    return props.sessions.filter((session: Session) => {
        const searchLower = props.searchKeywords.toLowerCase()
        return (
            (session.asn !== undefined && session.asn !== null && session.asn.toString().toLowerCase().indexOf(searchLower) !== -1) ||
            (session.ipv4 !== undefined && session.ipv4 !== null && session.ipv4.toLowerCase().indexOf(searchLower) !== -1) ||
            (session.ipv6 !== undefined && session.ipv6 !== null && session.ipv6.toLowerCase().indexOf(searchLower) !== -1) ||
            (session.ipv6LinkLocal !== undefined && session.ipv6LinkLocal !== null && session.ipv6LinkLocal.toLowerCase().indexOf(searchLower) !== -1) ||
            (session.routerJoined?.name !== undefined && session.routerJoined.name.toLowerCase().indexOf(searchLower) !== -1)
        )
    })
})

// Event handlers
const handleViewMetrics = (session: Session, event: MouseEvent) => {
    emit('viewMetrics', session, event)
}

const handleEnable = (session: Session) => {
    emit('enable', session)
}

const handleDisable = (session: Session) => {
    emit('disable', session)
}

const handleRemove = (session: Session) => {
    emit('remove', session)
}

const handleApprove = (session: Session) => {
    emit('approve', session)
}

const handleEdit = (session: Session) => {
    emit('edit', session)
}

const customRow = (record: any, index: number) => {
    return {
        onClick: (event: MouseEvent) => handleViewMetrics(record, event)
    }
}

const stopPropagation = (event: MouseEvent) => event.stopPropagation()

// Status color mapping
const getStatusColor = (status: SessionStatus) => {
    switch (status) {
        case SessionStatus.ENABLED:
            return 'green'
        case SessionStatus.DISABLED:
            return 'geekblue'
        case SessionStatus.PENDING_APPROVAL:
            return 'orange'
        case SessionStatus.PROBLEM:
            return 'volcano'
        case SessionStatus.QUEUED_FOR_SETUP:
            return 'blue'
        case SessionStatus.QUEUED_FOR_DELETE:
            return 'red'
        case SessionStatus.TEARDOWN:
            return 'gray'
        case SessionStatus.DELETED:
            return 'default'
        default:
            return 'default'
    }
}

// BGP Status processing
const getBgpStatusDisplay = (session: Session) => {
    if (session.status !== SessionStatus.ENABLED || !session.bgpStatus || !Array.isArray(session.bgpStatus) || session.bgpStatus.length === 0) {
        return null
    }

    // sort by type: ipv4, ipv6, mpbgp
    session.bgpStatus.sort((a, b) => {
        const typeOrder = { 'ipv4': 1, 'ipv6': 2, 'mpbgp': 3, '': 4 }
        return (typeOrder[a.type || ''] || 5) - (typeOrder[b.type || ''] || 5)
    })

    return session.bgpStatus.map((bgp, index) => {
        const firstWord = bgp.info ? bgp.info.split(' ')[0] : 'Unknown'
        const statusText = t(`pages.metrics.bgpStatus['${bgp.info?.split(' ')[0] || 'Unknown'}']`)

        // For IPv4 and IPv6 types, show formatted display with protocol prefix
        if (bgp.type === 'ipv4') {
            return {
                text: statusText,
                color: firstWord === 'Established' ? 'green' : 'red',
                key: `${session.uuid}-bgp-${index}`,
                type: 'ipv4',
                connected: firstWord === 'Established'
            }
        } else if (bgp.type === 'ipv6') {
            return {
                text: statusText,
                color: firstWord === 'Established' ? 'green' : 'red',
                key: `${session.uuid}-bgp-${index}`,
                type: 'ipv6',
                connected: firstWord === 'Established'
            }
        } else {
            // For mpbgp or empty type, keep current format
            return {
                text: statusText,
                color: firstWord === 'Established' ? 'green' : 'red',
                key: `${session.uuid}-bgp-${index}`,
                connected: firstWord === 'Established'
            }
        }
    })
}

const getAddressSortValue = (session: Session) => {
    return [session.ipv4 || '', session.ipv6 || '', session.ipv6LinkLocal || ''].join('|')
}

// Helper function for sorting status
const getStatusSortValue = (session: Session) => {
    const probeScore = getProbeSortValue(session)
    const bgpDisplay = getBgpStatusDisplay(session)
    if (bgpDisplay) {
        const establishedCount = bgpDisplay.filter(bgp => bgp.text === 'Established').length
        const totalCount = bgpDisplay.length
        // Composite sort value: session status * 1000 + established count * 10 + total count + probe signal
        return session.status * 1000 + establishedCount * 10 + totalCount + probeScore
    }
    return session.status * 1000 + probeScore
}

const PROBE_STATUS_ICONS: Record<ProbeStatusKey, any> = {
    testedOk: CheckCircleOutlined,
    noRouting: CloseCircleOutlined,
    nat: ExclamationCircleOutlined,
    notAvailable: ClockCircleOutlined
}

const getProbeStatusDisplay = (session: Session) => {
    const statuses = deriveProbeStatuses(session.probe || null)
    if (!statuses.length) return []
    return statuses.map(status => ({
        ...status,
        label: t(`pages.metrics.probeStatus.labels.${status.key}`),
        description: t(`pages.metrics.probeStatus.descriptions.${status.key}`),
        color: PROBE_STATUS_COLORS[status.key],
        icon: PROBE_STATUS_ICONS[status.key],
        timestamp: status.timestamp
    }))
}

const getProbeSortValue = (session: Session) => {
    const statuses = deriveProbeStatuses(session.probe || null)
    if (!statuses.length) return 0
    return statuses.reduce((acc, status) => acc + getProbeStatusWeight(status.key), 0)
}

const PROBE_STATUS_COLORS: Record<ProbeStatusKey, string> = {
  testedOk: 'green',
  noRouting: 'red',
  nat: 'orange',
  notAvailable: 'default'
}
</script>

<template>
    <a-table class="session-table" :class="themeName" :columns="columns" :data-source="filteredSessions"
        :loading="loading" bordered size="small" :customRow="customRow" :rowClassName="() => 'clickable'"
        :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record }">
            <!-- Node Column -->
            <template v-if="column.key === 'node'">
                <div class="avatar-container">
                    <router-location-avatar :router="record.routerJoined" :hide-peering-dot="true" />
                    <span class="node small-text">
                        {{ record.routerJoined?.name }}
                    </span>
                </div>
            </template>

            <!-- ASN Column -->
            <template v-else-if="column.key === 'asn'">
                <span class="small-text">{{ record.asn }}</span>
            </template>

            <!-- Type Column -->
            <template v-else-if="column.key === 'type'">
                <span class="small-text">
                    {{ t(`pages.peering['${record.type}']`) }}
                </span>
            </template>

            <!-- IP Addresses Column -->
            <template v-else-if="column.key === 'addresses'">
                <div class="ip-stack small-text">
                    <div class="ip-row">
                        <span class="ip-label">IPv4</span>
                        <span v-if="record.ipv4" class="ip-value">{{ record.ipv4 }}</span>
                        <span v-else class="ip-empty"><close-outlined /></span>
                    </div>
                    <div class="ip-row">
                        <span class="ip-label">IPv6</span>
                        <span v-if="record.ipv6" class="ip-value">{{ record.ipv6 }}</span>
                        <span v-else class="ip-empty"><close-outlined /></span>
                    </div>
                    <div class="ip-row">
                        <span class="ip-label">Link</span>
                        <span v-if="record.ipv6LinkLocal" class="ip-value">{{ record.ipv6LinkLocal }}</span>
                        <span v-else class="ip-empty"><close-outlined /></span>
                    </div>
                </div>
            </template>
            
            <!-- Status Column -->
            <template v-else-if="column.key === 'status'">
                <template v-if="getBgpStatusDisplay(record)">
                    <!-- Show detailed BGP status when available -->
                    <div class="bgpStatus" v-for="bgpStatus in getBgpStatusDisplay(record)" :key="bgpStatus.key">
                        <a-tag v-if="bgpStatus.type === 'ipv4'" :bordered="false" :color="bgpStatus.color"
                            class="status-tag">
                            <template #icon v-if="!bgpStatus.connected">
                                <reload-outlined :spin="true" />
                            </template>
                            <span>V4</span>
                            <a-divider type="vertical"
                                :style="`margin: 0 4px;font-size:10px`" />
                            <span>{{ bgpStatus.text }}</span>
                        </a-tag>
                        <a-tag v-else-if="bgpStatus.type === 'ipv6'" :bordered="false" :color="bgpStatus.color"
                            class="status-tag">
                            <template #icon v-if="!bgpStatus.connected">
                                <reload-outlined :spin="true" />
                            </template>
                            <span>V6</span>
                            <a-divider type="vertical"
                                :style="`margin: 0 4px;font-size:10px`" />
                            <span>{{ bgpStatus.text }}</span>
                        </a-tag>
                        <a-tag v-else :color="bgpStatus.color" :bordered="false" class="status-tag">
                            <template #icon v-if="!bgpStatus.connected">
                                <reload-outlined :spin="true" />
                            </template>
                            {{ bgpStatus.text }}
                        </a-tag>
                    </div>
                </template>
                <template v-else>
                    <!-- Show regular status -->
                     <div class="bgpStatus">
                        <a-tag :bordered="false" :color="getStatusColor(record.status)" class="status-tag">
                            {{ t(`pages.manage.session.statusCode['${record.status}']`) }}
                        </a-tag>
                    </div>
                </template>
            </template>

            <!-- Probe Status Column -->
            <template v-else-if="column.key === 'probe'">
                <template v-if="getProbeStatusDisplay(record).length">
                    <div class="probe-status-compact">
                        <a-tooltip
                            v-for="probeStatus in getProbeStatusDisplay(record)"
                            :key="`${record.uuid}-${probeStatus.version}`"
                            :title="`${probeStatus.description}${probeStatus.timestamp ? ` (${new Date(probeStatus.timestamp * 1000).toLocaleString()})` : '' }`"
                        >
                            <a-tag :bordered="false" :color="probeStatus.color" class="probe-tag compact">
                                <template #icon>
                                    <component :is="probeStatus.icon" v-if="probeStatus.color !== 'default' && probeStatus.color !== 'green'" />
                                </template>
                                <span>{{ probeStatus.version === 'ipv4' ? 'V4' : 'V6' }}</span>
                                <a-divider type="vertical"
                                    :style="`margin: 0 4px;font-size:10px`" />
                                <span>{{ probeStatus.label }}</span>
                            </a-tag>
                        </a-tooltip>
                    </div>
                </template>
                <span v-else class="small-text muted">
                    {{ t('pages.metrics.probeStatus.labels.notAvailable') }}
                </span>
            </template>

            <!-- Created At Column -->
            <template v-else-if="column.key === 'createdAt'">
                <span v-if="record.createdAt" class="small-text" :title="new Date(record.createdAt).toLocaleString()">
                    {{ formatRelativeTime(record.createdAt, t) }}
                </span>
                <span v-else class="small-text">{{ t('pages.metrics.notAvailable') }}</span>
            </template>
            
            <!-- Action Column -->
            <template v-else-if="column.key === 'action'">
                <a-button-group size="small">
                    <!-- View Metrics Button -->
                    <a-tooltip :title="t('pages.manage.session.viewMetrics')">
                        <a-button type="primary" size="small" @click="handleViewMetrics(record, $event)">
                            <search-outlined />
                        </a-button>
                    </a-tooltip>

                    <template v-if="isAdminMode">
                        <!-- Admin Actions -->
                        <a-popconfirm
                            v-if="record.status === SessionStatus.ENABLED || record.status === SessionStatus.PROBLEM"
                            placement="bottomRight" :title="t('pages.manage.session.areYouSure')"
                            @confirm="handleDisable(record)">
                            <a-tooltip :title="t('pages.manage.session.disable')">
                                <a-button size="small" @click="stopPropagation">
                                    <pause-outlined />
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>

                        <a-popconfirm
                            v-else-if="record.status === SessionStatus.DISABLED || record.status === SessionStatus.TEARDOWN"
                            placement="bottomRight" :title="t('pages.manage.session.areYouSure')"
                            @confirm="handleEnable(record)">
                            <a-tooltip :title="t('pages.manage.session.enable')">
                                <a-button size="small" @click="stopPropagation">
                                    <caret-right-outlined />
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>

                        <a-popconfirm v-else-if="record.status === SessionStatus.PENDING_APPROVAL"
                            placement="bottomRight" :title="t('pages.manage.session.areYouSure')"
                            @confirm="handleApprove(record)">
                            <a-tooltip :title="t('pages.manage.session.approve')">
                                <a-button size="small" @click="stopPropagation">
                                    <check-circle-outlined />
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>
                    </template>

                    <template v-else>
                        <!-- User Actions -->
                        <a-popconfirm
                            v-if="record.status === SessionStatus.ENABLED || record.status === SessionStatus.PROBLEM"
                            placement="bottomRight" :title="t('pages.manage.session.areYouSure')"
                            @confirm="handleDisable(record)">
                            <a-tooltip :title="t('pages.manage.session.disable')">
                                <a-button size="small" @click="stopPropagation">
                                    <pause-outlined />
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>

                        <a-popconfirm v-else-if="record.status === SessionStatus.DISABLED" placement="bottomRight"
                            :title="t('pages.manage.session.areYouSure')" @confirm="handleEnable(record)">
                            <a-tooltip :title="t('pages.manage.session.enable')">
                                <a-button size="small" @click="stopPropagation">
                                    <caret-right-outlined />
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>
                    </template>

                    <!-- Edit Button -->
                    <a-tooltip
                        v-if="record.status !== SessionStatus.PENDING_APPROVAL && record.status !== SessionStatus.QUEUED_FOR_DELETE && record.status !== SessionStatus.TEARDOWN && record.status !== SessionStatus.QUEUED_FOR_SETUP"
                        :title="t('pages.manage.session.edit')">
                        <a-button size="small" @click="stopPropagation($event); handleEdit(record)">
                            <edit-outlined />
                        </a-button>
                    </a-tooltip>

                    <!-- Remove Button -->
                    <a-popconfirm placement="bottomRight" :title="t('pages.manage.session.areYouSure')"
                        @confirm="handleRemove(record)">
                        <a-tooltip :title="t('pages.manage.session.remove')">
                            <a-button danger size="small" @click="stopPropagation">
                                <delete-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-button-group>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.avatar-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.node {
    margin-left: 15px;
    vertical-align: middle;
}

.small-text {
    font-size: 12px;
}

:deep(tr.clickable) {
    cursor: pointer !important;
}

/* BGP Status styling */
.ant-tag {
    margin-bottom: 2px;
}

/* BGP Status with protocol prefix styling */
:deep(.ant-tag) {
    border-radius: 4px;
}

:deep(.ant-divider-vertical) {
    height: 12px;
    margin: 0 4px;
    border-color: rgba(255, 255, 255, 0.3);
}

/* Action button group styling */
:deep(.ant-btn-group) {
    display: flex;
    align-items: center;
}

:deep(.ant-btn-group .ant-btn) {
    padding: 0 6px;
    height: 24px;
    line-height: 22px;
    border-radius: 0;
}

:deep(.ant-btn-group .ant-btn:first-child) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

:deep(.ant-btn-group .ant-btn:last-child) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

:deep(.ant-btn-group .ant-btn .anticon) {
    font-size: 12px;
}


.session-table {
    width: 100%;
}

.status-tag {
    margin-right: 0;
    display: inline-flex;
    align-items: center;
    font-size: 10px;
}

:deep(.probe-tag) {
    display: inline-flex;
    align-items: center;
}

:deep(.probe-tag.compact) {
    font-size: 11px;
}

.muted {
    color: rgba(0, 0, 0, 0.45);
}

.session-table.dark .muted {
    color: rgba(255, 255, 255, 0.55);
}

.bgpStatus, .probe-status-compact {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bgpStatus .ant-tag:first-child, .probe-status-compact .ant-tag:first-child {
    margin-bottom: 4px;
}

.bgpStatus .ant-tag:last-child, .probe-status-compact .ant-tag:last-child {
    margin-top: 4px;
}

.ip-stack {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: auto 20px;
}

.ip-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ip-label {
    font-weight: 600;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.45);
    font-size: 10px;
}

.ip-value {
    font-size: 12px;
}

.ip-empty {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.25);
}

.session-table.dark .ip-label {
    color: rgba(255, 255, 255, 0.65);
}

.session-table.dark .ip-empty {
    color: rgba(255, 255, 255, 0.35);
}
</style>
