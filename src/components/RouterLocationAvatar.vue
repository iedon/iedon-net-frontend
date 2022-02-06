<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
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
            <country-flag v-if="iso31661Alpha2ToNumeric[router.location] !== undefined" :country="router.location" size="big" class="country-flag" />
            <a-avatar shape="square" class="text-avatar" :size="40" v-else-if="router.location">{{ router.location.length > 3 ? router.location.substring(0, 3) : router.location }}</a-avatar>
        </a-badge>
    </template>
    <template v-else-if="router">
        <country-flag v-if="iso31661Alpha2ToNumeric[router.location] !== undefined" :country="router.location" size="big" class="country-flag" />
        <a-avatar shape="square" class="text-avatar" :size="40" v-else-if="router.location">{{ router.location.length > 3 ? router.location.substring(0, 3) : router.location }}</a-avatar>
    </template>
</template>

<style scoped>
.country-flag {
    border-radius: 5px;
    border: 1px solid #eee;
    vertical-align: middle;
}
.text-avatar {
    color: #fff;
    background-color: #1890ff;
    width: 52px !important; /* for consistence with country-flag size "big" */
    font-weight: 500;
    vertical-align: middle;
}
</style>
