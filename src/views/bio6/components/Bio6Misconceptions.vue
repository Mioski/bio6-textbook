<template>
  <div class="misc-section">
    <h3 class="misc-title">⚠️ Частые заблуждения</h3>
    <div class="misc-list">
      <div v-for="item in items" :key="item.id" class="misc-card">
        <button class="misc-toggle" @click="toggle(item.id)" :aria-expanded="expanded.has(item.id)">
          <span class="misc-wrong-label">Часто думают:</span>
          <span class="misc-wrong-text">{{ item.wrong }}</span>
          <span class="misc-chevron" :class="{ open: expanded.has(item.id) }">▾</span>
        </button>
        <transition name="slide-down">
          <div v-if="expanded.has(item.id)" class="misc-details">
            <div class="misc-row">
              <span class="misc-row-label">Почему неверно:</span>
              <span>{{ item.why_wrong }}</span>
            </div>
            <div class="misc-row correct">
              <span class="misc-row-label">Как правильно:</span>
              <span>{{ item.correct }}</span>
            </div>
            <div v-if="item.mnemonic" class="misc-mnemonic">
              💡 {{ item.mnemonic }}
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ items: Array })
const expanded = ref(new Set())

function toggle(id) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
  // trigger reactivity
  expanded.value = new Set(expanded.value)
}
</script>

<style scoped>
.misc-section { margin-bottom: 24px; }

.misc-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}

.misc-list { display: flex; flex-direction: column; gap: 8px; }

.misc-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.misc-toggle {
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: baseline;
  cursor: pointer;
  background: none;
  border: none;
}

.misc-wrong-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--wrong);
  margin-right: 4px;
  flex-shrink: 0;
}

.misc-wrong-text {
  font-size: 14px;
  flex: 1;
}

.misc-chevron {
  font-size: 14px;
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}
.misc-chevron.open { transform: rotate(180deg); }

.misc-details {
  padding: 4px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--border);
}

.misc-row {
  font-size: 13px;
  line-height: 1.5;
}

.misc-row.correct { color: var(--correct); }

.misc-row-label {
  font-weight: 600;
  display: block;
  margin-bottom: 2px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.7;
}

.misc-mnemonic {
  font-size: 13px;
  background: rgba(168, 197, 216, 0.1);
  border: 1px solid rgba(168, 197, 216, 0.2);
  border-radius: var(--radius);
  padding: 8px 10px;
  color: var(--accent-blue);
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity 0.2s;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
}
</style>
