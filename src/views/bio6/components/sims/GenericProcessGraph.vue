<template>
  <div class="process-graph">
    <p class="instruction">{{ data.instruction }}</p>
    <div class="steps-flow">
      <div
        v-for="(step, i) in data.steps"
        :key="step.id"
        class="step-wrap"
      >
        <div
          class="step-node"
          :class="{ active: activeStep === i, done: activeStep > i }"
          @click="setStep(i)"
          role="button"
        >
          <div class="step-icon">{{ step.icon }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
        <div v-if="i < data.steps.length - 1" class="step-arrow">↓</div>
      </div>
    </div>
    <div v-if="activeStep !== null" class="step-detail">
      <div class="sd-title">{{ data.steps[activeStep].label }}</div>
      <div class="sd-desc">{{ data.steps[activeStep].desc }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ data: Object, nodeId: String })
const emit = defineEmits(['completed'])

const activeStep = ref(0)
const maxReached = ref(0)

function setStep(i) {
  activeStep.value = i
  if (i > maxReached.value) maxReached.value = i
  if (maxReached.value >= props.data.steps.length - 1) {
    emit('completed', { ok: true })
  }
}
</script>

<style scoped>
.process-graph {}

.instruction {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.steps-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-bottom: 12px;
}

.step-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.step-node {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: border-color 0.12s;
}

.step-node.active {
  border-color: var(--accent-gold);
  background: rgba(232,200,145,0.06);
}

.step-node.done { border-color: var(--correct); opacity: 0.7; }

.step-icon { font-size: 18px; flex-shrink: 0; }

.step-label {
  font-size: 14px;
  font-weight: 500;
}

.step-arrow {
  color: var(--text-muted);
  font-size: 16px;
  padding: 2px 0;
}

.step-detail {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
}

.sd-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 6px;
}

.sd-desc {
  font-size: 13px;
  line-height: 1.6;
}
</style>
