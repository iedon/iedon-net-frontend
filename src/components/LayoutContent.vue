<script setup lang="ts">
</script>

<template>
  <a-layout-content id="content">
    <a-layout class="page">
      <router-view></router-view>
    </a-layout>
  </a-layout-content>
</template>

<style scoped>
#content {
  margin-top: 64px;
  padding: 0 50px;
}
#content:deep(.page) {
  margin-top: 30px;
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
}
</style>
