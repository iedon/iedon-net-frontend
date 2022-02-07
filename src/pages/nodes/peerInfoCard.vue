<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterInfoResponse, RouterMetadata } from '../../common/packetHandler'
import { siteConfig } from '../../common/helper'

//@ts-ignore
import markdown_it from 'markdown-it'

const md = new markdown_it()

const props = defineProps<{
    router: RouterMetadata,
    routerInfo: RouterInfoResponse | null,
}>()

const t = useI18n().t
</script>

<template>
    <div class="info">
        <h2>{{ t('pages.peering.step2Introduction') }}</h2>
        <ul class="detail">
            <li v-if="props.router.ipv4">ASN<code>{{ siteConfig.netAsn }}</code></li>
            <li v-if="props.router.ipv4">IPv4<code>{{ props.router.ipv4 }}</code></li>
            <li v-if="props.router.ipv6">IPv6<code>{{ props.router.ipv6 }}</code></li>
            <li v-if="props.router.ipv6LinkLocal">IPv6 Link Local<code>{{ props.router.ipv6LinkLocal }}</code></li>
        </ul>
        <div class="desc" v-if="props.router.description" v-html="md.render(props.router.description)"></div>
        <div class="desc" v-if="props.routerInfo && props.routerInfo.info" v-html="md.render(props.routerInfo.info)"></div>
    </div>
</template>

<style scoped>
.info {
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 50px;
    user-select: text;
}
.info .detail {
    margin-top: 20px;
}
.info .detail code, .info .desc:deep(code) {
    background-color: #f1f1f1;
    border-radius: 5px;
    color: #666;
    font-size: 13px;
    padding: 0.15em 0.3em;
    margin-left: 10px;
    line-height: 200%;
}
.info .desc {
    margin-top: 20px;
    min-width: 300px;
}
.info .desc:deep(p) {
    margin-bottom: 0.5em;
}
</style>
