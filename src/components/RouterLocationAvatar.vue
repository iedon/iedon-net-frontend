<script setup lang="ts">
import { iso31661Alpha2ToNumeric } from 'iso-3166'
import { RouterMetadata } from '../common/packetHandler'
import config from "../config"

const props = defineProps<{
    router?: RouterMetadata,
    hidePeeringDot?: boolean,
    color?: string
}>()
</script>

<template>
    <template v-if="!hidePeeringDot">
        <a-badge v-if="router" :dot="props.color !== undefined && props.color !== null && props.color !== ''" :color="props.color" :offset="[0, 35]" :numberStyle="{width:'15px',minWidth:'15px',height:'15px'}">
            <img v-if="iso31661Alpha2ToNumeric[router.location] !== undefined" :src="`${config.root}flags/${router.location.toLowerCase()}.svg`" width="48" class="country-flag" />
            <div class="text-box" v-else-if="router.location">
                <div class="text-wrapper">
                    <span class="text-avatar">{{ router.location.length > 3 ? router.location.substring(0, 3) : router.location }}</span>
                </div>
            </div>
        </a-badge>
    </template>
    <template v-else-if="router">
        <img v-if="iso31661Alpha2ToNumeric[router.location] !== undefined" :src="`${config.root}flags/${router.location.toLowerCase()}.svg`" width="48" class="country-flag" />
            <div class="text-box" v-else-if="router.location">
                <div class="text-wrapper">
                    <span class="text-avatar">{{ router.location.length > 3 ? router.location.substring(0, 3) : router.location }}</span>
                </div>
            </div>
    </template>
</template>

<style scoped>
.country-flag {
    vertical-align: middle;
}
.text-box {
    height: 48px;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.text-wrapper {
    border-radius: 4px;
    background-color: #1890ff;
    padding: 5px 8px;
    vertical-align: middle;
}
.text-avatar {
    font-weight: 500;
    font-size: 15px;
    color: #fff;
}
</style>
