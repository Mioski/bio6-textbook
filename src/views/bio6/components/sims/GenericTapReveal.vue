<template>
  <div class="tap-reveal-sim">
    <p class="instruction">{{ data.instruction }}</p>
    <div class="items-grid">
      <div
        v-for="item in data.items"
        :key="item.id"
        class="reveal-item"
        :class="{ revealed: revealedIds.has(item.id) }"
        @click="reveal(item.id)"
        role="button"
        :aria-label="item.label"
      >
        <div class="item-front">{{ item.label }}</div>
        <div class="item-back">
          <div class="item-back-label">{{ item.label }}</div>
          <div class="item-back-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <div class="reveal-progress">
      Открыто: {{ revealedIds.size }} / {{ data.items.length }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ data: Object, nodeId: String })
const emit = defineEmits(['completed'])

const revealedIds = ref(new Set())

function reveal(id) {
  revealedIds.value.add(id)
  revealedIds.value = new Set(revealedIds.value)
  if (revealedIds.value.size >= props.data.items.length) {
    emit('completed', { ok: true })
  }
}
</script>

<style scoped>
.tap-reveal-sim {}

.instruction {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
  margin-bottom: 10px;
}

.reveal-item {
  border-radius: var(--radius);
  min-height: 80px;
  cursor: pointer;
  perspective: 400px;
  position: relative;
}

.item-front, .item-back {
  border-radius: var(--radius);
  padding: 10px;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: opacity 0.3s;
  border: 1px solid var(--border);
}

.item-front {
  background: var(--bg-elevated);
  font-size: 13px;
  font-weight: 500;
}

.item-back {
  background: rgba(232,200,145,0.08);
  border-color: rgba(232,200,145,0.3);
  flex-direction: column;
  gap: 4px;
  opacity: 0;
}

.item-back-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-gold);
}

.item-back-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.3;
}

.reveal-item.revealed .item-front { opacity: 0; }
.reveal-item.revealed .item-back { opacity: 1; }

.reveal-progress {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}
</style>
