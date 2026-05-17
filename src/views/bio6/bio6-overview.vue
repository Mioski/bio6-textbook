<template>
  <div class="overview-page">
    <div class="overview-header">
      <button class="back-btn" @click="nav.goToIndex()">← Все разделы</button>
      <div v-if="block" class="block-hero">
        <div class="block-emoji-lg">{{ block.emoji }}</div>
        <h1 class="block-title">{{ block.title }}</h1>
        <p class="block-subtitle">{{ block.subtitle }}</p>
        <div class="block-stats">
          <span>{{ nodes.length }} тем</span>
          <span>·</span>
          <span>{{ completedCount }} пройдено</span>
        </div>
      </div>
    </div>

    <div class="nodes-list">
      <button
        v-for="node in nodes"
        :key="node.id"
        class="node-row"
        :class="{ 'is-deep': node.difficulty === 'deep', 'is-done': getProgress(node.id) >= 80 }"
        @click="nav.goToNode(node.id)"
        :aria-label="'Открыть тему: ' + node.title"
      >
        <div class="node-left">
          <div class="node-order">{{ node.order }}</div>
        </div>
        <div class="node-middle">
          <div class="node-title">{{ node.title }}</div>
          <div class="node-meta">
            <span v-if="node.difficulty === 'deep'" class="badge-deep">углублённое</span>
          </div>
          <div v-if="getProgress(node.id) > 0" class="node-progress-bar">
            <div class="node-progress-fill" :style="{ width: getProgress(node.id) + '%' }"></div>
          </div>
        </div>
        <div class="node-arrow">›</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import ProgressService from '../../services/bio6/ProgressService.js'

const props = defineProps({ blockId: String })

const cs = inject('ContentService')
const nav = inject('NavigationService')

const block = computed(() => cs.getBlock(props.blockId))
const nodes = computed(() => cs.getBlockNodes(props.blockId))

function getProgress(nodeId) {
  return ProgressService.getProgress(nodeId)
}

const completedCount = computed(() => {
  return nodes.value.filter(n => getProgress(n.id) >= 80).length
})
</script>

<style scoped>
.overview-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.overview-header { padding: 16px 0 0; }

.back-btn {
  font-size: 14px;
  color: var(--text-muted);
  padding: 6px 0;
  background: none;
  border: none;
  cursor: pointer;
}
.back-btn:hover { color: var(--accent-gold); }

.block-hero {
  text-align: center;
  padding: 20px 0 24px;
}

.block-emoji-lg { font-size: 44px; margin-bottom: 8px; }

.block-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 4px;
}

.block-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.block-stats {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  gap: 6px;
  justify-content: center;
}

.nodes-list { display: flex; flex-direction: column; gap: 2px; }

.node-row {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.node-row:hover, .node-row:focus {
  border-color: var(--accent-blue);
  background: var(--bg-elevated);
  outline: none;
}

.node-row.is-deep {
  border-color: #3d3520;
}

.node-row.is-deep:hover {
  border-color: var(--accent-gold);
}

.node-row.is-done .node-order {
  background: var(--correct);
  color: #0d1117;
}

.node-left { flex-shrink: 0; }

.node-order {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.node-middle { flex: 1; min-width: 0; }

.node-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 4px;
}

.node-meta {
  display: flex;
  gap: 6px;
  align-items: center;
}

.badge-deep {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #3d3520;
  color: var(--accent-gold);
  padding: 2px 6px;
  border-radius: 4px;
}

.node-progress-bar {
  margin-top: 6px;
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.node-progress-fill {
  height: 100%;
  background: var(--accent-gold);
  transition: width 0.3s;
}

.node-arrow {
  color: var(--text-muted);
  font-size: 18px;
  flex-shrink: 0;
}
</style>
