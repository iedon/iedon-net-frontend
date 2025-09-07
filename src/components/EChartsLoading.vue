<template>
  <div class="echarts-loading" :style="{ height: height, display: 'flex', alignItems: 'center', justifyContent: 'center' }">
    <div style="text-align: center;">
      <div class="loading-spinner" style="width: 24px; height: 24px; border: 2px solid #f3f3f3; border-top: 2px solid #1890ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 12px;"></div>
      <div style="color: #666; font-size: 14px;">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  height?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  height: '300px',
  message: 'Loading...'
})
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
</style>
