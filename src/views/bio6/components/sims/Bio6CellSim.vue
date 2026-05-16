<template>
  <div class="cell-sim">
    <div class="sim-title">🔬 Строение растительной клетки</div>
    <div class="sim-subtitle">Нажми на слой, чтобы посмотреть его строение изнутри</div>

    <div class="cell-canvas-wrap">
      <svg viewBox="0 0 320 280" class="cell-svg" role="img" aria-label="Схема строения растительной клетки">
        <!-- Cell wall -->
        <rect x="20" y="20" width="280" height="240" rx="24" ry="24"
          class="cell-layer"
          :class="{ active: activeLayer === 'wall', highlight: hoveredLayer === 'wall' }"
          fill="#3a4a2a"
          stroke="#6a8a4a"
          stroke-width="6"
          @click="selectLayer('wall')"
          @mouseenter="hoveredLayer = 'wall'"
          @mouseleave="hoveredLayer = null"
          role="button"
          :aria-label="layers.wall.name"
        />
        <!-- Cell membrane -->
        <rect x="30" y="30" width="260" height="220" rx="18" ry="18"
          class="cell-layer"
          :class="{ active: activeLayer === 'membrane', highlight: hoveredLayer === 'membrane' }"
          fill="#2a3820"
          stroke="#8ab870"
          stroke-width="2"
          @click="selectLayer('membrane')"
          @mouseenter="hoveredLayer = 'membrane'"
          @mouseleave="hoveredLayer = null"
          role="button"
          :aria-label="layers.membrane.name"
        />
        <!-- Cytoplasm -->
        <rect x="34" y="34" width="252" height="212" rx="16" ry="16"
          class="cell-layer"
          :class="{ active: activeLayer === 'cytoplasm', highlight: hoveredLayer === 'cytoplasm' }"
          fill="#1a2818"
          stroke="none"
          @click="selectLayer('cytoplasm')"
          @mouseenter="hoveredLayer = 'cytoplasm'"
          @mouseleave="hoveredLayer = null"
          role="button"
          :aria-label="layers.cytoplasm.name"
        />
        <!-- Vacuole -->
        <ellipse cx="160" cy="145" rx="70" ry="55"
          class="cell-layer"
          :class="{ active: activeLayer === 'vacuole', highlight: hoveredLayer === 'vacuole' }"
          fill="#162030"
          stroke="#3a6090"
          stroke-width="1.5"
          @click="selectLayer('vacuole')"
          @mouseenter="hoveredLayer = 'vacuole'"
          @mouseleave="hoveredLayer = null"
          role="button"
          :aria-label="layers.vacuole.name"
        />
        <!-- Chloroplasts -->
        <g class="cell-layer organelle"
          :class="{ active: activeLayer === 'chloroplast', highlight: hoveredLayer === 'chloroplast' }"
          @click="selectLayer('chloroplast')"
          @mouseenter="hoveredLayer = 'chloroplast'"
          @mouseleave="hoveredLayer = null"
          role="button"
          :aria-label="layers.chloroplast.name"
        >
          <ellipse cx="70" cy="90" rx="16" ry="9" fill="#2a6a2a" stroke="#4a9a4a" stroke-width="1"/>
          <ellipse cx="110" cy="70" rx="16" ry="9" fill="#2a6a2a" stroke="#4a9a4a" stroke-width="1"/>
          <ellipse cx="240" cy="80" rx="16" ry="9" fill="#2a6a2a" stroke="#4a9a4a" stroke-width="1"/>
          <ellipse cx="260" cy="110" rx="14" ry="8" fill="#2a6a2a" stroke="#4a9a4a" stroke-width="1"/>
          <ellipse cx="80" cy="190" rx="16" ry="9" fill="#2a6a2a" stroke="#4a9a4a" stroke-width="1"/>
          <ellipse cx="245" cy="180" rx="14" ry="8" fill="#2a6a2a" stroke="#4a9a4a" stroke-width="1"/>
        </g>
        <!-- Mitochondria -->
        <g class="cell-layer organelle"
          :class="{ active: activeLayer === 'mitochondria', highlight: hoveredLayer === 'mitochondria' }"
          @click="selectLayer('mitochondria')"
          @mouseenter="hoveredLayer = 'mitochondria'"
          @mouseleave="hoveredLayer = null"
          role="button"
          :aria-label="layers.mitochondria.name"
        >
          <ellipse cx="55" cy="145" rx="10" ry="6" fill="#6a3a10" stroke="#c06020" stroke-width="1"/>
          <ellipse cx="200" cy="55" rx="10" ry="6" fill="#6a3a10" stroke="#c06020" stroke-width="1"/>
          <ellipse cx="270" cy="155" rx="10" ry="6" fill="#6a3a10" stroke="#c06020" stroke-width="1"/>
        </g>
        <!-- Nucleus -->
        <g class="cell-layer"
          :class="{ active: activeLayer === 'nucleus', highlight: hoveredLayer === 'nucleus' }"
          @click="selectLayer('nucleus')"
          @mouseenter="hoveredLayer = 'nucleus'"
          @mouseleave="hoveredLayer = null"
          role="button"
          :aria-label="layers.nucleus.name"
        >
          <circle cx="160" cy="120" r="28" fill="#2a1848" stroke="#8858c8" stroke-width="2"/>
          <circle cx="160" cy="120" r="22" fill="#1e1238" stroke="none"/>
          <circle cx="155" cy="116" r="7" fill="#3a2060" stroke="#6840a0" stroke-width="1" opacity="0.8"/>
          <text x="160" y="124" text-anchor="middle" fill="#9878d8" font-size="10" font-family="sans-serif">ядро</text>
        </g>

        <!-- Layer labels -->
        <text x="23" y="17" fill="#8ab870" font-size="9" font-family="sans-serif">Оболочка</text>
        <text x="155" y="148" text-anchor="middle" fill="#6090c0" font-size="9" font-family="sans-serif">Вакуоль</text>
      </svg>
    </div>

    <!-- Info panel -->
    <transition name="fade">
      <div v-if="activeLayer" class="layer-info">
        <div class="layer-name">{{ layers[activeLayer].name }}</div>
        <div class="layer-desc">{{ layers[activeLayer].desc }}</div>
        <div class="layer-func">
          <span class="func-label">Функция:</span> {{ layers[activeLayer].func }}
        </div>
      </div>
      <div v-else class="layer-hint">
        Нажми на любой элемент клетки, чтобы узнать о нём подробнее
      </div>
    </transition>

    <div class="layer-legend">
      <button
        v-for="(info, key) in layers"
        :key="key"
        class="legend-item"
        :class="{ active: activeLayer === key }"
        @click="selectLayer(key)"
      >
        <span class="legend-dot" :style="{ background: info.color }"></span>
        <span>{{ info.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['completed'])

const activeLayer = ref(null)
const hoveredLayer = ref(null)
const seenLayers = ref(new Set())

const layers = {
  wall: {
    name: 'Клеточная оболочка',
    desc: 'Прочная рамка из целлюлозы толщиной 0,1–10 мкм, расположенная снаружи.',
    func: 'Защищает клетку, удерживает форму, пронизана порами для обмена веществ между соседними клетками.',
    color: '#6a8a4a'
  },
  membrane: {
    name: 'Клеточная мембрана',
    desc: 'Тонкий (7–10 нм) живой барьер из липидов и белков под оболочкой.',
    func: 'Избирательно пропускает вещества внутрь и наружу клетки — без неё клетка «протечёт».',
    color: '#8ab870'
  },
  cytoplasm: {
    name: 'Цитоплазма',
    desc: 'Полужидкое вещество, заполняющее клетку. На 80–85% состоит из воды.',
    func: 'Среда, в которой плавают органоиды. В ней происходят сотни химических реакций одновременно.',
    color: '#4a6838'
  },
  vacuole: {
    name: 'Вакуоль',
    desc: 'Большая полость, наполненная клеточным соком (вода + сахара + кислоты + пигменты).',
    func: 'Создаёт тургорное давление — именно из-за вакуоли листья и стебли держат форму. Растворяет запасные вещества.',
    color: '#3a6090'
  },
  chloroplast: {
    name: 'Хлоропласты',
    desc: 'Зелёные двумембранные органоиды длиной 5–10 мкм. Содержат хлорофилл.',
    func: 'Улавливают свет и проводят фотосинтез — превращают CO₂ и H₂O в глюкозу и O₂.',
    color: '#4a9a4a'
  },
  mitochondria: {
    name: 'Митохондрии',
    desc: 'Органоиды длиной 1–10 мкм, есть у всех живых клеток. Двойная мембрана.',
    func: 'Дышат: расщепляют органические вещества и высвобождают энергию (АТФ). Работают 24 часа в сутки.',
    color: '#c06020'
  },
  nucleus: {
    name: 'Ядро',
    desc: 'Округлый органоид диаметром 5–10 мкм, содержит хромосомы с ДНК.',
    func: 'Командный центр: хранит наследственную информацию и управляет синтезом белков.',
    color: '#8858c8'
  }
}

function selectLayer(key) {
  activeLayer.value = activeLayer.value === key ? null : key
  seenLayers.value.add(key)
  if (seenLayers.value.size >= 5) {
    emit('completed', { ok: true })
  }
}
</script>

<style scoped>
.cell-sim {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 20px;
}

.sim-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.sim-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.cell-canvas-wrap {
  background: #0d1117;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 12px;
}

.cell-svg {
  width: 100%;
  height: auto;
  display: block;
}

.cell-layer {
  cursor: pointer;
  transition: opacity 0.15s;
}

.cell-layer.highlight { opacity: 0.8; }
.cell-layer.active { filter: drop-shadow(0 0 4px rgba(232,200,145,0.6)); }

.layer-info, .layer-hint {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  min-height: 80px;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.layer-hint {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-style: italic;
}

.layer-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 4px;
}

.layer-desc { margin-bottom: 6px; }

.func-label {
  font-weight: 600;
  color: var(--accent-blue);
}

.layer-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
  transition: border-color 0.12s;
}

.legend-item.active {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
