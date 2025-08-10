<script setup lang="ts">
import { themeName } from '../common/helper'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const transitionName = ref('page-transition')

// Optional: Different transitions based on route hierarchy
watch(() => route.path, (to, from) => {
  // You can customize transition based on navigation direction
  // For now, using consistent transition for better UX
  transitionName.value = 'page-transition'
})
</script>

<template>
    <a-layout-content id="content">
        <a-layout class="page" :class="themeName">
            <router-view v-slot="{ Component, route }">
                <transition :name="transitionName" mode="out-in" appear>
                    <component :is="Component" :key="route.path"></component>
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

#content:deep(.page:has(.landing-page)),
#content:deep(.page:has(.nodes-page)),
#content:deep(.page:has(#manage-page)) {
    max-width: 100% !important;
}

#content:deep(.page:has(.nodes-page)) {
    background-color: #f9f9f9 !important;
}

#content:deep(.page:has(.nodes-page).dark) {
    background: #0f0f0f !important;
}

#content:deep(.page).light {
    background-color: #fff;
}

#content:deep(.page).dark {
    background-color: #161616;
    color: #949fa9;
}

/* Modern, human-friendly page transition animations */
.page-transition-enter-active,
.page-transition-leave-active {
    transition: all 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-origin: center center;
}

.page-transition-enter-active {
    transition-delay: 0.08s;
}

.page-transition-enter-from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
    filter: blur(1px);
}

.page-transition-leave-to {
    opacity: 0;
    transform: translateY(-12px) scale(1.01);
    filter: blur(0.5px);
}

.page-transition-enter-to,
.page-transition-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
}

/* Performance optimizations */
.page-transition-enter-active *,
.page-transition-leave-active * {
    will-change: transform, opacity;
}

.page-transition-enter-to *,
.page-transition-leave-from * {
    will-change: auto;
}
</style>
