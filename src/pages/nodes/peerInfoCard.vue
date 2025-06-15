<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterInfoResponse, RouterMetadata } from '../../common/packetHandler'
import { siteConfig, themeName } from '../../common/helper'
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import { message } from 'ant-design-vue'

// @ts-ignore
import markdown_it from 'markdown-it'
// @ts-ignore
import mila from 'markdown-it-link-attributes'

const md = new markdown_it().use(mila, { attrs: { target: "_blank" } })

const props = defineProps<{
    router: RouterMetadata,
    routerInfo: RouterInfoResponse | null,
}>()

const { t } = useI18n()
const cardRef = ref<HTMLElement>()
const codeClickHandlers = new Map<HTMLElement, () => void>()

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        message.info(t('pages.nodes.copied'))
    } catch (err) {
        console.error(`Failed to copy ${text}:`, err)
    }
}

const setupCodeListeners = () => {
    if (!cardRef.value) return

    const codeElements = cardRef.value.querySelectorAll('.desc code') as NodeListOf<HTMLElement>
    codeElements.forEach(code => {
        const handler = () => {
            copyToClipboard(code.textContent || '')
        }

        code.addEventListener('click', handler)
        code.style.cursor = 'pointer'

        // Store handler for cleanup
        codeClickHandlers.set(code as HTMLElement, handler)
    })
}

const cleanupCodeListeners = () => {
    codeClickHandlers.forEach((handler, element) => {
        element.removeEventListener('click', handler)
    })
    codeClickHandlers.clear()
}

onMounted(() => {
    nextTick(() => {
        setupCodeListeners()
    })
})

onUnmounted(() => {
    cleanupCodeListeners()
})
</script>

<template>
    <div ref="cardRef" :class="`compact-card ${themeName}`">
        <h3 class="title">{{ t('pages.peering.step2Introduction') }}</h3>

        <div class="info-row">
            <span v-if="props.router.ipv4" class="info-item" @click="copyToClipboard(siteConfig.netAsn)">
                ASN <code>{{ siteConfig.netAsn }}</code>
            </span>
            <span v-if="props.router.ipv4" class="info-item" @click="copyToClipboard(props.router.ipv4)">
                IPv4 <code>{{ props.router.ipv4 }}</code>
            </span>
            <span v-if="props.router.ipv6" class="info-item" @click="copyToClipboard(props.router.ipv6)">
                IPv6 <code>{{ props.router.ipv6 }}</code>
            </span>
            <span v-if="props.router.ipv6LinkLocal" class="info-item"
                @click="copyToClipboard(props.router.ipv6LinkLocal)">
                Link <code>{{ props.router.ipv6LinkLocal }}</code>
            </span>
        </div>

        <div class="info-row">
            <p>{{ t('pages.peering.v4v6force') }}</p>
        </div>

        <div v-if="props.router.description" class="desc" v-html="md.render(props.router.description)"></div>
        <div v-if="props.routerInfo?.info" class="desc" v-html="md.render(props.routerInfo.info)"></div>
    </div>
</template>

<style scoped>
.compact-card {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    font-size: 14px;
}

.compact-card.light {
    --bg: #fff;
    --border: #e2e8f0;
    --text: #2d3748;
    --text-muted: #718096;
    --code-bg: #f7fafc;
    --code-text: #4a5568;
    --hover: #edf2f7;
}

.compact-card.dark {
    --bg: #2d3748;
    --border: #4a5568;
    --text: #f7fafc;
    --text-muted: #a0aec0;
    --code-bg: #4a5568;
    --code-text: #e2e8f0;
    --hover: #4a5568;
}

.title {
    margin: 0 0 25px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
}

.info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    margin-bottom: 12px;
}

.info-item {
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s;
}

.info-item:hover {
    color: var(--text);
}

.info-item code,
.desc:deep(code) {
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

.dark .info-item code,
.dark .desc:deep(code) {
    background-color: #2d3748;
    color: #f56565;
    border-color: #4a5568;
}

.info-item:hover code,
.desc:deep(code:hover) {
    background: var(--hover);
}

.desc {
    color: var(--text);
    line-height: 1.5;
}

.desc:deep(p) {
    margin: 8px 0;
}

.desc:deep(a) {
    color: #3182ce;
    text-decoration: none;
}

.desc:deep(a):hover {
    text-decoration: underline;
}

@media (max-width: 640px) {
    .info-row {
        flex-direction: column;
        gap: 8px;
    }
}
</style>
