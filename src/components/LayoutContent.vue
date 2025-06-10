<script setup lang="ts">
import { themeName } from '../common/helper'
</script>

<template>
    <a-layout-content id="content">
        <a-layout class="page" :class="themeName">
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <component :is="Component"></component>
                </transition>
            </router-view>
        </a-layout>
    </a-layout-content>
</template>

<style scoped>
#content {
    width: 100%;
}

#content:deep(.page) {
    padding-top: 65px;
    overflow: hidden;
    max-width: 1440px;
    margin: 0 auto;
}

#content:deep(.page).light {
    background-color: #fff;
}

#content:deep(.page).dark {
    background-color: #161616;
    color: #949fa9;
}

.fade-enter-active,
.fade-leave-active {
    transition-property: opacity;
    transition-duration: .25s;
}

.fade-enter-active {
    transition-delay: .25s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}
</style>
