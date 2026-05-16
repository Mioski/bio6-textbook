<template>
  <div class="lifecycle-sim">
    <div class="sim-title">🔄 Цикл развития цветкового растения</div>
    <div class="sim-subtitle">Нажимай на фазы по порядку, чтобы пройти полный цикл</div>

    <div class="cycle-canvas">
      <svg viewBox="0 0 300 300" class="cycle-svg" role="img" aria-label="Цикл развития цветкового растения">
        <!-- Circle arrows background -->
        <circle cx="150" cy="150" r="110" fill="none" stroke="#1e2830" stroke-width="2" stroke-dasharray="4 4"/>

        <!-- Connecting arrows -->
        <path v-for="(arrow, i) in arrows" :key="i"
          :d="arrow.d"
          fill="none"
          :stroke="currentStep > i ? '#e8c891' : '#2a3840'"
          stroke-width="2"
          marker-end="url(#arrowhead)"
          style="transition: stroke 0.4s"
        />

        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#e8c891"/>
          </marker>
        </defs>

        <!-- Phase nodes -->
        <g v-for="(phase, i) in phases" :key="phase.id">
          <circle
            :cx="phase.x"
            :cy="phase.y"
            r="28"
            :fill="currentStep > i ? '#1a3020' : stepIndex === i ? '#2a2010' : '#161b22'"
            :stroke="currentStep > i ? '#4a9a4a' : stepIndex === i ? '#e8c891' : '#30363d'"
            stroke-width="2"
            class="phase-node"
            @click="gotoStep(i)"
            role="button"
            :aria-label="phase.name"
          />
          <text :x="phase.x" :y="phase.y + 2" text-anchor="middle" dominant-baseline="middle"
            font-size="18" font-family="sans-serif">{{ phase.emoji }}</text>
          <text :x="phase.x" :y="phase.y + 36" text-anchor="middle"
            fill="#8b949e" font-size="8" font-family="sans-serif">{{ phase.shortName }}</text>
          <!-- checkmark for completed -->
          <text v-if="currentStep > i"
            :x="phase.x + 20" :y="phase.y - 20"
            fill="#4a9a4a" font-size="14" font-family="sans-serif">✓</text>
        </g>
      </svg>
    </div>

    <div class="phase-panel">
      <div class="phase-step">Шаг {{ stepIndex + 1 }} / {{ phases.length }}</div>
      <div class="phase-name">{{ phases[stepIndex].name }}</div>
      <div class="phase-duration">
        <span class="dur-label">Продолжительность:</span>
        {{ phases[stepIndex].duration }}
      </div>
      <div class="phase-desc">{{ phases[stepIndex].desc }}</div>
    </div>

    <div class="cycle-controls">
      <button class="ctrl-btn" :disabled="stepIndex === 0" @click="prevStep">← Назад</button>
      <div class="step-dots">
        <span v-for="(_, i) in phases" :key="i" class="step-dot" :class="{ active: i === stepIndex, done: currentStep > i }"></span>
      </div>
      <button class="ctrl-btn" @click="nextStep">
        {{ stepIndex < phases.length - 1 ? 'Далее →' : '🔄 Снова' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['completed'])

const stepIndex = ref(0)
const currentStep = ref(0)
const completed = ref(false)

const phases = [
  {
    id: 'seed',
    name: 'Семя в покое',
    shortName: 'Семя',
    emoji: '🌰',
    x: 150, y: 40,
    duration: 'Недели — годы (зависит от вида)',
    desc: 'Семя содержит зародыш и запас питательных веществ. В покоящемся состоянии обмен веществ снижен до минимума. Семена пшеницы сохраняют всхожесть 5–8 лет, лотоса — более 1000 лет.'
  },
  {
    id: 'germination',
    name: 'Прорастание',
    shortName: 'Прорастание',
    emoji: '🌱',
    x: 250, y: 100,
    duration: '3–14 суток',
    desc: 'При достаточной влажности, тепле (5–25°C) и кислороде зародышевый корешок прорывает кожуру. Семядоли или остаются в почве (фасоль оставляет), или поднимаются над ней (горох оставляет в земле).'
  },
  {
    id: 'seedling',
    name: 'Проросток',
    shortName: 'Проросток',
    emoji: '🌿',
    x: 270, y: 200,
    duration: '2–6 недель',
    desc: 'Первые настоящие листья раскрываются и начинают фотосинтез. Теперь растение само обеспечивает себя питанием. Корневая система активно развивается.'
  },
  {
    id: 'growth',
    name: 'Рост и развитие',
    shortName: 'Рост',
    emoji: '🌳',
    x: 150, y: 260,
    duration: 'Недели — десятилетия',
    desc: 'Растение наращивает вегетативные органы: корень, стебель, листья. Фотосинтез обеспечивает энергию. У деревьев стебель утолщается за счёт камбия — каждое лето образуется одно годичное кольцо.'
  },
  {
    id: 'flowering',
    name: 'Цветение',
    shortName: 'Цветение',
    emoji: '🌸',
    x: 30, y: 200,
    duration: 'Дни — месяцы',
    desc: 'Почки превращаются в цветки. Цветок — орган полового размножения. Тычинки образуют пыльцу, пестик содержит семязачатки. Время цветения — генетически заложено: одни цветут весной, другие летом.'
  },
  {
    id: 'pollination',
    name: 'Опыление и оплодотворение',
    shortName: 'Опыление',
    emoji: '🐝',
    x: 50, y: 100,
    duration: 'Часы — дни',
    desc: 'Пыльца переносится на рыльце пестика (ветром, насекомыми, птицами). Происходит двойное оплодотворение: один спермий оплодотворяет яйцеклетку → семя, второй → эндосперм (запас питания).'
  }
]

// Precomputed arrows connecting phases in order
const arrows = [
  { d: 'M 175,55 Q 230,60 245,88' },
  { d: 'M 264,128 Q 270,165 262,178' },
  { d: 'M 252,215 Q 215,248 175,258' },
  { d: 'M 125,260 Q 65,248 48,215' },
  { d: 'M 38,175 Q 32,138 45,112' },
  { d: 'M 72,90 Q 110,52 138,44' }
]

function nextStep() {
  if (stepIndex.value < phases.length - 1) {
    stepIndex.value++
    if (stepIndex.value > currentStep.value) currentStep.value = stepIndex.value
    if (currentStep.value >= phases.length - 1 && !completed.value) {
      completed.value = true
      emit('completed', { ok: true })
    }
  } else {
    stepIndex.value = 0
    currentStep.value = phases.length
  }
}

function prevStep() {
  if (stepIndex.value > 0) stepIndex.value--
}

function gotoStep(i) {
  stepIndex.value = i
  if (i > currentStep.value) currentStep.value = i
}
</script>

<style scoped>
.lifecycle-sim {
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

.cycle-canvas {
  background: #080d14;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: 12px;
}

.cycle-svg {
  width: 100%;
  height: auto;
  display: block;
}

.phase-node { cursor: pointer; transition: stroke 0.2s, fill 0.2s; }

.phase-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  margin-bottom: 12px;
}

.phase-step {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.phase-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 4px;
}

.phase-duration {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.dur-label {
  font-weight: 600;
  color: var(--accent-blue);
}

.phase-desc {
  font-size: 14px;
  line-height: 1.6;
}

.cycle-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ctrl-btn {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 14px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text);
  flex-shrink: 0;
}

.ctrl-btn:hover:not(:disabled) {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.step-dots {
  display: flex;
  gap: 4px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  transition: background 0.2s;
}

.step-dot.active { background: var(--accent-gold); border-color: var(--accent-gold); }
.step-dot.done { background: var(--correct); border-color: var(--correct); }
</style>
