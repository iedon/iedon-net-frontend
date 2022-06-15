<script setup lang="ts">
import { iso31661Alpha2ToNumeric } from 'iso-3166'
import { RouterMetadata } from '../common/packetHandler'

defineProps<{
    router?: RouterMetadata,
    hidePeeringDot?: boolean
}>()
</script>

<template>
    <template v-if="!hidePeeringDot">
        <a-badge v-if="router" dot :offset="[0, 35]" :numberStyle="{width:'15px',minWidth:'15px',height:'15px'}" :color="`${router.openPeering ? (router.sessionCount < router.sessionCapacity ? (router.autoPeering ? 'green' : 'gold') : 'red') : 'red'}`">
            <img v-if="iso31661Alpha2ToNumeric[router.location] !== undefined" :src="`flags/${router.location.toLowerCase()}.svg`" width="48" class="country-flag" />
            <div shape="square" class="text-avatar" v-else-if="router.location"><span>{{ router.location.length > 3 ? router.location.substring(0, 3) : router.location }}</span></div>
        </a-badge>
    </template>
    <template v-else-if="router">
        <img v-if="iso31661Alpha2ToNumeric[router.location] !== undefined" :src="`flags/${router.location.toLowerCase()}.svg`" width="48" class="country-flag" />
        <div shape="square" class="text-avatar" v-else-if="router.location"><span>{{ router.location.length > 3 ? router.location.substring(0, 3) : router.location }}</span></div>
    </template>
</template>

<style scoped>
.country-flag {
    vertical-align: middle;
}
.text-avatar {
    background-color: #1890ff;
    width: 48px !important; /* for consistence with country-flag size */
    height: 35px !important; /* for consistence with country-flag size */
    margin-top: 5px;
    border-radius: 4px;
    font-weight: 500;
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
}
.text-avatar span {
    font-size: 15px;
    color: #fff;
}
</style>
