<template>
    <div class="landing-page">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-container">
                <div class="hero-content">
                    <div class="hero-text">
                        <div class="title-badge-container">
                            <h1 class="hero-title">{{ siteConfig?.netName }}</h1>
                            <div class="asn-badge">{{ siteConfig?.netAsn ? `AS${siteConfig.netAsn}` : 'DN42 Network' }}
                            </div>
                        </div>
                        <p class="hero-subtitle">
                            {{ t('pages.landing.subTitle') }}
                        </p>
                        <div class="hero-buttons">
                            <a-button type="primary" size="large" @click="startPeering" class="btn-peering">
                                <template #icon>
                                    <thunderbolt-outlined />
                                </template>
                                {{ t('pages.landing.startPeering') }}
                            </a-button>
                            <a-button size="large" @click="scrollToMap" class="btn-secondary">
                                {{ t('pages.landing.viewGlobalMap') }}
                            </a-button>
                        </div>
                    </div>
                    <div class="hero-logo">
                        <div class="logo-container">
                            <img src="../../assets/logo_pure.svg" alt="iEdon Logo" width="130" />
                        </div>
                    </div>
                </div>
            </div>
        </section> <!-- Statistics Section -->
        <section class="stats-section">
            <div class="stats-container">
                <div class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-number">{{ totalRouters }}</div>
                        <p class="stats-label">{{ t('pages.nodes.totalRouters') }}</p>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">{{ availableForAuto }}</div>
                        <p class="stats-label">{{ t('pages.nodes.availableForAuto') }}</p>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">{{ totalSessions }}</div>
                        <p class="stats-label">{{ t('pages.nodes.totalSessions') }}</p>
                    </div>
                </div>
            </div>
        </section><!-- Map Section -->
        <section class="map-section" id="nodes">
            <div class="map-container">
                <h2 class="section-title">{{ t('pages.landing.globalNetworkMap') }}</h2>
                <p class="section-subtitle">
                    {{ t('pages.landing.mapDescription') }}
                </p>
                <div class="map-wrapper">
                    <iframe width="100%" height="450" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                        src="./map.htm" class="network-map"></iframe>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
            <div class="features-container">
                <h2 class="section-title">{{ t('pages.landing.whyChoose') }}</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <thunderbolt-outlined />
                        </div>
                        <h3 class="feature-title">{{ t('pages.landing.automaticPeering') }}</h3>
                        <p class="feature-description">
                            {{ t('pages.landing.automaticPeeringDescription') }}
                        </p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <global-outlined />
                        </div>
                        <h3 class="feature-title">{{ t('pages.landing.globalNetwork') }}</h3>
                        <p class="feature-description">
                            {{ t('pages.landing.globalNetworkDescription') }}
                        </p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">
                            <safety-outlined />
                        </div>
                        <h3 class="feature-title">{{ t('pages.landing.secureAndReliable') }}</h3>
                        <p class="feature-description">
                            {{ t('pages.landing.secureAndReliableDescription') }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
    ThunderboltOutlined,
    GlobalOutlined,
    SafetyOutlined
} from '@ant-design/icons-vue'
import { makeRequest, RouterMetadata, RoutersResponse } from '../../common/packetHandler'
import { siteConfig } from '../../common/helper'

const { t } = useI18n()
const router = useRouter()

// Reactive data
const nodes = ref<RouterMetadata[]>([])

// Computed properties
const totalRouters = computed(() => nodes.value.length)
const totalSessions = computed(() => nodes.value.reduce((sum, r) => sum + r.sessionCount, 0))
const availableForAuto = computed(() => nodes.value.filter(r => r.openPeering && r.autoPeering && r.sessionCount < r.sessionCapacity).length)

// Methods
const fetchNodes = async () => {
    try {
        const resp = await makeRequest(t, '/list/routers')
        if (resp.success && resp.response) {
            const data = resp.response as RoutersResponse
            if (data && Array.isArray(data.routers)) {
                nodes.value = data.routers.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            }
        }
    } catch (error) {
        console.error('Failed to fetch nodes:', error)
    }
}

const startPeering = () => {
    router.push('/nodes')
}

const scrollToMap = () => {
    const element = document.getElementById('nodes')
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

// Lifecycle
onMounted(() => {
    fetchNodes()
})
</script>

<style scoped>
.landing-page {
    width: 100%;
    min-height: 100vh;
}

/* Hero Section */
.hero-section {
    padding: 4rem 0 3rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    position: relative;
    overflow: hidden;
}

.dark .hero-section {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 3rem;
    align-items: center;
}

.title-badge-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.asn-badge {
    display: inline-block;
    background: rgba(24, 144, 255, 0.1);
    color: #1890ff;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    text-align: center;
    flex-shrink: 0;
    margin-top: 6px;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    color: #1a1a1a;
}

.dark .hero-title {
    color: #ffffff;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 600px;
}

.dark .hero-subtitle {
    color: #aaa;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
}

.btn-peering {
    height: 48px;
    padding: 0 2rem;
    font-size: 1rem;
    border-radius: 6px;
}

.btn-secondary {
    height: 48px;
    padding: 0 2rem;
    font-size: 1rem;
    border-radius: 6px;
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    background: rgba(24, 144, 255, 0.1);
    border-radius: 50%;
}

/* Statistics Section */
.stats-section {
    padding: 4rem 0;
    background: #fff;
}

.dark .stats-section {
    background: #1a1a1a;
}

.stats-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.stats-card {
    text-align: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.dark .stats-card {
    background: #2a2a2a;
}

.stats-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1890ff;
    margin-bottom: 0.5rem;
}

.stats-label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    font-weight: 600;
    margin: 0;
}

.dark .stats-label {
    color: #aaa;
}

/* Map Section */
.map-section {
    padding: 4rem 0;
    background: #f8f9fa;
}

.dark .map-section {
    background: #0f0f0f;
}

.map-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.map-wrapper {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: -20px;
}

.dark .map-wrapper {
    background: #1a1a1a;
}

.network-map {
    width: 100%;
    height: 450px;
    border: none;
    display: block;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1rem;
    color: #1a1a1a;
}

.dark .section-title {
    color: #ffffff;
}

.section-subtitle {
    font-size: 1.1rem;
    color: #666;
    text-align: center;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.dark .section-subtitle {
    color: #aaa;
}

/* Features Section */
.features-section {
    padding: 4rem 0;
    background: #fff;
}

.dark .features-section {
    background: #1a1a1a;
}

.features-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.feature-card {
    text-align: center;
    padding: 2rem;
}

.feature-icon {
    font-size: 3rem;
    color: #1890ff;
    margin-bottom: 1.5rem;
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1a1a1a;
}

.dark .feature-title {
    color: #ffffff;
}

.feature-description {
    color: #666;
    line-height: 1.6;
    margin: 0;
}

.dark .feature-description {
    color: #aaa;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-logo {
        display: none;
    }

    .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .title-badge-container {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .btn-peering,
    .btn-secondary {
        width: 100%;
        max-width: 300px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .section-title {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {

    .hero-container,
    .stats-container,
    .nodes-container,
    .features-container {
        padding: 0 1rem;
    }

    .hero-section {
        padding: 2rem 0;
    }

    .stats-section,
    .nodes-section,
    .features-section {
        padding: 2rem 0;
    }
}
</style>
