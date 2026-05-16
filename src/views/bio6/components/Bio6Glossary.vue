<template>
  <div class="glossary-section">
    <h3 class="glossary-title">📖 Глоссарий</h3>
    <div class="glossary-list">
      <div v-for="term in terms" :key="term.id" class="term-card">
        <button class="term-toggle" @click="toggle(term.id)" :aria-expanded="expanded.has(term.id)">
          <span class="term-name">{{ term.term }}</span>
          <span v-if="term.latin" class="term-latin">{{ term.latin }}</span>
          <span class="term-chevron" :class="{ open: expanded.has(term.id) }">▾</span>
        </button>
        <transition name="slide-down">
          <div v-if="expanded.has(term.id)" class="term-body">
            <p class="term-def">{{ term.definition }}</p>
            <p v-if="term.example" class="term-example">Пример: {{ term.example }}</p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ terms: Array })
const expanded = ref(new Set())

function toggle(id) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
  expanded.value = new Set(expanded.value)
}
</script>

<style scoped>
.glossary-section { margin-bottom: 24px; }

.glossary-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 10px;
}

.glossary-list { display: flex; flex-direction: column; gap: 4px; }

.term-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.term-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
}

.term-name {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
}

.term-latin {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

.term-chevron {
  font-size: 13px;
  color: var(--text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}
.term-chevron.open { transform: rotate(180deg); }

.term-body {
  padding: 4px 14px 12px;
  border-top: 1px solid var(--border);
}

.term-def {
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.term-example {
  font-size: 12px;
  color: var(--accent-blue);
  font-style: italic;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity 0.2s;
}
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; }
</style>
