<template>
  <div class="cheatsheet-wrap">
    <button class="cheatsheet-toggle" @click="open = !open" :aria-expanded="open">
      <span class="toggle-label">📋 Опорный конспект</span>
      <span class="toggle-arrow" :class="{ rotated: open }">▾</span>
    </button>
    <transition name="expand">
      <div v-if="open" class="cheatsheet-body">
        <div class="cs-section">
          <div class="cs-label">Что это</div>
          <div class="cs-text">{{ sections.what }}</div>
        </div>
        <div class="cs-section">
          <div class="cs-label">Факты</div>
          <ul class="cs-facts">
            <li v-for="(fact, i) in sections.facts" :key="i">{{ fact }}</li>
          </ul>
        </div>
        <div class="cs-section">
          <div class="cs-label">Не путать</div>
          <div class="cs-text cs-warn">{{ sections.dont_confuse }}</div>
        </div>
        <div class="cs-section">
          <div class="cs-label">Приём для запоминания</div>
          <div class="cs-text cs-trick">{{ sections.trick }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ sections: Object })
const open = ref(false)
</script>

<style scoped>
.cheatsheet-wrap {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px;
  overflow: hidden;
}

.cheatsheet-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  background: none;
  border: none;
}

.toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-blue);
}

.toggle-arrow {
  font-size: 16px;
  color: var(--text-muted);
  transition: transform 0.2s;
}

.toggle-arrow.rotated { transform: rotate(180deg); }

.cheatsheet-body {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cs-section {}

.cs-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.cs-text {
  font-size: 14px;
  line-height: 1.5;
}

.cs-warn {
  color: var(--wrong);
  background: rgba(232, 160, 112, 0.08);
  padding: 8px 10px;
  border-radius: var(--radius);
  border-left: 2px solid var(--wrong);
}

.cs-trick {
  color: var(--correct);
  background: rgba(140, 200, 130, 0.08);
  padding: 8px 10px;
  border-radius: var(--radius);
  border-left: 2px solid var(--correct);
}

.cs-facts {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cs-facts li {
  font-size: 14px;
  line-height: 1.4;
  padding-left: 14px;
  position: relative;
}

.cs-facts li::before {
  content: '·';
  position: absolute;
  left: 4px;
  color: var(--accent-gold);
}

.expand-enter-active, .expand-leave-active {
  transition: opacity 0.2s;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
}
</style>
