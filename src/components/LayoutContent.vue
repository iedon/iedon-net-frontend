<script setup lang="ts">
import { theme } from '../common/helper'
</script>

<template>
  <a-layout-content id="content">
    <a-layout class="page" :class="theme">
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
  margin-top: 64px;
  padding: 0 50px;
}
@media (min-width: 0px) and (max-width: 992px /* lg */) {
  #content {
    padding: 0 5px;
  }
}
#content:deep(.page) {
  margin-top: 30px;
  border-radius: 5px;
  overflow: hidden;
}
#content:deep(.page).light {
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
}
#content:deep(.page).dark {
  background: #161616;
  color: #949fa9;
  box-shadow: 0 2px 8px #101010;
}
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}
.fade-enter-active {
  transition-delay: .25s;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
