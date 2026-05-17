<template>
  <div class="index-page">
    <header class="index-header">
      <div class="header-badge">Моя Школа · Образовариум</div>
      <h1 class="header-title">Биология<span class="grade">6 класс</span></h1>
      <p class="header-sub">Ботаника — наука о растениях. 62 темы, интерактивы, тренажёры.</p>
    </header>

    <div class="stats-row">
      <div class="stat-chip">
        <span class="stat-num">62</span>
        <span class="stat-label">темы</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num">4</span>
        <span class="stat-label">углублённых</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num">{{ completedCount }}</span>
        <span class="stat-label">пройдено</span>
      </div>
    </div>

    <section class="blocks-section">
      <h2 class="section-label">Разделы курса</h2>
      <div class="blocks-grid">
        <button
          v-for="block in blocks"
          :key="block.id"
          class="block-card"
          @click="nav.goToBlock(block.id)"
          :aria-label="'Перейти в раздел ' + block.title"
        >
          <div class="block-emoji">{{ block.emoji }}</div>
          <div class="block-content">
            <div class="block-title">{{ block.title }}</div>
            <div class="block-sub">{{ block.subtitle }}</div>
            <div class="block-count">{{ getBlockCount(block.id) }} тем</div>
          </div>
          <div class="block-progress-bar">
            <div class="block-progress-fill" :style="{ width: getBlockProgress(block.id) + '%' }"></div>
          </div>
        </button>
      </div>
    </section>

    <section class="about-section">
      <h2 class="section-label">Как устроен учебник</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <div class="feature-title">Hook вместо определения</div>
          <div class="feature-desc">Каждая тема начинается с парадокса или факта, который цепляет за 5 секунд</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎮</div>
          <div class="feature-title">Интерактивы</div>
          <div class="feature-desc">Симуляции, слайдеры, анимации — ты управляешь моделью, а не смотришь видео</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔁</div>
          <div class="feature-title">Тренажёры</div>
          <div class="feature-desc">Сортировка, сопоставление, кейсы — закрепление через действие</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💡</div>
          <div class="feature-title">Понимание «почему»</div>
          <div class="feature-desc">Не «выучи термин», а «пойми причинно-следственную связь»</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import ProgressService from '../../services/bio6/ProgressService.js'

const cs = inject('ContentService')
const nav = inject('NavigationService')

const blocks = cs.getBlocks()
const allNodes = cs.getCourseFlow()

function getBlockCount(blockId) {
  return allNodes.filter(n => n.block === blockId).length
}

function getBlockProgress(blockId) {
  const nodes = allNodes.filter(n => n.block === blockId)
  if (!nodes.length) return 0
  const done = nodes.filter(n => ProgressService.getProgress(n.id) > 0).length
  return Math.round((done / nodes.length) * 100)
}

const completedCount = computed(() => {
  return allNodes.filter(n => ProgressService.getProgress(n.id) >= 80).length
})
</script>

<style scoped>
.index-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.index-header {
  padding: 32px 0 24px;
  text-align: center;
}

.header-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.header-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--accent-gold);
  line-height: 1.1;
  margin-bottom: 4px;
}

.grade {
  display: block;
  font-size: 20px;
  font-weight: 500;
  color: var(--text-muted);
  margin-top: 2px;
}

.header-sub {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 8px;
}

.stats-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 28px;
}

.stat-chip {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 16px;
  text-align: center;
  min-width: 70px;
}

.stat-num {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: var(--accent-gold);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.blocks-section { margin-bottom: 32px; }

.blocks-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.block-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.block-card:hover, .block-card:focus {
  border-color: var(--accent-gold);
  background: var(--bg-elevated);
  outline: none;
}

.block-emoji {
  font-size: 28px;
  flex-shrink: 0;
  width: 40px;
  text-align: center;
}

.block-content { flex: 1; min-width: 0; }

.block-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
}

.block-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.block-count {
  font-size: 11px;
  color: var(--accent-blue);
  font-weight: 600;
}

.block-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--border);
}

.block-progress-fill {
  height: 100%;
  background: var(--accent-gold);
  transition: width 0.4s ease;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px;
}

.feature-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.feature-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}
</style>
