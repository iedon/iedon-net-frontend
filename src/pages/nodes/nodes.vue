<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { 
    ApiOutlined, 
    CopyOutlined, 
    GlobalOutlined, 
    CloudServerOutlined,
    UsergroupAddOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    StopOutlined,
    HourglassOutlined,
    WifiOutlined,
    DatabaseOutlined,
    ThunderboltOutlined,
    DesktopOutlined,
    TwitterOutlined,
    CloudOutlined
} from '@ant-design/icons-vue'
import { makeRequest, RouterMetadata, RoutersResponse } from '../../common/packetHandler'
import { loggedIn, formatBytes, siteConfig, registerPageTitle } from '../../common/helper'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'
import { Empty } from 'ant-design-vue'

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
        let resp = await makeRequest(t, '/list/routers')
        if (resp.success && resp.response) {
            const data = resp.response as RoutersResponse
            if (data && Array.isArray(data.routers)) {
                routers.value = data.routers.sort((a, b) => ('' + a.name).localeCompare(b.name))
                localStorage.setItem('routers', JSON.stringify(routers.value))
            }
        }

    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    registerPageTitle(t('pages.nodes.nodes'))
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

// Helper function to check if router is offline (last update > 15 minutes ago)
const isRouterOffline = (r: RouterMetadata) => {
    if (!r.metric || !r.metric.timestamp) return true
    const now = (+Date.now()) / 1000 // Convert to seconds
    const routerTimestamp = r.metric.timestamp / 1000 // Convert to seconds
    const fifteenMinutesAgo = now - (15 * 60) // 15 minutes in seconds
    return routerTimestamp < fifteenMinutesAgo
}

// Helper function to check if site is in maintenance mode
const isMaintenanceMode = () => {
    return siteConfig.value.maintenanceText && siteConfig.value.maintenanceText.trim() !== ''
}

const redirectToPeering = (r: RouterMetadata) => {
    // Check maintenance mode first
    if (isMaintenanceMode()) {
        Modal.error({
            centered: true,
            title: t('pages.nodes.maintenanceMode'),
            content: siteConfig.value.maintenanceText
        })
        return
    }

    // Check if router is offline
    if (isRouterOffline(r)) {
        Modal.error({
            centered: true,
            title: t('pages.nodes.routerOffline'),
            content: t('pages.nodes.routerOfflineDescription')
        })
        return
    }

    if (!r.openPeering) {
        Modal.error({
            centered: true,
            title: r.name,
            content: t('pages.nodes.statusClosed')
        })
        return
    }
    if (r.sessionCount >= r.sessionCapacity) {
        Modal.error({
            centered: true,
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

const searchKeywords = ref('')
const filteredRouters = computed(() => {
    if (searchKeywords.value.length === 0) return routers.value
    return routers.value.filter(
        (router: RouterMetadata) =>
            (router.name !== undefined && router.name !== null && router.name.toLocaleLowerCase().indexOf(searchKeywords.value.toLocaleLowerCase()) !== -1) ||
            (router.ipv4 !== undefined && router.ipv4 !== null && router.ipv4.indexOf(searchKeywords.value) !== -1) ||
            (router.ipv6 !== undefined && router.ipv6 !== null && router.ipv6.toLocaleLowerCase().indexOf(searchKeywords.value.toLocaleLowerCase()) !== -1) ||
            (router.ipv6LinkLocal !== undefined && router.ipv6LinkLocal !== null && router.ipv6LinkLocal.toLocaleLowerCase().indexOf(searchKeywords.value.toLocaleLowerCase()) !== -1)
    )
})

// Helper functions for better formatting
const getStatusInfo = (r: RouterMetadata) => {
    if (!r.openPeering) {
        return { 
            status: t('pages.nodes.statusClosed'), 
            color: 'default',
            icon: StopOutlined
        }
    }
    if (r.sessionCount >= r.sessionCapacity) {
        return { 
            status: t('pages.nodes.statusFull'), 
            color: 'warning',
            icon: ExclamationCircleOutlined
        }
    }
    if (r.autoPeering) {
        return { 
            status: t('pages.nodes.statusOpen'), 
            color: 'success',
            icon: CheckCircleOutlined
        }
    }
    return { 
        status: t('pages.nodes.statusOpenManuallyReview'), 
        color: 'processing',
        icon: HourglassOutlined
    }
}

const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    return `${days}d ${hours}h`
}

const getRouterInfo = (rs: string) => {
    if (!rs) return 'N/A'
    const lines = rs.split('\n')
    for (const line of lines) {
        if (line.includes('BIRD')) {
            return line.trim()
        }
    }
    return lines[0]?.trim() || 'N/A'
}

const getAgentVersion = (versionString: string) => {
    if (!versionString) return 'N/A'
    // Extract version from strings like "iEdon-PeerAPI-Agent/1.0 (xxx)"
    const match = versionString.match(/\/([0-9.]+)/)
    return match ? match[1] : 'N/A'
}

const getConnectionTypeLabel = (linkType: string) => {
    const key = `pages.peering.${linkType}`
    const translated = t(key)
    // If translation not found, return original string in title case
    return translated !== key ? translated : linkType.charAt(0).toUpperCase() + linkType.slice(1)
}

const getConnectionIcon = (linkType: string) => {
    const iconMap: { [key: string]: any } = {
        'wireguard': ThunderboltOutlined,
        'openvpn': GlobalOutlined,
        'ipsec': DatabaseOutlined,
        'gre': WifiOutlined,
        'ip6gre': WifiOutlined,
        'direct': ApiOutlined
    }
    return iconMap[linkType] || WifiOutlined
}

const getConnectionBadgeClass = (linkType: string) => {
    const classMap: { [key: string]: string } = {
        'wireguard': 'wireguard',
        'openvpn': 'openvpn', 
        'ipsec': 'ipsec',
        'gre': 'gre',
        'ip6gre': 'gre',
        'direct': 'direct'
    }
    return classMap[linkType] || 'default'
}

// Statistics computed properties
const totalRouters = computed(() => routers.value.length)
const totalSessions = computed(() => routers.value.reduce((sum, r) => sum + r.sessionCount, 0))
const availableForAuto = computed(() => routers.value.filter(r => r.openPeering && r.autoPeering && r.sessionCount < r.sessionCapacity).length)

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
</script>

<template>
    <div class="nodes-page">
        <!-- Header Section -->
        <div class="page-header">
            <h1 class="page-title">
                <span class="title-icon">
                    <cloud-server-outlined />
                </span>
                {{ t('pages.nodes.nodes') }}
            </h1>
            <p class="page-subtitle">{{ t('pages.nodes.subTitle') }}</p>
        </div>

        <!-- Statistics Section -->
        <div v-if="!loading && routers.length > 0" class="statistics-section">
            <div class="stats-grid">
                <div class="stat-card primary">
                    <div class="stat-icon">
                        <global-outlined />
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">{{ totalRouters }}</div>
                        <div class="stat-label">{{ t('pages.nodes.totalRouters') }}</div>
                    </div>
                </div>
                <div class="stat-card success">
                    <div class="stat-icon">
                        <thunderbolt-outlined />
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">{{ availableForAuto }}</div>
                        <div class="stat-label">{{ t('pages.nodes.availableForAuto') }}</div>
                    </div>
                </div>
                <div class="stat-card info">
                    <div class="stat-icon">
                        <api-outlined />
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">{{ totalSessions }}</div>
                        <div class="stat-label">{{ t('pages.nodes.totalSessions') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search Section -->
        <div class="search-section">
            <a-input-search 
                v-model:value="searchKeywords"
                :placeholder="t('pages.nodes.search')" 
                class="search-input"
                size="large"
                enter-button
            />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <a-spin size="large" />
        </div>

        <!-- Routers Grid -->
        <div v-else-if="filteredRouters.length > 0" class="routers-grid">
            <div 
                v-for="r in filteredRouters" 
                :key="r.uuid" 
                class="router-card"
                @click="redirectToPeering(r)"
            >
                <!-- Card Header -->                <div class="card-header">
                    <div class="router-info">
                        <router-location-avatar 
                            :router="r" 
                            :color="isRouterOffline(r) || isMaintenanceMode() ? 'red' : ''" 
                            class="router-avatar" 
                        />
                        <div class="router-title">
                            <h3 class="router-name">{{ r.name }}</h3>
                            <div class="status-indicator" :class="getStatusInfo(r).color">
                                <component :is="getStatusInfo(r).icon" class="status-icon" />
                                <span class="status-text">{{ getStatusInfo(r).status }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-actions">
                        <a-tooltip title="Copy Router Info">
                            <a-button 
                                type="text" 
                                size="small"
                                @click.stop="copyRouterDescription(r)"
                            >
                                <copy-outlined />
                            </a-button>
                        </a-tooltip>
                        <a-tooltip title="Connect">
                            <a-button 
                                type="text" 
                                size="small"
                                @click.stop="redirectToPeering(r)"
                            >
                                <api-outlined />
                            </a-button>
                        </a-tooltip>
                    </div>
                </div>

                <!-- Capacity Section -->
                <div class="capacity-section">
                    <div class="capacity-info">
                        <usergroup-add-outlined class="capacity-icon" />
                        <span class="capacity-text">
                            {{ r.sessionCount }} / {{ r.sessionCapacity }}
                        </span>
                    </div>
                    <a-progress 
                        :percent="Math.round((r.sessionCount / r.sessionCapacity) * 100)" 
                        :show-info="false"
                        size="small"
                        :stroke-color="r.sessionCount >= r.sessionCapacity ? '#ff4d4f' : '#52c41a'"
                    />
                </div>                <!-- Connection Options -->
                <div v-if="r.linkTypes && r.linkTypes.length > 0" class="connection-section">
                    <div class="connection-title">
                        <cloud-outlined class="connection-title-icon" />
                        <span>{{ t('pages.nodes.connectionTypes') }}</span>
                    </div>
                    <div class="connection-badges">
                        <div 
                            v-for="linkType in r.linkTypes" 
                            :key="linkType"
                            class="connection-badge"
                            :class="getConnectionBadgeClass(linkType)"
                        >
                            <component :is="getConnectionIcon(linkType)" class="connection-badge-icon" />
                            <span class="connection-badge-text">{{ getConnectionTypeLabel(linkType) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Metrics Section (if available) -->
                <div v-if="r.metric" class="metrics-section">
                    <a-divider class="metrics-divider" />
                    <div class="metrics-grid">
                        <div class="metric-item">
                            <clock-circle-outlined class="metric-icon" />
                            <div class="metric-content">
                                <span class="metric-label">{{ t('pages.nodes.uptime') }}</span>
                                <span class="metric-value">{{ formatUptime(r.metric.uptime) }}</span>
                            </div>
                        </div>
                        <div class="metric-item">
                            <thunderbolt-outlined class="metric-icon" />
                            <div class="metric-content">
                                <span class="metric-label">{{ t('pages.nodes.loadAvg') }}</span>
                                <span class="metric-value">{{ r.metric.loadAvg?.split(' ')[0] || 'N/A' }}</span>
                            </div>
                        </div>
                        <div class="metric-item">
                            <wifi-outlined class="metric-icon" />
                            <div class="metric-content">
                                <span class="metric-label">{{ t('pages.nodes.txRx') }}</span>
                                <span class="metric-value">{{ formatBytes(r.metric.tx) }} / {{ formatBytes(r.metric.rx) }}</span>
                            </div>
                        </div>
                        <div class="metric-item">
                            <global-outlined class="metric-icon" />
                            <div class="metric-content">
                                <span class="metric-label">{{ t('pages.nodes.tcpUdp') }}</span>
                                <span class="metric-value">{{ r.metric.tcp || 0 }} / {{ r.metric.udp || 0 }}</span>
                            </div>
                        </div>
                        <div v-if="r.metric.rs" class="metric-item">
                            <twitter-outlined class="metric-icon" />
                            <div class="metric-content">
                                <span class="metric-label">{{ t('pages.nodes.router') }}</span>
                                <span class="metric-value">{{ getRouterInfo(r.metric.rs) }}</span>
                            </div>
                        </div>
                        <div v-if="r.metric.version" class="metric-item">
                            <desktop-outlined class="metric-icon" />
                            <div class="metric-content">
                                <span class="metric-label">{{ t('pages.nodes.agent') }}</span>
                                <span class="metric-value">{{ getAgentVersion(r.metric.version) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description Section -->
                <div v-if="r.description" class="description-section">
                    <a-divider class="description-divider" />
                    <div class="description-content" v-html="md.render(r.description)"></div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
            <a-empty 
                :image="simpleImage" 
                :description="searchKeywords ? 'No routers match your search' : 'No routers available'"
            />
        </div>
    </div>
</template>

<style scoped>
.nodes-page {
    width: 100%;
    margin: 0 auto;
    padding: 16px 24px;
    min-height: 100vh;
    background-color: #f9f9f9;
    max-width: 1440px;
}

.dark .nodes-page {
    background: #0f0f0f;
}

/* Header Section */
.page-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 20px 0;
    margin-top: 20px;
}

.page-title {
    font-size: 32px;
    font-weight: 600;
    margin: 0;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.dark .page-title {
    color: #ffffff;
}

.title-icon {
    color: #1890ff;
    font-size: 28px;
}

.page-subtitle {
    font-size: 16px;
    color: #666;
    margin: 8px 0 0 0;
}

.dark .page-subtitle {
    color: #aaa;
}

/* Statistics Section */
.statistics-section {
    margin-bottom: 32px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    max-width: 1000px;
    margin: 0px auto 8px auto;
}

.stat-card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.dark .stat-card {
    background: #1a1a1a;
    border-color: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.dark .stat-card:hover {
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
}

.stat-icon {
    font-size: 24px;
    color: #666;
    flex-shrink: 0;
}

.dark .stat-icon {
    color: #aaa;
}

.stat-card.primary .stat-icon {
    color: #1890ff;
}

.stat-card.success .stat-icon {
    color: #52c41a;
}

.stat-card.info .stat-icon {
    color: #1890ff;
}

.stat-card.warning .stat-icon {
    color: #faad14;
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1;
    margin-bottom: 4px;
}

.dark .stat-value {
    color: #ffffff;
}

.stat-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.dark .stat-label {
    color: #aaa;
}

/* Search Section */
.search-section {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
}

.search-input {
    max-width: 500px;
    width: 100%;
}

/* Loading State */
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

/* Routers Grid */
.routers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
    align-items: start;
    max-width: none;
}

/* Router Card */
.router-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.dark .router-card {
    background: #1a1a1a;
    border-color: #2a2a2a;
}

.router-card:hover {
    border: 1px solid #1890ff;
    transform: translateY(-2px);
}

.dark .router-card:hover {
    border-color: #40a9ff;
}

/* Card Header */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.router-info {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
}

.router-avatar {
    flex-shrink: 0;
}

.router-title {
    flex: 1;
    min-width: 0;
}

.router-name {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.4;
    word-break: break-word;
}

.dark .router-name {
    color: #ffffff;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 0;
    opacity: 0.8;
}

.status-indicator.success {
    color: #52c41a;
}

.status-indicator.warning {
    color: #faad14;
}

.status-indicator.processing {
    color: #1890ff;
}

.status-indicator.default {
    color: #666;
}

.dark .status-indicator.default {
    color: #aaa;
}

.status-text {
    font-size: 12px;
}

.status-icon {
    font-size: 12px;
}

.card-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

/* Capacity Section */
.capacity-section {
    padding: 5px 12px 12px 12px;
    border-radius: 8px;
}

.capacity-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.capacity-icon {
    color: #1890ff;
    font-size: 16px;
}

.capacity-text {
    font-weight: 500;
    color: #1a1a1a;
    font-size: 14px;
}

.dark .capacity-text {
    color: #ffffff;
}

/* Connection Section */
.connection-section {
    margin-bottom: 20px;
}

.connection-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-weight: 600;
    color: #1a1a1a;
    font-size: 14px;
}

.dark .connection-title {
    color: #ffffff;
}

.connection-title-icon {
    color: #1890ff;
    font-size: 16px;
}

.connection-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.connection-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid;
    min-height: 32px;
}

.connection-badge-icon {
    font-size: 14px;
    flex-shrink: 0;
}

.connection-badge-text {
    white-space: nowrap;
}

/* Connection badge color variants - using CSS variables for automatic dark mode support */
.connection-badge.wireguard {
    border-color: #52c41a;
    color: #52c41a;
}

.connection-badge.openvpn {
    border-color: #1890ff;
    color: #1890ff;
}

.connection-badge.ipsec {
    border-color: #ff4d4f;
    color: #ff4d4f;
}

.connection-badge.gre {
    border-color: #faad14;
    color: #faad14;
}

.connection-badge.direct {
    border-color: #722ed1;
    color: #722ed1;
}

.connection-badge.default {
    border-color: #f0f0f0;
    color: #666;
}

.dark .connection-badge.default {
    border-color: #2a2a2a;
    color: #aaa;
}

.connection-badge:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
}

/* Metrics Section */
.metrics-section {
    margin-bottom: 16px;
}

.metrics-divider {
    margin: 12px auto;
}

.metrics-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-weight: 600;
    color: #1a1a1a;
    font-size: 14px;
}

.dark .metrics-title {
    color: #ffffff;
}

.metrics-title-icon {
    color: #1890ff;
    font-size: 16px;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 8px;
}

.metric-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    min-height: 32px;
}

.metric-icon {
    color: #1890ff;
    font-size: 12px;
    flex-shrink: 0;
}

.metric-content {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    flex: 1;
}

.metric-label {
    font-size: 10px;
    color: #666;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 1;
}

.dark .metric-label {
    color: #aaa;
}

.metric-value {
    font-size: 12px;
    font-weight: 500;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
}

.dark .metric-value {
    color: #ffffff;
}

/* Description Section */
.description-section {
    margin-top: 16px;
}

.description-divider {
    margin: 16px 0 12px 0;
}

.description-content {
    font-size: 14px;
    line-height: 1.6;
    color: #555;
    padding: 12px;
    border-radius: 8px;
}

.dark .description-content {
    color: #aaa;
}

.description-content:deep(p) {
    margin: 0 0 8px 0;
}

.description-content:deep(p:last-child) {
    margin-bottom: 0;
}

.description-content:deep(code) {
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    background-color: #f7fafc;
    color: #e53e3e;
    padding: 0.2rem 0.4rem;
    font-size: 0.85em;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    font-weight: 500;
    word-break: break-word;
}

.dark .description-content:deep(code) {
    background-color: #2d3748;
    color: #f56565;
    border-color: #4a5568;
}

/* Empty State */
.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    margin: 60px 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .routers-grid {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .nodes-page {
        padding: 12px 16px;
    }
    
    .page-title {
        font-size: 28px;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    
    .routers-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .router-card {
        padding: 16px;
    }
    
    .card-header {
        flex-direction: column;
        gap: 12px;
    }
    
    .card-actions {
        align-self: flex-end;
    }
    
    .connection-badges {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .nodes-page {
        padding: 8px 12px;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .router-info {
        flex-direction: column;
        gap: 8px;
    }
    
    .router-title {
        text-align: center;
    }
    
    .metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .routers-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .router-card {
        padding: 14px;
    }
    
    .connection-badges {
        flex-direction: column;
        align-items: stretch;
    }
    
    .connection-badge {
        justify-content: center;
    }
}
</style>
