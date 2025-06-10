<template>
    <a-layout>
        <a-layout-content id="metrics" v-if="sessionMetrics && routerInfo">
            <!-- Header Actions -->
            <div class="header-actions">
                <a-button @click="goBack" type="text" size="large" class="back-button">
                    <template #icon>
                        <arrow-left-outlined />
                    </template>
                    {{ t('pages.metrics.back') }}
                </a-button>
                <a-button @click="refreshData" :loading="loading" type="primary" size="large">
                    <template #icon>
                        <reload-outlined />
                    </template>
                    {{ t('pages.metrics.refresh') }}
                </a-button>
            </div>

            <!-- Session Information -->
            <div class="session-header">
                <div class="session-header-main">
                    <router-location-avatar :router="routerInfo" :hide-peering-dot="true" />
                    <div class="session-info">
                        <h1 class="session-title">{{ routerInfo.name }}</h1>
                        <div class="session-metadata">
                            <div class="session-row">
                                <div class="session-item">
                                    <span class="session-label">{{ t('pages.metrics.sessionId') }}</span>
                                    <span class="session-value copyable" @click="copySessionId"
                                        :title="t('pages.metrics.clickToCopy')">{{ sessionId }}</span>
                                </div>
                                <div class="session-item">
                                    <span class="session-label">{{ t('pages.metrics.bgpExtensions') }}</span>
                                    <span class="session-value copyable" @click="copyBgpExtensions"
                                        :title="t('pages.metrics.clickToCopy')">
                                        {{ sessionMetadata?.extensions ? formatBgpExtensions(sessionMetadata.extensions)
                                        :
                                        'Loading...' }}
                                    </span>
                                </div>
                                <div class="session-item">
                                    <span class="session-label">{{ t('pages.metrics.routingPolicy') }}</span>
                                    <span class="session-value copyable" @click="copyRoutingPolicy"
                                        :title="t('pages.metrics.clickToCopy')">
                                        {{ sessionMetadata?.policy !== undefined ?
                                            getRoutingPolicyName(sessionMetadata.policy) :
                                        'Loading...' }}
                                    </span>
                                </div>
                                <div class="session-item">
                                    <span class="session-label">{{ t('pages.metrics.lastUpdated') }}</span>
                                    <span class="session-value copyable" @click="copyLastUpdated"
                                        :title="t('pages.metrics.clickToCopy')">
                                        {{ formatRelativeTime(new Date(sessionMetrics.timestamp || +new
                                            Date()).toISOString(), t) }}
                                        ({{ formatDate(new Date(sessionMetrics.timestamp || +new Date()).toISOString())
                                        }})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Session Info Section -->
                <div class="session-info-section" v-if="sessionInfo">
                    <div class="session-info-content" v-html="sessionInfo.parsed"></div>
                </div>
            </div> <!-- Metrics Overview -->
            <div class="metrics-overview" v-if="getLatestMetrics">
                <div class="metrics-grid">
                    <!-- BGP Routes Combined Metric -->
                    <div class="metric-item bgp-routes-combined" @click="scrollToBgpCharts" style="cursor: pointer;"
                        :title="t('pages.metrics.clickToViewChart')">
                        <div class="metric-icon bgp-routes">
                            <line-chart-outlined />
                        </div>
                        <div class="metric-content">
                            <div class="metric-value-row">
                                <div class="metric-value-pair">
                                    <div class="metric-value">{{ getLatestMetrics.bgp?.routes?.ipv4?.imported?.current
                                        || 0 }}</div>
                                    <div class="metric-sub-label">{{ t('pages.metrics.received') }}</div>
                                </div>
                                <div class="metric-separator">|</div>
                                <div class="metric-value-pair">
                                    <div class="metric-value">{{ getLatestMetrics.bgp?.routes?.ipv4?.exported?.current
                                        || 0 }}</div>
                                    <div class="metric-sub-label">{{ t('pages.metrics.advertised') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Traffic Combined Metric -->
                    <div class="metric-item traffic-combined" @click="scrollToInterfaceChart" style="cursor: pointer;"
                        :title="t('pages.metrics.clickToViewChart')">
                        <div class="metric-icon traffic-total">
                            <pie-chart-outlined />
                        </div>
                        <div class="metric-content">
                            <div class="metric-value-row">
                                <div class="metric-value-pair">
                                    <div class="metric-value">{{
                                        formatBytes(getLatestMetrics.interface?.traffic?.total?.[0] || 0)
                                    }}</div>
                                    <div class="metric-sub-label">{{ t('pages.metrics.txTotal') }}</div>
                                </div>
                                <div class="metric-separator">|</div>
                                <div class="metric-value-pair">
                                    <div class="metric-value">{{
                                        formatBytes(getLatestMetrics.interface?.traffic?.total?.[1] || 0)
                                    }}</div>
                                    <div class="metric-sub-label">{{ t('pages.metrics.rxTotal') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RTT Metric -->
                    <div class="metric-item" @click="scrollToRttChart" style="cursor: pointer;"
                        :title="t('pages.metrics.clickToViewChart')">
                        <div class="metric-icon rtt"
                            :class="{ timeout: rttDisplayValue === t('pages.metrics.timeout') }">
                            <dashboard-outlined />
                        </div>
                        <div class="metric-content">
                            <div class="metric-value"
                                :class="{ timeout: rttDisplayValue === t('pages.metrics.timeout') }">
                                {{ rttDisplayValue }}
                                <span v-if="rttDisplayValue !== t('pages.metrics.timeout')"
                                    class="metric-unit">ms</span>
                            </div>
                            <div class="metric-label">{{ t('pages.metrics.currentRtt') }}</div>
                        </div>
                    </div>

                    <!-- BGP Status Metric -->
                    <div class="metric-item" @click="scrollToBgpDetails" style="cursor: pointer;"
                        :title="t('pages.metrics.clickToViewDetails')">
                        <div class="metric-icon bgp-status" :class="{
                            active: bgpInfo.includes('Established'),
                            timeout: isBgpInErrorState
                        }">
                            <api-outlined />
                        </div>
                        <div class="metric-content">
                            <div class="metric-value status" :class="{
                                active: bgpInfo.includes('Established'),
                                timeout: isBgpInErrorState
                            }">
                                {{ bgpInfo }}
                            </div>
                            <div class="metric-label">{{ t('pages.metrics.bgpInfo') }}</div>
                        </div>
                    </div>
                </div>
            </div> <!-- Charts Section -->
            <div class="charts-section">
                <!-- BGP Metrics Charts -->
                <div class="chart-group" ref="bgpChartsSection">
                    <h2 class="section-title">{{ t('pages.metrics.bgpMetrics') }}</h2>
                    <div v-if="sessionMetrics.bgp && sessionMetrics.bgp.length > 0" class="charts-grid">
                        <div class="chart-container">
                            <h3 class="chart-title">{{ t('pages.metrics.routesReceived') }}</h3>
                            <v-chart ref="bgpReceivedChart" :option="bgpReceivedOption"
                                :style="{ height: '300px', width: '100%' }" :autoresize="true" />
                        </div>
                        <div class="chart-container">
                            <h3 class="chart-title">{{ t('pages.metrics.routesAdvertised') }}</h3>
                            <v-chart ref="bgpAdvertisedChart" :option="bgpAdvertisedOption"
                                :style="{ height: '300px', width: '100%' }" :autoresize="true" />
                        </div>
                    </div>
                    <div v-else class="chart-container full-width">
                        <div class="empty-state">
                            <div class="empty-icon">📊</div>
                            <div class="empty-text">{{ t('pages.metrics.noData') }}</div>
                        </div>
                    </div>
                </div>

                <!-- Interface Metrics Chart -->
                <div class="chart-group" ref="interfaceChartSection">
                    <h2 class="section-title">{{ t('pages.metrics.interfaceMetrics') }}</h2>
                    <div class="chart-container full-width">
                        <v-chart ref="interfaceChart"
                            v-if="sessionMetrics.interface?.traffic?.metric && sessionMetrics.interface.traffic.metric.length > 0"
                            :option="interfaceMetricsOption" :style="{ height: '350px', width: '100%' }"
                            :autoresize="true" />
                        <div v-else class="empty-state">
                            <div class="empty-icon">📡</div>
                            <div class="empty-text">{{ t('pages.metrics.noData') }}</div>
                        </div>
                    </div>
                </div>

                <!-- RTT Metrics Chart -->
                <div class="chart-group" ref="rttChartSection">
                    <h2 class="section-title">{{ t('pages.metrics.networkMetrics') }}</h2>
                    <div class="chart-container full-width">
                        <v-chart ref="rttChart"
                            v-if="sessionMetrics.rtt?.metric && sessionMetrics.rtt.metric.length > 0"
                            :option="rttMetricsOption" :style="{ height: '350px', width: '100%' }" :autoresize="true" />
                        <div v-else class="empty-state">
                            <div class="empty-icon">🌐</div>
                            <div class="empty-text">{{ t('pages.metrics.noData') }}</div>
                        </div>
                    </div>
                </div>
            </div> <!-- Details Section -->
            <div class="details-section" ref="detailsSection">
                <h2 class="section-title">{{ t('pages.metrics.detailedMetrics') }}</h2>
                <div class="details-tabs">
                    <a-tabs v-model:activeKey="activeTabKey" size="large"
                        :tabBarStyle="{ marginBottom: '24px', borderBottom: 'none' }"> <!-- Interface Details Tab -->
                        <a-tab-pane key="interface-details" :tab="t('pages.metrics.interfaceDetails')">
                            <div class="table-container">
                                <a-table v-if="hasAnyInterfaceData" :dataSource="[getLatestMetrics!.interface]"
                                    :columns="interfaceColumns" :pagination="false" size="middle" :bordered="false"
                                    :scroll="{ x: 'max-content' }" />
                                <!-- Empty State -->
                                <div v-else class="empty-state">
                                    <div class="empty-icon">📋</div>
                                    <div class="empty-text">{{ t('pages.metrics.noData') }}</div>
                                </div>
                            </div>
                        </a-tab-pane>
                        <!-- BGP Details Tab -->
                        <a-tab-pane key="bgp-details" :tab="t('pages.metrics.bgpDetails')">
                            <div class="table-container">
                                <a-table v-if="hasAnyBgpData" :dataSource="sessionMetrics!.bgp" :columns="bgpColumns"
                                    :pagination="false" size="middle" :bordered="false"
                                    :scroll="{ x: 'max-content' }" />
                                <!-- Empty State -->
                                <div v-else class="empty-state">
                                    <div class="empty-icon">🔗</div>
                                    <div class="empty-text">{{ t('pages.metrics.noData') }}</div>
                                </div>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </a-layout-content>
        <!-- Loading State -->
        <a-layout-content v-else-if="loading" id="metrics">
            <div class="header-actions">
                <a-button @click="goBack" type="text" size="large" class="back-button">
                    <template #icon>
                        <arrow-left-outlined />
                    </template>
                    {{ t('pages.metrics.back') }}
                </a-button>
                <a-button disabled type="primary" size="large">
                    <template #icon>
                        <reload-outlined />
                    </template>
                    {{ t('pages.metrics.refresh') }}
                </a-button>
            </div>
            <div class="loading-container">
                <a-spin size="large" :tip="t('pages.metrics.loadingMetrics')" />
            </div>
        </a-layout-content>

        <!-- Error State -->
        <a-layout-content v-else id="metrics">
            <div class="header-actions">
                <a-button @click="goBack" type="text" size="large" class="back-button">
                    <template #icon>
                        <arrow-left-outlined />
                    </template>
                    {{ t('pages.metrics.back') }}
                </a-button>
            </div>
            <div class="error-container">
                <a-result status="404" :title="t('pages.metrics.noMetricsFound')"
                    :sub-title="t('pages.metrics.noMetricsFoundDesc')">
                    <template #extra>
                        <a-button type="primary" @click="goBack">
                            {{ t('pages.metrics.goBack') }}
                        </a-button>
                    </template>
                </a-result>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script setup lang="ts">
// =============================================================================
// IMPORTS
// =============================================================================
import { onMounted, Ref, ref, computed, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import {
    ArrowLeftOutlined,
    ReloadOutlined,
    LineChartOutlined,
    DashboardOutlined,
    ApiOutlined,
    PieChartOutlined
} from '@ant-design/icons-vue'

// ECharts imports
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    ToolboxComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// Application imports
import { loggedIn, formatDate, formatRelativeTime, themeName, isAdmin } from '../../common/helper'
import { makeRequest, SessionMetric, RouterMetadata, RoutersResponse, CurrentSessionMetadata, GetCurrentSessionResponse, RoutingPolicy } from '../../common/packetHandler'
import RouterLocationAvatar from '../../components/RouterLocationAvatar.vue'

// Markdown imports
//@ts-ignore
import markdown_it from 'markdown-it'
//@ts-ignore
import mila from 'markdown-it-link-attributes'

// =============================================================================
// INITIALIZATION
// =============================================================================
// Initialize markdown parser
const md = new markdown_it({ html: true })
md.use(mila, { attrs: { target: "_blank" } })

// Register ECharts components
use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    ToolboxComponent
])

// =============================================================================
// COMPOSABLES
// =============================================================================
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// =============================================================================
// REACTIVE STATE
// =============================================================================
const loading = ref(false)
const sessionId = route.params.sessionId as string
const routerId = route.params.routerId as string
const windowWidth = ref(window.innerWidth)

// Data refs
const sessionMetrics: Ref<SessionMetric | null> = ref(null)
const routerInfo: Ref<RouterMetadata | null> = ref(null)
const sessionMetadata: Ref<CurrentSessionMetadata | null> = ref(null)

// Navigation refs
const detailsSection = ref<HTMLElement>()
const rttChartSection = ref<HTMLElement>()
const bgpChartsSection = ref<HTMLElement>()
const interfaceChartSection = ref<HTMLElement>()
const activeTabKey = ref('interface-details')

// Chart refs for manual resize
const bgpReceivedChart = ref()
const bgpAdvertisedChart = ref()
const interfaceChart = ref()
const rttChart = ref()

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================
// Chart configuration
const isDark = computed(() => themeName.value === 'dark')
const chartTheme = computed(() => ({
    backgroundColor: isDark.value ? '#1f1f1f' : '#ffffff',
    textStyle: {
        color: isDark.value ? '#ffffff' : '#333333'
    }
}))

// Get latest metrics data
const getLatestMetrics = computed(() => {
    if (!sessionMetrics.value) return null
    return {
        bgp: sessionMetrics.value.bgp?.[0] || null,
        interface: sessionMetrics.value.interface || null,
        rtt: sessionMetrics.value.rtt || null
    }
})

// Get BGP info from all BGP sessions
const bgpInfo = computed(() => {
    if (!sessionMetrics.value?.bgp || sessionMetrics.value.bgp.length === 0) return 'Unknown'

    const infoArray = sessionMetrics.value.bgp.map(bgp => {
        const info = bgp.info || 'Unknown'
        // Split by space and take the first part to control text size
        return info.split(' ')[0]
    })

    // Join multiple BGP info with comma
    return infoArray.join(', ')
})

// Get RTT display value with timeout handling
const rttDisplayValue = computed(() => {
    const rttValue = getLatestMetrics.value?.rtt?.current
    if (rttValue === undefined || rttValue === null) return '0'
    if (rttValue === -1) return t('pages.metrics.timeout')
    return rttValue.toString()
})

// Get session info from sessionMetrics.data
const sessionInfo = computed(() => {
    if (!sessionMetrics.value?.data || typeof sessionMetrics.value.data === 'string') return null
    const rawInfo = sessionMetrics.value.data.info
    if (!rawInfo) return null

    return {
        raw: rawInfo,
        parsed: md.render(rawInfo)
    }
})

// Check if BGP session is in an error/warning state (not established, not unknown)
const isBgpInErrorState = computed(() => {
    return !bgpInfo.value.includes('Established') && bgpInfo.value !== 'Unknown'
})

// Get the local user's ASN from localStorage
const localUserAsn = computed(() => {
    return localStorage.getItem('asn') || ''
})

// Check if there's any meaningful interface data to display
const hasAnyInterfaceData = computed(() => {
    if (!getLatestMetrics.value?.interface) return false
    const interfaceData = getLatestMetrics.value.interface

    // Check basic interface fields
    const hasBasicData = hasData('ipv4', interfaceData) ||
        hasData('ipv6', interfaceData) ||
        hasData('ipv6LinkLocal', interfaceData) ||
        hasData('mtu', interfaceData) ||
        hasData('status', interfaceData)

    // Check traffic data
    const hasTrafficData = interfaceData.traffic?.current &&
        (interfaceData.traffic.current[0] > 0 || interfaceData.traffic.current[1] > 0)

    return hasBasicData || hasTrafficData
})

// Check if there's any BGP data to display
const hasAnyBgpData = computed(() => {
    return sessionMetrics.value?.bgp && sessionMetrics.value.bgp.length > 0
})

// =============================================================================
// METHODS
// =============================================================================

// Navigation functions
// Generic function to scroll to a section with highlight effect
const scrollToSection = (sectionRef: Ref<HTMLElement | undefined>, highlightColor: string, tabKey?: string) => {
    // Switch tab if specified (for BGP details)
    if (tabKey) {
        activeTabKey.value = tabKey
    }

    // Scroll to section with smooth animation
    nextTick(() => {
        if (sectionRef.value) {
            sectionRef.value.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })

            // Add a brief highlight effect to the section
            sectionRef.value.style.transition = 'all 0.3s ease'
            sectionRef.value.style.transform = 'scale(1.01)'
            sectionRef.value.style.boxShadow = `0 8px 24px ${highlightColor}`

            // Reset the highlight effect after animation
            setTimeout(() => {
                if (sectionRef.value) {
                    sectionRef.value.style.transform = 'scale(1)'
                    sectionRef.value.style.boxShadow = ''
                }
            }, 500)
        }
    })
}

// Specific scroll functions using the generic function
const scrollToBgpDetails = () => scrollToSection(detailsSection, 'rgba(24, 144, 255, 0.15)', 'bgp-details')
const scrollToRttChart = () => scrollToSection(rttChartSection, 'rgba(114, 46, 209, 0.15)')
const scrollToBgpCharts = () => scrollToSection(bgpChartsSection, 'rgba(82, 196, 26, 0.15)')
const scrollToInterfaceChart = () => scrollToSection(interfaceChartSection, 'rgba(255, 77, 79, 0.15)')

// Data fetching functions
const fetchSessionMetrics = async () => {
    try {
        loading.value = true

        const resp = await makeRequest(t, isAdmin.value ? '/admin' : '/session', {
            action: isAdmin.value ? 'querySession' : 'query',
            session: sessionId,
            router: routerId
        })

        if (resp.success && resp.response) {
            const data = resp.response as unknown as SessionMetric
            if (data) {
                sessionMetrics.value = data
            }
        }
    } catch (error) {
        console.error(error)
        message.error(t('pages.metrics.fetchError'))
    } finally {
        loading.value = false
    }
}

const fetchRouterInfo = async () => {
    try {
        const resp = await makeRequest(t, '/list/routers')
        if (resp.success && resp.response) {
            const data = resp.response as RoutersResponse
            if (data && Array.isArray(data.routers)) {
                routerInfo.value = data.routers.find(r => r.uuid === routerId) || null
            }
        }
    } catch (error) {
        console.error(error)
    }
}

const fetchSessionMetadata = async () => {
    try {
        const resp = await makeRequest(t, '/session', {
            action: 'get',
            session: sessionId
        })

        if (resp.success && resp.response) {
            const data = resp.response as unknown as GetCurrentSessionResponse
            if (data?.session) {
                sessionMetadata.value = data.session
            }
        }
    } catch (error) {
        console.error(error)
    }
}

// UI action functions
const goBack = () => {
    router.back()
}

const copyToClipboard = async (value: string, label: string) => {
    try {
        await navigator.clipboard.writeText(value)
    } catch (error) {
        console.error(`Failed to copy ${label}:`, error)
    }
}

const copySessionId = () => copyToClipboard(sessionId, 'session ID')

// Function to format BGP extensions array
const formatBgpExtensions = (extensions: string[]) => {
    if (!extensions || extensions.length === 0) return 'None'
    return extensions.map(ext => {
        const translationKey = `pages.peering.${ext}`
        const translated = t(translationKey)
        // If translation exists, use it; otherwise use the original extension name
        return translated !== translationKey ? translated : ext
    }).join(', ')
}

const copyBgpExtensions = () => {
    const extensions = sessionMetadata.value?.extensions
    if (extensions) {
        copyToClipboard(formatBgpExtensions(extensions), 'BGP extensions')
    }
}
const copyRoutingPolicy = () => {
    const policy = sessionMetadata.value?.policy
    if (policy !== undefined) {
        copyToClipboard(getRoutingPolicyName(policy), 'routing policy')
    }
}
const copyLastUpdated = () => {
    const dateStr = formatDate(new Date(sessionMetrics.value?.timestamp || +new Date()).toISOString())
    const relativeStr = formatRelativeTime(new Date(sessionMetrics.value?.timestamp || +new Date()).toISOString(), t)
    copyToClipboard(`${dateStr} ${relativeStr}`, 'last updated')
}

const refreshData = async () => {
    await fetchSessionMetrics()
}

// Handle window resize to trigger chart resize
let resizeTimeout: number | null = null
const handleResize = () => {
    windowWidth.value = window.innerWidth

    if (resizeTimeout) {
        clearTimeout(resizeTimeout)
    }
    resizeTimeout = setTimeout(() => {
        nextTick(() => {
            // Manually trigger resize for all charts
            if (bgpReceivedChart.value) {
                bgpReceivedChart.value.resize()
            }
            if (bgpAdvertisedChart.value) {
                bgpAdvertisedChart.value.resize()
            }
            if (interfaceChart.value) {
                interfaceChart.value.resize()
            }
            if (rttChart.value) {
                rttChart.value.resize()
            }
        })
    }, 100) // Debounce resize events
}

// Utility functions
const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
}

// Function to get routing policy display name
const getRoutingPolicyName = (policy: RoutingPolicy) => {
    const policyNames = {
        [RoutingPolicy.FULL]: t('pages.peering.routingPolicyTypes.FULL'),
        [RoutingPolicy.TRANSIT]: t('pages.peering.routingPolicyTypes.TRANSIT'),
        [RoutingPolicy.PEER]: t('pages.peering.routingPolicyTypes.PEER'),
        [RoutingPolicy.DOWNSTREAM]: t('pages.peering.routingPolicyTypes.DOWNSTREAM'),
        [RoutingPolicy.UPSTREAM]: t('pages.peering.routingPolicyTypes.UPSTREAM')
    }
    return policyNames[policy] || 'Unknown'
}

// =============================================================================
// LIFECYCLE HOOKS
// =============================================================================
onMounted(async () => {
    if (!loggedIn.value) {
        message.info(t('pages.nodes.pleaseSignIn'))
        router.replace({ path: '/signin' })
        return
    }

    if (!sessionId || !routerId) {
        message.error(t('pages.metrics.invalidSession'))
        router.back()
        return
    }

    await fetchSessionMetrics()
    await fetchRouterInfo()
    await fetchSessionMetadata()

    // Add window resize listener for chart responsiveness
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

// =============================================================================
// CHART OPTIONS
// =============================================================================
const bgpReceivedOption = computed(() => {
    if (!sessionMetrics.value?.bgp || sessionMetrics.value.bgp.length === 0) return {}

    const bgpData = sessionMetrics.value.bgp[0] // Get first BGP session
    if (!bgpData.routes) return {}

    // Extract timestamps and route counts for received routes
    const timestamps: string[] = []
    const routesReceived: number[] = []
    bgpData.routes.ipv4.imported.metric.forEach(([timestamp, value]: [number, number]) => {
        timestamps.push(new Date(timestamp).toLocaleString())
        routesReceived.push(value)
    })

    return {
        ...chartTheme.value,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        grid: { left: '5%', right: '5%', bottom: '10%', top: '5%', containLabel: true },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataZoom: { yAxisIndex: 'none' }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timestamps,
            axisLabel: { color: isDark.value ? '#ffffff' : '#333333' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: isDark.value ? '#ffffff' : '#333333' },
            scale: true,
            splitNumber: 5
        },
        series: [
            {
                name: t('pages.metrics.routesReceived'),
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 3 },
                areaStyle: {
                    opacity: 0.3,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                            { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
                        ]
                    }
                },
                data: routesReceived,
                itemStyle: { color: '#52c41a' }
            }
        ]
    }
})

const bgpAdvertisedOption = computed(() => {
    if (!sessionMetrics.value?.bgp || sessionMetrics.value.bgp.length === 0) return {}

    const bgpData = sessionMetrics.value.bgp[0] // Get first BGP session
    if (!bgpData.routes) return {}

    // Extract timestamps and route counts for advertised routes
    const timestamps: string[] = []
    const routesAdvertised: number[] = []
    bgpData.routes.ipv4.exported.metric.forEach(([timestamp, value]: [number, number]) => {
        timestamps.push(new Date(timestamp).toLocaleString())
        routesAdvertised.push(value)
    })

    return {
        ...chartTheme.value,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        grid: { left: '5%', right: '5%', bottom: '10%', top: '5%', containLabel: true },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataZoom: { yAxisIndex: 'none' }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timestamps,
            axisLabel: { color: isDark.value ? '#ffffff' : '#333333' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: isDark.value ? '#ffffff' : '#333333' },
            scale: true,
            splitNumber: 5
        },
        series: [
            {
                name: t('pages.metrics.routesAdvertised'),
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 3 },
                areaStyle: {
                    opacity: 0.3,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
                        ]
                    }
                },
                data: routesAdvertised,
                itemStyle: { color: '#1890ff' }
            }
        ]
    }
})

const interfaceMetricsOption = computed(() => {
    if (!sessionMetrics.value?.interface?.traffic?.metric) return {}

    const trafficData = sessionMetrics.value.interface.traffic
    const timestamps: string[] = []
    const rxBytes: number[] = []
    const txBytes: number[] = []

    // Extract data from traffic metrics array [timestamp, Tx, Rx]
    trafficData.metric.forEach(([timestamp, tx, rx]: [number, number, number]) => {
        timestamps.push(new Date(timestamp).toLocaleString())
        // Make TX negative for stacked area visualization (TX goes down, RX goes up)
        txBytes.push(-tx)
        rxBytes.push(rx)
    })

    return {
        ...chartTheme.value,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            formatter: (params: any) => {
                let html = `${params[0].axisValue}<br/>`
                params.forEach((item: any) => {
                    const value = Math.abs(item.value) // Show absolute value in tooltip
                    let displayValue: string
                    if (value === 0) {
                        displayValue = '0 B/s'
                    } else if (value < 1024) {
                        displayValue = `${value.toFixed(0)} B/s`
                    } else if (value < 1024 * 1024) {
                        displayValue = `${(value / 1024).toFixed(1)} KB/s`
                    } else if (value < 1024 * 1024 * 1024) {
                        displayValue = `${(value / (1024 * 1024)).toFixed(2)} MB/s`
                    } else {
                        displayValue = `${(value / (1024 * 1024 * 1024)).toFixed(3)} GB/s`
                    }
                    html += `${item.marker} ${item.seriesName}: ${displayValue}<br/>`
                })
                return html
            }
        },
        legend: {
            data: [t('pages.metrics.rxBytes'), t('pages.metrics.txBytes')],
            textStyle: { color: isDark.value ? '#ffffff' : '#333333' }
        },
        grid: { left: '5%', right: '5%', bottom: '10%', top: '15%', containLabel: true },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataZoom: { yAxisIndex: 'none' }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timestamps,
            axisLabel: { color: isDark.value ? '#ffffff' : '#333333' }
        }, yAxis: {
            type: 'value',
            name: t('pages.metrics.bytes'),
            axisLabel: {
                color: isDark.value ? '#ffffff' : '#333333',
                formatter: (value: number) => {
                    const absValue = Math.abs(value)
                    if (absValue === 0) return '0'
                    if (absValue < 1024) return `${absValue.toFixed(0)}B/s`
                    if (absValue < 1024 * 1024) return `${(absValue / 1024).toFixed(0)}KB/s`
                    if (absValue < 1024 * 1024 * 1024) return `${(absValue / (1024 * 1024)).toFixed(1)}MB/s`
                    return `${(absValue / (1024 * 1024 * 1024)).toFixed(2)}GB/s`
                }
            },
            axisLine: {
                show: true,
                lineStyle: { color: isDark.value ? '#ffffff' : '#333333' }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: isDark.value ? '#434343' : '#e8e8e8',
                    type: 'dashed'
                }
            },
            scale: true,
            splitNumber: 6
        },
        series: [
            {
                name: t('pages.metrics.rxBytes'),
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 2 },
                areaStyle: {
                    opacity: 0.6,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(82, 196, 26, 0.8)' },
                            { offset: 1, color: 'rgba(82, 196, 26, 0.2)' }
                        ]
                    }
                },
                data: rxBytes,
                itemStyle: { color: '#52c41a' },
                stack: 'traffic'
            },
            {
                name: t('pages.metrics.txBytes'),
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 2 },
                areaStyle: {
                    opacity: 0.6,
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 77, 79, 0.2)' },
                            { offset: 1, color: 'rgba(255, 77, 79, 0.8)' }
                        ]
                    }
                },
                data: txBytes,
                itemStyle: { color: '#ff4d4f' },
                stack: 'traffic'
            }
        ]
    }
})

const rttMetricsOption = computed(() => {
    if (!sessionMetrics.value?.rtt?.metric) return {}

    const timestamps: string[] = []
    const rttValues: number[] = []

    sessionMetrics.value.rtt.metric.forEach(([timestamp, value]: [number, number]) => {
        timestamps.push(new Date(timestamp).toLocaleString())
        rttValues.push(value)
    })

    return {
        ...chartTheme.value, tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            formatter: (params: any) => {
                let html = `${params[0].axisValue}<br/>`
                params.forEach((item: any) => {
                    const value = item.value
                    const unit = 'ms'
                    html += `${item.marker} ${item.seriesName}: ${value === -1 ? t('pages.metrics.timeout') : value + unit}<br/>`
                })
                return html
            }
        },
        legend: {
            data: [t('pages.metrics.rtt')],
            textStyle: { color: isDark.value ? '#ffffff' : '#333333' }
        },
        grid: { left: '5%', right: '5%', bottom: '10%', top: '15%', containLabel: true },
        toolbox: {
            feature: {
                saveAsImage: {},
                dataZoom: { yAxisIndex: 'none' }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timestamps,
            axisLabel: { color: isDark.value ? '#ffffff' : '#333333' }
        }, yAxis: {
            type: 'value',
            name: t('pages.metrics.rtt') + ' (ms)',
            axisLabel: { color: isDark.value ? '#ffffff' : '#333333' },
            scale: true,
            splitNumber: 5
        },
        series: [
            {
                name: t('pages.metrics.rtt'),
                type: 'line',
                smooth: true,
                data: rttValues,
                itemStyle: { color: '#722ed1' }
            }
        ]
    }
})

// =============================================================================
// TABLE COLUMNS CONFIGURATION
// =============================================================================
// Helper function to check if a field has meaningful data
const hasData = (field: string, data: any) => {
    if (!data) return false
    const value = data[field]
    return value !== null && value !== undefined && value !== '' && value !== 0
}

// Table columns
const interfaceColumns = computed(() => {
    const allColumns = [
        {
            title: t('pages.metrics.interfaceIPv4'),
            dataIndex: 'ipv4',
            key: 'ipv4',
            width: 120,
        },
        {
            title: t('pages.metrics.interfaceIPv6'),
            dataIndex: 'ipv6',
            key: 'ipv6',
            width: 150,
        },
        {
            title: t('pages.metrics.interfaceIPv6LinkLocal'),
            dataIndex: 'ipv6LinkLocal',
            key: 'ipv6LinkLocal',
            width: 180,
        },
        {
            title: t('pages.metrics.interfaceMTU'),
            dataIndex: 'mtu',
            key: 'mtu',
            width: 80
        },
        {
            title: t('pages.metrics.interfaceStatus'),
            dataIndex: 'status',
            key: 'status',
            width: 100
        },
        {
            title: t('pages.metrics.currentRates'),
            key: 'currentRates',
            width: 200,
            customRender: ({ record }: { record: any }) => {
                const rxRate = record.traffic?.current?.[1] || 0
                const txRate = record.traffic?.current?.[0] || 0
                return `↑ ${formatBytes(txRate)}/s, ↓ ${formatBytes(rxRate)}/s`
            }
        }
    ]

    // Filter columns based on available data, but preserve responsive behavior
    const interfaceData = getLatestMetrics.value?.interface
    if (!interfaceData) return allColumns

    return allColumns.filter(column => {
        // Always include columns without dataIndex (like customRender columns)
        if (!column.dataIndex) {
            return true
        }

        // For columns with dataIndex, check if the field has meaningful data
        if (typeof column.dataIndex === 'string') {
            return hasData(column.dataIndex, interfaceData)
        }

        // Include columns with array dataIndex (nested properties)
        return true
    })
})

const bgpColumns = computed(() => [
    {
        title: t('pages.metrics.bgpPeerName'),
        dataIndex: 'name',
        key: 'name',
        width: 150,
        ellipsis: true
    },
    {
        title: t('pages.metrics.bgpState'),
        dataIndex: 'state',
        key: 'state',
        width: 100
    },
    {
        title: t('pages.metrics.bgpInfo'),
        dataIndex: 'info',
        key: 'info',
        width: 200,
        ellipsis: true,
        responsive: ['md'] as const
    },
    {
        title: t('pages.metrics.routesReceived'),
        dataIndex: ['routes', 'ipv4', 'imported', 'current'],
        key: 'routesReceived',
        width: 120,
        customRender: ({ text }: { text: number }) => formatNumber(text)
    },
    {
        title: t('pages.metrics.routesAdvertised'),
        dataIndex: ['routes', 'ipv4', 'exported', 'current'],
        key: 'routesAdvertised',
        width: 120,
        customRender: ({ text }: { text: number }) => formatNumber(text)
    }
])
</script>

<style scoped>
#metrics {
    padding: 24px;
    background: #fff;
    min-height: 100vh;
}

.dark #metrics {
    background: #0f0f0f;
}

/* Header Actions */
.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 4px;
}

.back-button {
    color: #666 !important;
    font-weight: 500;
}

.back-button:hover {
    color: #1890ff !important;
    background: rgba(24, 144, 255, 0.06) !important;
}

.dark .back-button {
    color: #999 !important;
}

.dark .back-button:hover {
    color: #40a9ff !important;
    background: rgba(64, 169, 255, 0.1) !important;
}

/* Session Header */
.session-header {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    margin-bottom: 24px;
}

.dark .session-header {
    background: #1a1a1a;
    border-color: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.session-header-main {
    display: flex;
    align-items: flex-start;
    padding: 24px;
    gap: 20px;
}

.session-header-main:deep(img) {
    margin: 0 auto;
}

.session-info {
    flex: 1;
    min-width: 0;
}

.session-title {
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.3;
}

.dark .session-title {
    color: #ffffff;
}

.session-metadata {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.session-row {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    align-items: flex-start;
}

.session-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
    min-width: 140px;
    width: 100%;
}

.session-label {
    color: #8c8c8c;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    line-height: 1.2;
}

.dark .session-label {
    color: #999;
}

.session-value {
    color: #1a1a1a;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    line-height: 1.4;
    word-break: break-all;
    overflow-wrap: break-word;
    max-width: 100%;
}

.session-value.copyable {
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid transparent;
    margin: -6px -8px;
    display: inline-block;
    max-width: calc(100% + 16px);
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.session-value.copyable:hover {
    color: #1890ff;
    word-break: break-all;
    max-height: none;
    overflow: visible;
    z-index: 10;
    position: relative;
}

.dark .session-value.copyable:hover {
    color: #40a9ff;
}

.dark .session-value {
    color: #ffffff;
}

.session-info-section {
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
}

.dark .session-info-section {
    border-top-color: #2a2a2a;
    background: rgba(255, 255, 255, 0.02);
}

.session-info-content {
    padding: 5px 24px;
    color: #333;
    font-size: 14px;
    line-height: 1.6;
    user-select: text;
}

.dark .session-info-content {
    color: #e6e6e6;
}

/* Style markdown content in session info */

.session-info-content:deep(p) {
    margin: 12px auto;
}

.session-info-content:deep(code) {
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

.dark .session-info-content:deep(code) {
    background-color: #2d3748;
    color: #f56565;
    border-color: #4a5568;
}

.dark .session-id,
.dark .last-updated {
    color: #aaa;
}

/* Metrics Overview */
.metrics-overview {
    margin: 40px auto;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
}

.metric-item {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    transition: all 0.2s ease;
}

.metric-item:hover {
    border-color: #d9d9d9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Special styling for timeout metric items */
.metric-item:has(.timeout) {
    border-color: rgba(255, 77, 79, 0.3);
    background: linear-gradient(135deg, rgba(255, 77, 79, 0.02), rgba(255, 77, 79, 0.05));
}

.metric-item:has(.timeout):hover {
    border-color: rgba(255, 77, 79, 0.5);
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.15);
}

/* Clickable metric items */
.metric-item[style*="cursor: pointer"] {
    position: relative;
}

.metric-item[style*="cursor: pointer"]::after {
    content: '→';
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 12px;
    color: #999;
    opacity: 0;
    transition: all 0.3s ease;
    transform: translateX(-5px);
}

.metric-item[style*="cursor: pointer"]:hover::after {
    opacity: 1;
    transform: translateX(0);
}

.metric-item[style*="cursor: pointer"]:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.metric-item[style*="cursor: pointer"]:active {
    transform: translateY(-1px);
    transition: transform 0.1s ease;
}

.dark .metric-item {
    background: #1a1a1a;
    border-color: #2a2a2a;
}

.dark .metric-item:has(.timeout) {
    border-color: rgba(255, 119, 117, 0.4);
    background: linear-gradient(135deg, rgba(255, 119, 117, 0.05), rgba(255, 119, 117, 0.08));
}

.dark .metric-item:has(.timeout):hover {
    border-color: rgba(255, 119, 117, 0.6);
    box-shadow: 0 4px 12px rgba(255, 119, 117, 0.2);
}

/* Dark mode clickable metric items */
.dark .metric-item[style*="cursor: pointer"]::after {
    color: #666;
}

.dark .metric-item[style*="cursor: pointer"]:hover {
    box-shadow: 0 6px 16px rgba(255, 255, 255, 0.1);
}

.dark .metric-item:hover {
    border-color: #404040;
}

.metric-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-right: 16px;
    flex-shrink: 0;
}

.metric-icon.bgp-routes {
    background: linear-gradient(135deg, #1890ff, #40a9ff);
    color: white;
}

.metric-value-row {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 12px;
    margin-bottom: 4px;
}

.metric-value-pair {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
}

.metric-value-pair .metric-value {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
    line-height: 1.1;
}

.dark .metric-value-pair .metric-value {
    color: #ffffff;
}

.metric-sub-label {
    font-size: 11px;
    color: #999;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
}

.dark .metric-sub-label {
    color: #777;
}

.metric-separator {
    font-size: 16px;
    color: #d9d9d9;
    font-weight: 300;
}

.dark .metric-separator {
    color: #595959;
}

.metric-icon.routes-received {
    background: linear-gradient(135deg, #52c41a, #73d13d);
    color: white;
}

.metric-icon.routes-advertised {
    background: linear-gradient(135deg, #1890ff, #40a9ff);
    color: white;
}

.metric-icon.traffic-total {
    background: linear-gradient(135deg, #fa8c16, #ffa940);
    color: white;
}

.metric-icon.traffic-tx {
    background: linear-gradient(135deg, #ff4d4f, #ff7875);
    color: white;
}

.metric-icon.traffic-rx {
    background: linear-gradient(135deg, #52c41a, #73d13d);
    color: white;
}

.metric-icon.rtt {
    background: linear-gradient(135deg, #722ed1, #9254de);
    color: white;
}

.metric-icon.rtt.timeout {
    background: linear-gradient(135deg, #ff4d4f, #ff7875);
    animation: pulse-timeout-slow 2.5s ease-in-out infinite;
}

.metric-icon.bgp-status {
    background: linear-gradient(135deg, #ff4d4f, #ff7875);
    color: white;
}

.metric-icon.bgp-status.active {
    background: linear-gradient(135deg, #52c41a, #73d13d);
}

.metric-icon.bgp-status.timeout {
    background: linear-gradient(135deg, #ff4d4f, #ff7875);
    animation: pulse-timeout-slow 2.5s ease-in-out infinite;
}

@keyframes pulse-timeout-slow {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(1.02);
    }
}

.metric-content {
    flex: 1;
    min-width: 0;
}

.metric-value {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
    line-height: 1.2;
}

.dark .metric-value {
    color: #ffffff;
}

.metric-value.status {
    color: #ff4d4f;
    font-size: 16px;
}

.metric-value.status.active {
    color: #52c41a;
}

.metric-value.status.timeout {
    color: #ff4d4f;
    font-weight: 700;
    animation: pulse-timeout-text 2.5s ease-in-out infinite;
}

@keyframes pulse-timeout-text {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.6;
    }
}

.dark .metric-value.status.timeout {
    color: #ff7875;
}

.metric-value.timeout {
    color: #ff4d4f;
    font-weight: 700;
    animation: pulse-timeout 2s ease-in-out infinite;
}

@keyframes pulse-timeout {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.dark .metric-value.timeout {
    color: #ff7875;
}

.metric-unit {
    font-size: 14px;
    color: #666;
    margin-left: 2px;
}

.dark .metric-unit {
    color: #aaa;
}

.metric-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.dark .metric-label {
    color: #aaa;
}

/* Charts Section */
.charts-section {
    margin-bottom: 40px;
}

.chart-group {
    margin-bottom: 40px;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 24px 0;
    padding: 0 4px;
}

.dark .section-title {
    color: #ffffff;
}

.charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.chart-container {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    padding: 24px;
    transition: all 0.2s ease;
    overflow: hidden;
    /* Prevent chart overflow */
}

.chart-container:hover {
    border-color: #d9d9d9;
}

.dark .chart-container {
    background: #1a1a1a;
    border-color: #2a2a2a;
}

.dark .chart-container:hover {
    border-color: #404040;
}

.chart-container.full-width {
    grid-column: 1 / -1;
}

/* Ensure ECharts take full width */
.chart-container .echarts {
    width: 100% !important;
}

/* Fix chart responsiveness */
.chart-container>div {
    width: 100% !important;
}

.chart-title {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
}

.dark .chart-title {
    color: #ffffff;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #8c8c8c;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
}

.empty-text {
    font-size: 16px;
    font-weight: 500;
}

/* Details Section */
.details-section {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    padding: 32px;
}

.dark .details-section {
    background: #1a1a1a;
    border-color: #2a2a2a;
}

.details-tabs .ant-tabs-tab {
    padding: 12px 20px !important;
    margin-right: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.details-tabs .ant-tabs-tab:hover {
    background: #f5f5f5;
}

.dark .details-tabs .ant-tabs-tab:hover {
    background: #2a2a2a;
}

/* Table responsiveness improvements */
.table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table-container .ant-table {
    min-width: 100%;
}

.table-container .ant-table-thead>tr>th {
    white-space: nowrap;
    font-weight: 600;
    background: #fafafa;
    border-bottom: 2px solid #f0f0f0;
}

.dark .table-container .ant-table-thead>tr>th {
    background: #2a2a2a;
    border-bottom-color: #404040;
    color: #ffffff;
}

.table-container .ant-table-tbody>tr>td {
    white-space: nowrap;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
}

.dark .table-container .ant-table-tbody>tr>td {
    border-bottom-color: #2a2a2a;
    color: #e6e6e6;
}

/* Ellipsis handling for long text in tables */
.table-container .ant-table-cell {
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Mobile table styling */
@media (max-width: 768px) {
    .details-section {
        padding: 16px;
    }

    .table-container {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        margin: 0 -16px;
        padding: 0 16px;
        background: #fff;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        /* Smooth scrolling on iOS */
        scrollbar-width: thin;
        scrollbar-color: #d9d9d9 transparent;
    }

    .dark .table-container {
        background: #1a1a1a;
    }

    /* Custom scrollbar for webkit browsers */
    .table-container::-webkit-scrollbar {
        height: 6px;
    }

    .table-container::-webkit-scrollbar-track {
        background: transparent;
    }

    .table-container::-webkit-scrollbar-thumb {
        background: #d9d9d9;
        border-radius: 3px;
    }

    .dark .table-container::-webkit-scrollbar-thumb {
        background: #404040;
    }

    .table-container .ant-table {
        font-size: 12px;
        min-width: 600px;
        /* Ensure minimum width to prevent cramping */
    }

    .table-container .ant-table-thead>tr>th {
        padding: 8px 12px;
        font-size: 11px;
        position: sticky;
        top: 0;
        z-index: 2;
    }

    .table-container .ant-table-tbody>tr>td {
        padding: 8px 12px;
        font-size: 11px;
    }

    .bgp-peer-card {
        margin-bottom: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .bgp-peer-card:last-child {
        margin-bottom: 0;
    }

    .dark .bgp-peer-card {
        background: #1a1a1a;
        border-color: #2a2a2a;
    }

    .rate-display {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    .rate-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: monospace;
        font-size: 11px;
        font-weight: 500;
    }

    /* Highlight scroll indicator */
    .table-container::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 100%;
        background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .table-container:hover::after {
        opacity: 1;
    }

    .dark .table-container::after {
        background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
    }
}

@media (max-width: 480px) {
    .table-container .ant-table {
        font-size: 11px;
        min-width: 500px;
        /* Slightly reduce minimum width for very small screens */
    }

    .table-container .ant-table-thead>tr>th {
        padding: 6px 8px;
        font-size: 10px;
    }

    .table-container .ant-table-tbody>tr>td {
        padding: 6px 8px;
        font-size: 10px;
    }

    .rate-display {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
    }

    .rate-item {
        font-size: 10px;
    }

    .bgp-peer-card {
        margin-bottom: 12px;
    }

    .bgp-peer-card .ant-card-head {
        padding: 8px 12px;
        min-height: auto;
    }

    .bgp-peer-card .ant-card-head-title {
        font-size: 12px;
        font-weight: 600;
    }

    .bgp-peer-card .ant-card-body {
        padding: 8px 12px;
    }
}

.table-container {
    background: #fafafa;
    border-radius: 8px;
    padding: 16px;
}

.dark .table-container {
    background: #0f0f0f;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 80px 20px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.dark .loading-container {
    background: #1a1a1a;
    border-color: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-container {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    padding: 40px 20px;
}

.dark .error-container {
    background: #1a1a1a;
    border-color: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
    #metrics {
        padding: 16px;
    }

    .header-actions {
        margin-bottom: 16px;
        padding: 0 2px;
        gap: 8px;
    }

    .header-actions .ant-btn {
        font-size: 13px;
        height: 36px;
        padding: 4px 12px;
    }

    .session-header {
        border-radius: 8px;
        margin-bottom: 16px;
    }

    .session-header-main {
        flex-direction: column;
        text-align: center;
        padding: 20px 16px;
        gap: 16px;
    }

    .session-info {
        width: 100%;
    }

    .session-title {
        font-size: 20px;
        margin-bottom: 12px;
        text-align: center;
    }

    .session-row {
        flex-direction: column;
        gap: 12px;
    }

    .session-item {
        align-items: center;
        text-align: center;
        min-width: 0;
        flex: none;
    }

    .session-value {
        font-size: 12px;
    }

    .session-info-content {
        padding: 16px;
        font-size: 13px;
    }

    .metrics-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .charts-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .chart-container {
        padding: 16px;
    }

    .details-section {
        padding: 16px;
    }

    .section-title {
        font-size: 18px;
        margin-bottom: 20px;
    }
}

@media (max-width: 480px) {
    #metrics {
        padding: 12px;
    }

    .header-actions {
        padding: 0;
        margin-bottom: 12px;
    }

    .session-header-main {
        padding: 16px 12px;
    }

    .session-title {
        font-size: 18px;
    }

    .session-label {
        font-size: 10px;
    }

    .session-value {
        font-size: 11px;
    }

    .session-row {
        gap: 8px;
    }
}

@media (max-width: 1200px) and (min-width: 769px) {
    .charts-grid {
        gap: 20px;
    }

    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .session-row {
        gap: 20px;
    }

    .session-item {
        min-width: 120px;
    }
}

@media (min-width: 1201px) {
    .metrics-grid {
        grid-template-columns: repeat(4, 1fr);
    }

    .session-row {
        gap: 32px;
    }
}
</style>
