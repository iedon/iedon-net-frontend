<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue'
import { RouteLocationAsPathGeneric, useRouter } from 'vue-router'
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
    DownOutlined
} from '@ant-design/icons-vue'
import { makeRequest, RouterMetadata, RoutersResponse } from '../../common/packetHandler'
import { loggedIn, formatBytes, siteConfig, registerPageTitle } from '../../common/helper'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'

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
const expandedMetrics = ref<Set<string>>(new Set())
const searchKeywords = ref('')
const selectedRegion = ref<string>('all')

// Region mapping configuration - optimized for performance
const REGION_MAPPING = new Map([
    // Europe
    ['AD', 'Europe'], ['AL', 'Europe'], ['AT', 'Europe'], ['BA', 'Europe'], ['BE', 'Europe'], ['BG', 'Europe'],
    ['BY', 'Europe'], ['CH', 'Europe'], ['CZ', 'Europe'], ['DE', 'Europe'], ['DK', 'Europe'], ['EE', 'Europe'],
    ['ES', 'Europe'], ['FI', 'Europe'], ['FR', 'Europe'], ['GB', 'Europe'], ['GR', 'Europe'], ['HR', 'Europe'],
    ['HU', 'Europe'], ['IE', 'Europe'], ['IS', 'Europe'], ['IT', 'Europe'], ['LI', 'Europe'], ['LT', 'Europe'],
    ['LU', 'Europe'], ['LV', 'Europe'], ['MC', 'Europe'], ['MD', 'Europe'], ['ME', 'Europe'], ['MK', 'Europe'],
    ['MT', 'Europe'], ['NL', 'Europe'], ['NO', 'Europe'], ['PL', 'Europe'], ['PT', 'Europe'], ['RO', 'Europe'],
    ['RS', 'Europe'], ['SE', 'Europe'], ['SI', 'Europe'], ['SK', 'Europe'], ['SM', 'Europe'], ['UA', 'Europe'],
    ['VA', 'Europe'], ['XK', 'Europe'],

    // North America
    ['US', 'North America'], ['CA', 'North America'], ['MX', 'North America'], ['GT', 'North America'],
    ['BZ', 'North America'], ['SV', 'North America'], ['HN', 'North America'], ['NI', 'North America'],
    ['CR', 'North America'], ['PA', 'North America'],

    // South America
    ['AR', 'South America'], ['BO', 'South America'], ['BR', 'South America'], ['CL', 'South America'],
    ['CO', 'South America'], ['EC', 'South America'], ['FK', 'South America'], ['GF', 'South America'],
    ['GY', 'South America'], ['PE', 'South America'], ['PY', 'South America'], ['SR', 'South America'],
    ['UY', 'South America'], ['VE', 'South America'],

    // Africa
    ['DZ', 'Africa'], ['AO', 'Africa'], ['BW', 'Africa'], ['BI', 'Africa'], ['CM', 'Africa'], ['CV', 'Africa'],
    ['CF', 'Africa'], ['TD', 'Africa'], ['KM', 'Africa'], ['YT', 'Africa'], ['CG', 'Africa'], ['CD', 'Africa'],
    ['BJ', 'Africa'], ['GQ', 'Africa'], ['ET', 'Africa'], ['ER', 'Africa'], ['DJ', 'Africa'], ['GA', 'Africa'],
    ['GM', 'Africa'], ['GH', 'Africa'], ['GN', 'Africa'], ['CI', 'Africa'], ['KE', 'Africa'], ['LS', 'Africa'],
    ['LR', 'Africa'], ['LY', 'Africa'], ['MG', 'Africa'], ['MW', 'Africa'], ['ML', 'Africa'], ['MR', 'Africa'],
    ['MU', 'Africa'], ['MA', 'Africa'], ['MZ', 'Africa'], ['NA', 'Africa'], ['NE', 'Africa'], ['NG', 'Africa'],
    ['GW', 'Africa'], ['RE', 'Africa'], ['RW', 'Africa'], ['SH', 'Africa'], ['ST', 'Africa'], ['SN', 'Africa'],
    ['SC', 'Africa'], ['SL', 'Africa'], ['SO', 'Africa'], ['ZA', 'Africa'], ['ZW', 'Africa'], ['SS', 'Africa'],
    ['SD', 'Africa'], ['SZ', 'Africa'], ['TG', 'Africa'], ['TN', 'Africa'], ['UG', 'Africa'], ['EH', 'Africa'],
    ['ZM', 'Africa'], ['TZ', 'Africa'], ['BF', 'Africa'], ['EG', 'Africa'],

    // Asia-S (South Asia)
    ['IN', 'Asia-S'], ['PK', 'Asia-S'], ['BD', 'Asia-S'], ['LK', 'Asia-S'], ['NP', 'Asia-S'], ['BT', 'Asia-S'],
    ['MV', 'Asia-S'],

    // Asia-SE (Southeast Asia)
    ['TH', 'Asia-SE'], ['SG', 'Asia-SE'], ['PH', 'Asia-SE'], ['ID', 'Asia-SE'], ['MY', 'Asia-SE'],
    ['VN', 'Asia-SE'], ['KH', 'Asia-SE'], ['LA', 'Asia-SE'], ['MM', 'Asia-SE'], ['BN', 'Asia-SE'],
    ['TL', 'Asia-SE'],

    // Asia-E (East Asia)
    ['JP', 'Asia-E'], ['CN', 'Asia-E'], ['KR', 'Asia-E'], ['TW', 'Asia-E'], ['HK', 'Asia-E'], ['MO', 'Asia-E'],
    ['KP', 'Asia-E'], ['MN', 'Asia-E'],

    // Pacific & Oceania
    ['AU', 'Pacific&Oceania'], ['NZ', 'Pacific&Oceania'], ['FJ', 'Pacific&Oceania'], ['PG', 'Pacific&Oceania'],
    ['NC', 'Pacific&Oceania'], ['SB', 'Pacific&Oceania'], ['VU', 'Pacific&Oceania'], ['WS', 'Pacific&Oceania'],
    ['KI', 'Pacific&Oceania'], ['NR', 'Pacific&Oceania'], ['PW', 'Pacific&Oceania'], ['FM', 'Pacific&Oceania'],
    ['MH', 'Pacific&Oceania'], ['TO', 'Pacific&Oceania'], ['TV', 'Pacific&Oceania'], ['CK', 'Pacific&Oceania'],
    ['NU', 'Pacific&Oceania'], ['TK', 'Pacific&Oceania'], ['WF', 'Pacific&Oceania'], ['AS', 'Pacific&Oceania'],
    ['GU', 'Pacific&Oceania'], ['MP', 'Pacific&Oceania'], ['UM', 'Pacific&Oceania'], ['PF', 'Pacific&Oceania'],

    // Antarctica
    ['AQ', 'Antarctica'],

    // Asia-N (North Asia)
    ['RU', 'Asia-N'],

    // Asia-W (West Asia)
    ['IR', 'Asia-W'], ['TR', 'Asia-W'], ['AE', 'Asia-W'], ['SA', 'Asia-W'], ['IQ', 'Asia-W'], ['SY', 'Asia-W'],
    ['LB', 'Asia-W'], ['JO', 'Asia-W'], ['IL', 'Asia-W'], ['PS', 'Asia-W'], ['KW', 'Asia-W'], ['QA', 'Asia-W'],
    ['BH', 'Asia-W'], ['OM', 'Asia-W'], ['YE', 'Asia-W'], ['GE', 'Asia-W'], ['AM', 'Asia-W'], ['AZ', 'Asia-W'],
    ['CY', 'Asia-W'],

    // Central Asia
    ['AF', 'Central Asia'], ['UZ', 'Central Asia'], ['KZ', 'Central Asia'], ['KG', 'Central Asia'],
    ['TJ', 'Central Asia'], ['TM', 'Central Asia']
])

// Get router region - optimized for performance
const getRouterRegion = (router: RouterMetadata): string => {
    if (!router.location) return 'Other Region'
    return REGION_MAPPING.get(router.location.toUpperCase()) || 'Other Region'
}

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

const redirectToPeering = (r: RouterMetadata, linkType?: string) => {
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

    const route: RouteLocationAsPathGeneric = { path: `/nodes/${r.uuid}` }
    if (linkType) {
        route.query = { linkType }
    }
    router.push(route)
}

// Computed properties for filtering
const regionCounts = computed(() => {
    const counts: Record<string, number> = {}
    routers.value.forEach(router => {
        const region = getRouterRegion(router)
        counts[region] = (counts[region] || 0) + 1
    })
    return counts
})

const availableRegions = computed(() => {
    const regions = Object.keys(regionCounts.value)
        .filter(region => region !== 'Unknown')
        .sort()
    return regions
})

const filteredRouters = computed(() => {
    let filtered = routers.value

    // Filter by region
    if (selectedRegion.value !== 'all') {
        filtered = filtered.filter(router => getRouterRegion(router) === selectedRegion.value)
    }

    // Filter by search keywords
    if (searchKeywords.value.length > 0) {
        const keywords = searchKeywords.value.toLowerCase()
        filtered = filtered.filter(router =>
            (router.name?.toLowerCase().includes(keywords)) ||
            (router.ipv4?.includes(searchKeywords.value)) ||
            (router.ipv6?.toLowerCase().includes(keywords)) ||
            (router.ipv6LinkLocal?.toLowerCase().includes(keywords))
        )
    }

    return filtered
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
const totalRouters = computed(() => filteredRouters.value.length)
const totalSessions = computed(() => filteredRouters.value.reduce((sum, r) => sum + r.sessionCount, 0))
const availableForAuto = computed(() => filteredRouters.value.filter(r => r.openPeering && r.autoPeering && r.sessionCount < r.sessionCapacity).length)

// Toggle metrics visibility
const toggleMetrics = (routerId: string, event: Event) => {
    event.stopPropagation() // Prevent card click
    if (expandedMetrics.value.has(routerId)) {
        expandedMetrics.value.delete(routerId)
    } else {
        expandedMetrics.value.add(routerId)
    }
}

const isMetricsExpanded = (routerId: string) => {
    return expandedMetrics.value.has(routerId)
}

// Region filter helpers
const setRegionFilter = (region: string) => {
    selectedRegion.value = region
    // Clear search when changing region for better UX
    if (region !== 'all' && searchKeywords.value) {
        searchKeywords.value = ''
    }
}
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

        <!-- Search Section -->
        <div class="search-section">
            <a-input-search v-model:value="searchKeywords" :placeholder="t('pages.nodes.search')" class="search-input"
                size="large" enter-button :disabled="loading" />
        </div>

        <!-- Region Filter Section -->
        <div v-if="!loading && routers.length > 0" class="region-filter-section">
            <div class="region-filters">
                <a-button :type="selectedRegion === 'all' ? 'primary' : 'default'" size="small"
                    @click="setRegionFilter('all')" class="region-filter-btn">
                    {{ t('pages.nodes.regions.All') }} ({{ routers.length }})
                </a-button>
                <a-button v-for="region in availableRegions" :key="region"
                    :type="selectedRegion === region ? 'primary' : 'default'" size="small"
                    @click="setRegionFilter(region)" class="region-filter-btn">
                    {{ t(`pages.nodes.regions.${region}`) }} ({{ regionCounts[region] }})
                </a-button>
            </div>
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

        <!-- Loading State with Skeletons -->
        <div v-if="loading">
            <!-- Statistics Section Skeleton -->
            <div class="statistics-section">
                <div class="stats-grid">
                    <div v-for="i in 3" :key="i" class="stat-card">
                        <a-skeleton-avatar :active="true" size="large" shape="square" />
                        <div class="stat-content">
                            <a-skeleton-input :active="true" size="small"
                                style="width: 60px; height: 28px; margin-bottom: 8px;" />
                            <a-skeleton-input :active="true" size="small" style="width: 120px; height: 16px;" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Routers Grid Skeleton -->
            <div class="routers-grid">
                <div v-for="i in 6" :key="i" class="router-card skeleton-card">
                    <!-- Card Header Skeleton -->
                    <div class="card-header">
                        <div class="router-info">
                            <a-skeleton-avatar :active="true" size="large" shape="circle" />
                            <div class="router-title">
                                <a-skeleton-input :active="true" size="default"
                                    style="width: 200px; height: 24px; margin-bottom: 8px;" />
                                <a-skeleton-input :active="true" size="small" style="width: 120px; height: 16px;" />
                            </div>
                        </div>
                        <div class="card-actions">
                            <a-skeleton-button :active="true" size="small" shape="circle" />
                            <a-skeleton-button :active="true" size="small" shape="circle" />
                        </div>
                    </div>

                    <!-- Capacity Section Skeleton -->
                    <div class="capacity-section">
                        <div class="capacity-info">
                            <a-skeleton-avatar :active="true" size="small" shape="square" />
                            <a-skeleton-input :active="true" size="small" style="width: 80px; height: 16px;" />
                        </div>
                        <a-skeleton-input :active="true" size="small"
                            style="width: 100%; height: 8px; border-radius: 4px;" />
                    </div>

                    <!-- Connection Section Skeleton -->
                    <div class="connection-section">
                        <div class="connection-badges">
                            <a-skeleton-button v-for="j in 3" :key="j" :active="true" size="small"
                                style="width: 80px; margin-right: 8px;" />
                        </div>
                    </div>

                    <!-- Metrics Section Skeleton -->
                    <div class="metrics-section">
                        <a-skeleton-button :active="true" size="small"
                            style="width: 120px; height: 32px; border-radius: 8px;" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Routers Grid -->
        <div v-else-if="filteredRouters.length > 0" class="routers-grid">
            <div v-for="r in filteredRouters" :key="r.uuid" class="router-card" @click="redirectToPeering(r)">
                <!-- Card Header -->
                <div class="card-header">
                    <div class="router-info">
                        <router-location-avatar :router="r"
                            :color="isRouterOffline(r) || isMaintenanceMode() ? 'red' : ''" class="router-avatar" />
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
                            <a-button type="text" size="small" @click.stop="copyRouterDescription(r)">
                                <copy-outlined />
                            </a-button>
                        </a-tooltip>
                        <a-tooltip title="Connect">
                            <a-button type="text" size="small" @click.stop="redirectToPeering(r)">
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
                    <a-progress :percent="Math.round((r.sessionCount / r.sessionCapacity) * 100)" :show-info="false"
                        size="small" :stroke-color="r.sessionCount >= r.sessionCapacity ? '#ff4d4f' : '#52c41a'" />
                </div>
                
                <!-- Connection Options -->
                <div v-if="r.linkTypes && r.linkTypes.length > 0" class="connection-section">
                    <div class="connection-badges">
                        <div v-for="linkType in r.linkTypes" :key="linkType" class="connection-badge"
                            @click.stop="redirectToPeering(r, linkType)"
                            :class="getConnectionBadgeClass(linkType)">
                            <component :is="getConnectionIcon(linkType)" class="connection-badge-icon" />
                            <span class="connection-badge-text">{{ getConnectionTypeLabel(linkType) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Metrics Section (if available) -->
                <div v-if="r.metric" class="metrics-section">
                    <!-- Metrics Toggle Button -->
                    <div class="metrics-toggle" @click="toggleMetrics(r.uuid, $event)">
                        <span class="metrics-toggle-text">
                            {{ t('pages.nodes.systemMetrics') }}
                        </span>
                        <down-outlined class="metrics-toggle-icon" :class="{ 'expanded': isMetricsExpanded(r.uuid) }" />
                    </div>

                    <!-- Collapsible Metrics Content -->
                    <div v-show="isMetricsExpanded(r.uuid)" class="metrics-content">
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
                                    <span class="metric-value">{{ formatBytes(r.metric.tx) }} / {{
                                        formatBytes(r.metric.rx) }}</span>
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
                :description="searchKeywords ? t('pages.nodes.noRoutersMatch') : t('pages.nodes.noRoutersAvailable')" />
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
    margin: 20px auto;
    padding: 20px 0;
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
    margin: 0px auto 50px auto;
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
    margin-bottom: 24px;
}

.search-input {
    max-width: 500px;
    width: 100%;
}

/* Region Filter Section */
.region-filter-section {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
}

.region-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    align-items: center;
    max-width: 900px;
    width: 100%;
}

.region-filter-btn {
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    height: 32px;
    padding: 0 12px;
    transition: all 0.2s ease;
    border: 1px solid #d9d9d9;
    background: #fff;
    color: #666;
}

.dark .region-filter-btn {
    background: #1a1a1a;
    border-color: #2a2a2a;
    color: #aaa;
}

.region-filter-btn:hover {
    border-color: #40a9ff;
    color: #40a9ff;
}

.region-filter-btn.ant-btn-primary {
    background: #1890ff !important;
    border-color: #1890ff !important;
    color: #fff !important;
}

.dark .region-filter-btn.ant-btn-primary {
    background: #1890ff !important;
    border-color: #1890ff !important;
}

.region-filter-btn.ant-btn-primary:hover {
    background: #40a9ff !important;
    border-color: #40a9ff !important;
    color: #fff !important;
}

/* Skeleton Card Styles */
.skeleton-card {
    pointer-events: none;
    cursor: default;
}

.skeleton-card:hover {
    transform: none;
    border-color: #eee;
}

.dark .skeleton-card:hover {
    border-color: #2a2a2a;
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

.metrics-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    margin: 8px 0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}

.dark .metrics-toggle {
    background: rgba(64, 169, 255, 0.08);
    border-color: rgba(64, 169, 255, 0.2);
}

.metrics-toggle:hover {
    background: rgba(24, 144, 255, 0.08);
    border-color: rgba(24, 144, 255, 0.25);
}

.dark .metrics-toggle:hover {
    background: rgba(64, 169, 255, 0.12);
    border-color: rgba(64, 169, 255, 0.3);
}

.metrics-toggle-text {
    font-size: 12px;
    font-weight: 500;
    color: #666;
}

.dark .metrics-toggle-text {
    color: #aaa;
}

.metrics-toggle-icon {
    font-size: 12px;
    color: #666;
    transition: transform 0.2s ease;
}

.dark .metrics-toggle-icon {
    color: #aaa;
}

.metrics-toggle-icon.expanded {
    transform: rotate(180deg);
}

.metrics-content {
    animation: slideDown 0.2s ease-out;
    overflow: hidden;
}

@keyframes slideDown {
    from {
        opacity: 0;
        max-height: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        max-height: 500px;
        transform: translateY(0);
    }
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

    .region-filter-section {
        margin-bottom: 24px;
    }

    .region-filters {
        gap: 6px;
        padding: 0 8px;
    }

    .region-filter-btn {
        font-size: 11px;
        height: 28px;
        padding: 0 8px;
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

    .region-filters {
        gap: 4px;
        padding: 0 4px;
    }

    .region-filter-btn {
        font-size: 10px;
        height: 24px;
        padding: 0 6px;
        border-radius: 12px;
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
