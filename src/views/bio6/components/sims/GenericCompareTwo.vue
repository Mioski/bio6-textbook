<template>
  <div class="compare-two">
    <p class="instruction">{{ data.instruction }}</p>
    <div class="compare-toggle">
      <button
        v-for="(side, i) in data.sides"
        :key="i"
        class="side-btn"
        :class="{ active: activeIdx === i }"
        @click="setActive(i)"
      >{{ side.label }}</button>
    </div>
    <transition name="fade" mode="out-in">
      <div :key="activeIdx" class="compare-panel">
        <div class="cp-image-wrap">
          <svg :viewBox="data.sides[activeIdx].svgViewBox || '0 0 200 140'" class="cp-svg" role="img" :aria-label="data.sides[activeIdx].label">
            <text v-for="(txt, i) in data.sides[activeIdx].svgTexts" :key="i"
              :x="txt.x" :y="txt.y"
              :fill="txt.color || '#e6edf3'"
              :font-size="txt.size || 12"
              font-family="sans-serif"
              :text-anchor="txt.anchor || 'middle'"
            >{{ txt.text }}</text>
            <rect v-for="(rect, i) in (data.sides[activeIdx].svgRects || [])" :key="'r'+i"
              :x="rect.x" :y="rect.y" :width="rect.w" :height="rect.h"
              :fill="rect.fill" :rx="rect.rx || 4"
              :stroke="rect.stroke || 'none'"
            />
          </svg>
        </div>
        <div class="cp-title">{{ data.sides[activeIdx].label }}</div>
        <div class="cp-facts">
          <div v-for="(fact, i) in data.sides[activeIdx].facts" :key="i" class="cp-fact">
            <span class="cp-bullet">·</span>
            <span>{{ fact }}</span>
          </div>
        </div>
        <div v-if="data.sides[activeIdx].example" class="cp-example">
          Пример: <em>{{ data.sides[activeIdx].example }}</em>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ data: Object, nodeId: String })
const emit = defineEmits(['completed'])

const activeIdx = ref(0)
const seen = ref(new Set([0]))

function setActive(i) {
  activeIdx.value = i
  seen.value.add(i)
  seen.value = new Set(seen.value)
  if (seen.value.size >= props.data.sides.length) {
    emit('completed', { ok: true })
  }
}
</script>

<style scoped>
.compare-two {}

.instruction {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.compare-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.side-btn {
  flex: 1;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.12s;
}

.side-btn.active {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: rgba(232,200,145,0.08);
}

.compare-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
}

.cp-svg {
  width: 100%;
  height: 120px;
  display: block;
  background: #080d14;
  border-radius: 6px;
  margin-bottom: 10px;
}

.cp-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 8px;
}

.cp-facts { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }

.cp-fact {
  display: flex;
  gap: 6px;
  font-size: 13px;
  line-height: 1.4;
}

.cp-bullet { color: var(--accent-gold); flex-shrink: 0; }

.cp-example {
  font-size: 12px;
  color: var(--accent-blue);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
