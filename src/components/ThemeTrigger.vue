<script setup lang="ts">
import { themeName } from '../common/helper'
import { BulbFilled, BulbOutlined } from '@ant-design/icons-vue'

defineProps<{
  trigger?: boolean
}>()
</script>

<template>
    <div class="trigger">
      <div :class="`trigger-inner ${themeName}`">
        <bulb-outlined v-if="trigger" />
        <bulb-filled v-else />
      </div>
    </div>
</template>

<style scoped>
.trigger {
  position: fixed;
  bottom: 100px;
  right: 100px;
  cursor: pointer;
}
.trigger-inner {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 50%;
  text-align: center;
  font-size: 20px;
  color: #fff;
  transition: all 0.3s;
}
@media (min-width: 0px) and (max-width: 768px /* follow from <a-back-top> */) {
  .trigger {
    right: 60px
  }
}
@media (min-width: 0px) and (max-width: 480px /* follow from <a-back-top> */) {
  .trigger {
    right: 20px
  }
}
.trigger-inner.light {
  background-color: rgba(0, 0, 0, 0.45);
}
.trigger-inner.dark {
  background-color: rgba(255, 255, 255, 0.45);
}
</style>
