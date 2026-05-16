<template>
  <div class="dyk-section">
    <h3 class="dyk-title">🌟 Знаешь ли ты?</h3>
    <div class="dyk-list">
      <div v-for="fact in facts" :key="fact.id" class="dyk-card">
        <div class="dyk-text">{{ fact.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ facts: Array })
</script>

<style scoped>
.dyk-section { margin-bottom: 24px; }

.dyk-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}

.dyk-list { display: flex; flex-direction: column; gap: 8px; }

.dyk-card {
  background: linear-gradient(135deg, #1a2030 0%, var(--bg-card) 100%);
  border: 1px solid #2a3040;
  border-radius: var(--radius);
  padding: 14px;
}

.dyk-text {
  font-size: 14px;
  line-height: 1.6;
}
</style>
