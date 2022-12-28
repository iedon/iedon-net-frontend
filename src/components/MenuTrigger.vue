<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

defineProps<{
  trigger?: boolean
}>()
</script>

<template>
    <div class="trigger">
      <div class="trigger-inner">
        <menu-unfold-outlined v-if="trigger" />
        <menu-fold-outlined v-else />
      </div>
    </div>
</template>

<style scoped>
.trigger {
  position: fixed;
  left: 30px;
  bottom: 100px;
  cursor: pointer;
}
.trigger-inner {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #1088e9;
  opacity: 0.65;
  color: #fff;
  text-align: center;
  font-size: 20px;
}
</style>
