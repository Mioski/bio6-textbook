<template>
  <div class="chain-card" :class="type">
    <div class="chain-icon">{{ type === 'bridge' ? '🔗' : '🔄' }}</div>
    <div class="chain-content">
      <div class="chain-label">{{ type === 'bridge' ? 'Следующий шаг' : 'Откуда ты пришёл' }}</div>
      <div class="chain-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'bridge' }, // 'bridge' | 'recap'
  text: String
})
</script>

<style scoped>
.chain-card {
  display: flex;
  gap: 12px;
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 16px;
}

.chain-card.bridge {
  background: rgba(232, 200, 145, 0.07);
  border: 1px solid rgba(232, 200, 145, 0.2);
}

.chain-card.recap {
  background: rgba(168, 197, 216, 0.07);
  border: 1px solid rgba(168, 197, 216, 0.2);
}

.chain-icon { font-size: 20px; flex-shrink: 0; }

.chain-content {}

.chain-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.6;
  margin-bottom: 4px;
}

.chain-card.bridge .chain-label { color: var(--accent-gold); }
.chain-card.recap .chain-label { color: var(--accent-blue); }

.chain-text {
  font-size: 14px;
  line-height: 1.5;
}
</style>
