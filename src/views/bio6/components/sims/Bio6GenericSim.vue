<template>
  <div class="generic-sim">
    <div class="sim-title">🌿 {{ simData.title }}</div>

    <component :is="currentType" v-bind="simProps" @completed="onCompleted" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  simData: Object,
  nodeId: String
})
const emit = defineEmits(['completed'])

// Determine which sub-component to render based on simData.type
const typeMap = {
  compare_two: defineAsyncComponent(() => import('./GenericCompareTwo.vue')),
  tap_reveal: defineAsyncComponent(() => import('./GenericTapReveal.vue')),
  process_graph: defineAsyncComponent(() => import('./GenericProcessGraph.vue')),
}

const currentType = computed(() => typeMap[props.simData?.type] || null)
const simProps = computed(() => ({ data: props.simData, nodeId: props.nodeId }))

function onCompleted(payload) {
  emit('completed', payload)
}
</script>

<style scoped>
.generic-sim {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 20px;
}
.sim-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
}
</style>
