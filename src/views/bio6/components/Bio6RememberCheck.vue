<template>
  <div class="remember-check">
    <div class="section-header">
      <span class="section-icon">📌</span>
      <span class="section-title">Запомни</span>
    </div>

    <ul class="remember-list">
      <li v-for="(fact, i) in remember" :key="i" class="remember-item">
        <span class="bullet">▸</span>
        <span>{{ fact }}</span>
      </li>
    </ul>

    <div class="check-header">
      <span class="section-icon">🔍</span>
      <span class="section-title">Проверь себя</span>
      <span class="check-hint">(нажми на карточку, чтобы увидеть ответ)</span>
    </div>

    <div class="check-cards">
      <div
        v-for="item in check"
        :key="item.id"
        class="flip-card"
        :class="{ flipped: flipped.has(item.id) }"
        @click="toggle(item.id)"
      >
        <div class="flip-inner">
          <div class="flip-front">
            <span class="q-label">?</span>
            <p class="q-text">{{ item.question }}</p>
          </div>
          <div class="flip-back">
            <p class="a-text">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  remember: { type: Array, default: () => [] },
  check: { type: Array, default: () => [] }
})

const flipped = ref(new Set())

function toggle(id) {
  const next = new Set(flipped.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  flipped.value = next
}
</script>

<style scoped>
.remember-check {
  margin-bottom: 24px;
}

.section-header,
.check-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon {
  font-size: 18px;
  line-height: 1;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.check-hint {
  font-size: 11px;
  color: var(--text-muted);
  font-style: italic;
}

.check-header {
  margin-top: 20px;
  flex-wrap: wrap;
}

.remember-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #0d1f0d;
  border: 1px solid #2a4a2a;
  border-radius: var(--radius);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.remember-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
}

.bullet {
  color: var(--accent-green);
  flex-shrink: 0;
  margin-top: 1px;
}

.check-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flip-card {
  height: 80px;
  cursor: pointer;
  perspective: 800px;
  border-radius: var(--radius);
}

.flip-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.35s ease;
  border-radius: var(--radius);
}

.flip-card.flipped .flip-inner {
  transform: rotateY(180deg);
}

.flip-front,
.flip-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
}

.flip-front {
  background: #161b22;
  border: 1px solid #30363d;
}

.flip-back {
  background: #0d2a1a;
  border: 1px solid #2a5a3a;
  transform: rotateY(180deg);
}

.q-label {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-gold);
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.q-text {
  font-size: 13px;
  line-height: 1.4;
  color: var(--text);
  margin: 0;
}

.a-text {
  font-size: 13px;
  line-height: 1.5;
  color: #7ee89a;
  margin: 0;
}
</style>
