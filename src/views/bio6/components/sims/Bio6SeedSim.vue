<template>
  <div class="seed-sim">
    <div class="sim-title">🌱 Строение семени — нажми, чтобы вскрыть</div>
    <div class="sim-subtitle">Разбери семя по частям и узнай назначение каждой</div>

    <div class="seed-svg-wrap">
      <svg viewBox="0 0 300 260" class="seed-svg" role="img" aria-label="Строение семени фасоли">
        <!-- Seed coat -->
        <ellipse cx="150" cy="130" rx="120" ry="95"
          class="seed-part"
          :class="{ active: activePart === 'coat', explored: explored.has('coat') }"
          fill="#5a3a20"
          stroke="#8a5a30"
          stroke-width="3"
          @click="selectPart('coat')"
          role="button"
          aria-label="Семенная кожура"
        />
        <!-- Cotyledons left -->
        <path d="M 50,130 Q 80,60 150,90 Q 110,120 90,170 Z"
          class="seed-part"
          :class="{ active: activePart === 'cotyledon', explored: explored.has('cotyledon') }"
          fill="#c8a870"
          stroke="#e8c890"
          stroke-width="1.5"
          :opacity="revealed ? 1 : 0"
          @click="selectPart('cotyledon')"
          role="button"
          aria-label="Семядоля"
        />
        <!-- Cotyledons right -->
        <path d="M 250,130 Q 220,60 150,90 Q 190,120 210,170 Z"
          class="seed-part"
          :class="{ active: activePart === 'cotyledon', explored: explored.has('cotyledon') }"
          fill="#c8a870"
          stroke="#e8c890"
          stroke-width="1.5"
          :opacity="revealed ? 1 : 0"
          @click="selectPart('cotyledon')"
        />
        <!-- Embryo -->
        <g :opacity="revealed ? 1 : 0">
          <!-- Root -->
          <path d="M 150,155 L 150,210 Q 145,225 140,230"
            stroke="#a06840"
            stroke-width="3"
            fill="none"
            class="seed-part"
            :class="{ active: activePart === 'embryoRoot', explored: explored.has('embryoRoot') }"
            @click="selectPart('embryoRoot')"
            role="button"
            aria-label="Зародышевый корешок"
          />
          <!-- Stem -->
          <line x1="150" y1="100" x2="150" y2="155"
            stroke="#6a9a50"
            stroke-width="3"
            class="seed-part"
            :class="{ active: activePart === 'embryoStem', explored: explored.has('embryoStem') }"
            @click="selectPart('embryoStem')"
            role="button"
            aria-label="Зародышевый стебелёк"
          />
          <!-- Leaves -->
          <path d="M 150,100 Q 130,80 115,85 Q 125,100 150,100 Z"
            fill="#4a8a40"
            class="seed-part"
            :class="{ active: activePart === 'embryoLeaves', explored: explored.has('embryoLeaves') }"
            @click="selectPart('embryoLeaves')"
            role="button"
            aria-label="Зародышевые листочки"
          />
          <path d="M 150,100 Q 170,80 185,85 Q 175,100 150,100 Z"
            fill="#4a8a40"
            class="seed-part"
            :class="{ active: activePart === 'embryoLeaves', explored: explored.has('embryoLeaves') }"
            @click="selectPart('embryoLeaves')"
          />
        </g>

        <!-- Hilum -->
        <ellipse cx="150" cy="225" rx="15" ry="5"
          fill="#3a2010"
          class="seed-part"
          :class="{ active: activePart === 'hilum', explored: explored.has('hilum') }"
          @click="selectPart('hilum')"
          role="button"
          aria-label="Рубчик"
        />

        <!-- Labels -->
        <text x="60" y="115" fill="#8a5a30" font-size="9" font-family="sans-serif">Кожура</text>
        <text v-if="revealed" x="85" y="145" fill="#e8c890" font-size="9" font-family="sans-serif">Семядоля</text>
        <text x="140" y="248" fill="#7a4a20" font-size="9" font-family="sans-serif">Рубчик</text>
      </svg>

      <button class="reveal-btn" @click="reveal">
        {{ revealed ? '🔒 Скрыть внутреннее строение' : '🔍 Вскрыть семя' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="activePart" class="part-info">
        <div class="part-name">{{ parts[activePart].name }}</div>
        <div class="part-desc">{{ parts[activePart].desc }}</div>
        <div class="part-func">
          <span class="func-label">Роль при прорастании:</span>
          {{ parts[activePart].germRole }}
        </div>
      </div>
      <div v-else class="part-hint">Нажми на любую часть семени</div>
    </transition>

    <div class="parts-progress">
      Изучено частей: {{ explored.size }} / {{ Object.keys(parts).length }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['completed'])

const activePart = ref(null)
const explored = ref(new Set())
const revealed = ref(false)

const parts = {
  coat: {
    name: 'Семенная кожура',
    desc: 'Прочная оболочка из мёртвых клеток, окружающая семя снаружи.',
    germRole: 'Защищает зародыш от высыхания, механических повреждений и болезней до момента прорастания.'
  },
  cotyledon: {
    name: 'Семядоли (2 шт.)',
    desc: 'Крупные мясистые части — первые зачаточные листья зародыша.',
    germRole: 'Содержат запас питательных веществ (крахмал, белки, жиры). Питают проросток до появления первых настоящих листьев.'
  },
  embryoRoot: {
    name: 'Зародышевый корешок',
    desc: 'Нижняя часть зародыша длиной 1–3 мм.',
    germRole: 'Первым прорывает кожуру и уходит в почву. Из него вырастает главный корень растения.'
  },
  embryoStem: {
    name: 'Зародышевый стебелёк',
    desc: 'Соединяет корешок и почечку зародыша.',
    germRole: 'Удлиняется при прорастании и выносит почечку с листочками над поверхностью почвы.'
  },
  embryoLeaves: {
    name: 'Зародышевые листочки',
    desc: 'Крохотные первые листья, сложенные внутри семени.',
    germRole: 'После выхода на свет раскрываются и начинают фотосинтез — с этого момента проросток сам себя кормит.'
  },
  hilum: {
    name: 'Рубчик',
    desc: 'Тёмный след на кожуре — место прикрепления семени к стенке плода.',
    germRole: 'Рядом с рубчиком расположено микропиле — крохотное отверстие, через которое семя поглощает воду при прорастании.'
  }
}

function reveal() {
  revealed.value = !revealed.value
}

function selectPart(key) {
  activePart.value = activePart.value === key ? null : key
  explored.value.add(key)
  explored.value = new Set(explored.value)
  if (explored.value.size >= 4) emit('completed', { ok: true })
}
</script>

<style scoped>
.seed-sim {
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
  margin-bottom: 12px;
}

.seed-svg-wrap {
  background: #0d1117;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 12px;
}

.seed-svg {
  width: 100%;
  height: auto;
  display: block;
}

.seed-part {
  cursor: pointer;
  transition: filter 0.15s, opacity 0.3s;
}

.seed-part.active { filter: drop-shadow(0 0 4px rgba(232,200,145,0.7)); }
.seed-part.explored { opacity: 0.85; }

.reveal-btn {
  width: 100%;
  padding: 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  font-size: 13px;
  cursor: pointer;
  color: var(--text);
  transition: border-color 0.12s;
}

.reveal-btn:hover { border-color: var(--accent-gold); color: var(--accent-gold); }

.part-info, .part-hint {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  min-height: 80px;
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.part-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-style: italic;
}

.part-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 4px;
}

.part-desc { margin-bottom: 6px; }

.func-label {
  font-weight: 600;
  color: var(--accent-blue);
}

.parts-progress {
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
