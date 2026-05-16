<template>
  <div class="progress-bar-wrap" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
    <div class="pb-row">
      <span class="pb-label">Прогресс темы</span>
      <span class="pb-pct">{{ progress }}%</span>
    </div>
    <div class="pb-track">
      <div class="pb-fill" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({ progress: { type: Number, default: 0 } })
</script>

<style scoped>
.progress-bar-wrap {
  margin-bottom: 20px;
}

.pb-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.pb-label {
  font-size: 12px;
  color: var(--text-muted);
}

.pb-pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-gold);
}

.pb-track {
  height: 4px;
  background: var(--bg-elevated);
  border-radius: 4px;
  overflow: hidden;
}

.pb-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-gold));
  border-radius: 4px;
  transition: width 0.5s ease;
}
</style>
