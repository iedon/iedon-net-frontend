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
    DeleteOutlined
} from '@ant-design/icons-vue'
import { SessionStatus, RouterMetadata, SessionMetadata } from '../common/packetHandler'
import { formatRelativeTime, deriveProbeStatuses, PROBE_STATUS_COLORS, getProbeStatusWeight, themeName } from '../common/helper'
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
            sorter: (a: Session, b: Session) => Number(a.asn || 0) - Number(b.asn || 0)
        })
    }

    baseColumns.push(
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
            sorter: (a: Session, b: Session) => ('' + (a.ipv4 || '')).localeCompare((b.ipv4 || ''))
        },
        {
            title: 'IPv6',
            dataIndex: 'ipv6',
            key: 'ipv6',
            sorter: (a: Session, b: Session) => ('' + (a.ipv6 || '')).localeCompare((b.ipv6 || ''))
        },
        {
            title: 'IPv6 Link Local',
            dataIndex: 'ipv6LinkLocal',
            key: 'ipv6LinkLocal',
            sorter: (a: Session, b: Session) => ('' + (a.ipv6LinkLocal || '')).localeCompare((b.ipv6LinkLocal || ''))
        },
        {
            title: t('pages.metrics.createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
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
            sorter: (a: Session, b: Session) => {
                return getStatusSortValue(b) - getStatusSortValue(a) // Descending order (better status first)
            }
        },
        {
            title: t('pages.manage.session.probeStatus'),
            dataIndex: 'probe',
            key: 'probe',
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

    return session.bgpStatus.map((bgp, index) => {
        const firstWord = bgp.info ? bgp.info.split(' ')[0] : 'Unknown'
        const statusText = t(`pages.metrics.bgpStatus['${bgp.info?.split(' ')[0] || 'Unknown'}']`)

        // For IPv4 and IPv6 types, show formatted display with protocol prefix
        if (bgp.type === 'ipv4') {
            return {
                text: statusText,
                color: firstWord === 'Established' ? 'green' : 'red',
                key: `${session.uuid}-bgp-${index}`,
                type: 'ipv4'
            }
        } else if (bgp.type === 'ipv6') {
            return {
                text: statusText,
                color: firstWord === 'Established' ? 'green' : 'red',
                key: `${session.uuid}-bgp-${index}`,
                type: 'ipv6'
            }
        } else {
            // For mpbgp or empty type, keep current format
            return {
                text: statusText,
                color: firstWord === 'Established' ? 'green' : 'red',
                key: `${session.uuid}-bgp-${index}`
            }
        }
    })
}

// Helper function for sorting status
const getStatusSortValue = (session: Session) => {
    const bgpDisplay = getBgpStatusDisplay(session)
    if (bgpDisplay) {
        const establishedCount = bgpDisplay.filter(bgp => bgp.text === 'Established').length
        const totalCount = bgpDisplay.length
        // Create a composite sort value: session status * 1000 + established count * 10 + total count
        return session.status * 1000 + establishedCount * 10 + totalCount
    }
    return session.status * 1000
}

const getProbeStatusDisplay = (session: Session) => {
    const statuses = deriveProbeStatuses(session.probe || null, session.bgpStatus || null)
    if (!statuses.length) return []
    return statuses.map(status => ({
        ...status,
        label: t(`pages.metrics.probeStatus.labels.${status.key}`),
        description: t(`pages.metrics.probeStatus.descriptions.${status.key}`),
        color: PROBE_STATUS_COLORS[status.key]
    }))
}

const getProbeSortValue = (session: Session) => {
    const statuses = deriveProbeStatuses(session.probe || null, session.bgpStatus || null)
    if (!statuses.length) return 0
    return statuses.reduce((acc, status) => acc + getProbeStatusWeight(status.key), 0)
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
            </template> <!-- Status Column -->
            <template v-else-if="column.key === 'status'">
                <template v-if="getBgpStatusDisplay(record)">
                    <!-- Show detailed BGP status when available -->
                    <span v-for="bgpStatus in getBgpStatusDisplay(record)" :key="bgpStatus.key">
                        <a-tag v-if="bgpStatus.type === 'ipv4'" :color="bgpStatus.color"
                            style="margin-right: 4px; display: inline-flex; align-items: center;">
                            <span>V4</span>
                            <a-divider type="vertical"
                                :style="`margin: 0 4px;border-color:${bgpStatus.color};font-size:10px`" />
                            <span>{{ bgpStatus.text }}</span>
                        </a-tag>
                        <a-tag v-else-if="bgpStatus.type === 'ipv6'" :color="bgpStatus.color"
                            style="margin-right: 4px; display: inline-flex; align-items: center;">
                            <span>V6</span>
                            <a-divider type="vertical"
                                :style="`margin: 0 4px;border-color:${bgpStatus.color};font-size:10px`" />
                            <span>{{ bgpStatus.text }}</span>
                        </a-tag>
                        <a-tag v-else :color="bgpStatus.color" style="margin-right: 4px;">
                            {{ bgpStatus.text }}
                        </a-tag>
                    </span>
                </template>
                <template v-else>
                    <!-- Show regular status -->
                    <a-tag :color="getStatusColor(record.status)">
                        {{ t(`pages.manage.session.statusCode['${record.status}']`) }}
                    </a-tag>
                </template>
            </template>

            <!-- Probe Status Column -->
            <template v-else-if="column.key === 'probe'">
                <template v-if="getProbeStatusDisplay(record).length">
                    <div class="probe-status-compact">
                        <a-tooltip
                            v-for="probeStatus in getProbeStatusDisplay(record)"
                            :key="`${record.uuid}-${probeStatus.version}`"
                            :title="probeStatus.description"
                        >
                            <span class="probe-pill">
                                <span class="probe-dot" :style="{ backgroundColor: probeStatus.color }"></span>
                                <span class="probe-pill-label">
                                    {{ probeStatus.version === 'ipv4' ? 'V4' : 'V6' }} · {{ probeStatus.label }}
                                </span>
                            </span>
                        </a-tooltip>
                    </div>
                </template>
                <span v-else class="small-text">{{ t('pages.metrics.probeStatus.labels.notAvailable') }}</span>
            </template>

            <!-- IPv4 Column -->
            <template v-else-if="column.key === 'ipv4'">
                <span v-if="record.ipv4" class="small-text">{{ record.ipv4 }}</span>
                <close-outlined v-else />
            </template>

            <!-- IPv6 Column -->
            <template v-else-if="column.key === 'ipv6'">
                <span v-if="record.ipv6" class="small-text">{{ record.ipv6 }}</span>
                <close-outlined v-else />
            </template>

            <!-- IPv6 Link Local Column -->
            <template v-else-if="column.key === 'ipv6LinkLocal'">
                <span v-if="record.ipv6LinkLocal" class="small-text">{{ record.ipv6LinkLocal }}</span>
                <close-outlined v-else />
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

.probe-status-compact {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

.probe-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #434343;
}

.probe-pill-label {
    white-space: nowrap;
}

.probe-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.session-table.dark .probe-pill {
    color: #d9d9d9;
}

.session-table.dark .probe-dot {
    box-shadow: 0 0 2px rgba(255, 255, 255, 0.25);
}
</style>
