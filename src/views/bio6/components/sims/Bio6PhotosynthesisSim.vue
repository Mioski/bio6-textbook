<template>
  <div class="photo-sim">
    <div class="sim-title">☀️ Фотосинтез — управляй условиями</div>
    <div class="sim-subtitle">Двигай ползунки и смотри, как меняется скорость фотосинтеза</div>

    <div class="sliders-panel">
      <div class="slider-row">
        <label class="slider-label">
          <span class="slider-icon">💡</span>
          <span>Освещённость</span>
          <span class="slider-val">{{ light }}%</span>
        </label>
        <input type="range" min="0" max="100" v-model.number="light" class="bio-slider" aria-label="Освещённость" />
        <div class="slider-desc">{{ lightDesc }}</div>
      </div>

      <div class="slider-row">
        <label class="slider-label">
          <span class="slider-icon">💧</span>
          <span>Содержание CO₂</span>
          <span class="slider-val">{{ co2 }}%</span>
        </label>
        <input type="range" min="0" max="100" v-model.number="co2" class="bio-slider" aria-label="CO2" />
        <div class="slider-desc">{{ co2Desc }}</div>
      </div>

      <div class="slider-row">
        <label class="slider-label">
          <span class="slider-icon">🌡️</span>
          <span>Температура</span>
          <span class="slider-val">{{ temp }}°C</span>
        </label>
        <input type="range" min="0" max="40" v-model.number="temp" class="bio-slider" aria-label="Температура" />
        <div class="slider-desc">{{ tempDesc }}</div>
      </div>
    </div>

    <div class="reaction-display">
      <div class="reaction-formula">
        <span class="r-co2" :style="{ opacity: co2 / 100 }">6CO₂</span>
        <span class="r-plus">+</span>
        <span class="r-h2o" :style="{ opacity: Math.min(1, light / 30 + 0.1) }">6H₂O</span>
        <span class="r-arrow">→</span>
        <span class="r-light">
          <span class="r-sun">hν</span>
        </span>
        <span class="r-glucose" :style="{ opacity: rate / 100 }">C₆H₁₂O₆</span>
        <span class="r-plus">+</span>
        <span class="r-o2" :style="{ opacity: rate / 100 }">6O₂↑</span>
      </div>

      <div class="rate-display">
        <div class="rate-label">Скорость фотосинтеза</div>
        <div class="rate-bar-wrap">
          <div class="rate-bar" :style="{ width: rate + '%' }">
            <span class="rate-pct">{{ Math.round(rate) }}%</span>
          </div>
        </div>
        <div class="rate-status">{{ rateStatus }}</div>
      </div>

      <div class="o2-bubbles" aria-hidden="true">
        <div v-for="n in bubbleCount" :key="n" class="bubble" :style="bubbleStyle(n)">○</div>
      </div>
    </div>

    <div class="sim-insight">
      <div class="insight-label">💡 Ключевой вывод:</div>
      <div class="insight-text">{{ insight }}</div>
    </div>

    <div class="limiting-factor" v-if="limitingFactor">
      <span class="limit-label">Ограничивающий фактор:</span>
      <span class="limit-val">{{ limitingFactor }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['completed'])

const light = ref(50)
const co2 = ref(50)
const temp = ref(25)

const interacted = ref(0)
watch([light, co2, temp], () => {
  interacted.value++
  if (interacted.value >= 5) emit('completed', { ok: true })
})

const rate = computed(() => {
  const lightFactor = Math.min(1, light.value / 60)
  const co2Factor = Math.min(1, co2.value / 50)
  const tempFactor = temp.value < 5 ? 0.05 :
    temp.value < 10 ? 0.2 :
    temp.value <= 35 ? 0.3 + (temp.value - 10) * 0.028 :
    Math.max(0, 1 - (temp.value - 35) * 0.2)
  return Math.round(Math.min(1, lightFactor * co2Factor * tempFactor) * 100)
})

const lightDesc = computed(() => {
  if (light.value < 10) return '🌑 Почти темно — фотосинтез не идёт'
  if (light.value < 40) return '🌥️ Слабый свет — скорость низкая'
  if (light.value < 70) return '☁️ Умеренное освещение'
  return '☀️ Яркий свет — один из ключевых факторов'
})

const co2Desc = computed(() => {
  if (co2.value < 10) return 'Почти нет CO₂ — нечем строить глюкозу'
  if (co2.value < 40) return 'Мало углекислого газа'
  if (co2.value < 70) return 'Достаточно CO₂ для нормального фотосинтеза'
  return 'Много CO₂ — не ограничивает процесс'
})

const tempDesc = computed(() => {
  if (temp.value < 5) return '🥶 Слишком холодно — ферменты почти неактивны'
  if (temp.value < 15) return '❄️ Прохладно — медленно'
  if (temp.value <= 30) return '✅ Оптимальная температура (20–30°C)'
  if (temp.value <= 35) return '🔆 Тепло — ещё приемлемо'
  return '🔥 Слишком жарко — ферменты разрушаются!'
})

const rateStatus = computed(() => {
  if (rate.value < 10) return 'Фотосинтез не идёт'
  if (rate.value < 30) return 'Очень медленно'
  if (rate.value < 60) return 'Умеренно'
  if (rate.value < 85) return 'Активно'
  return '🔥 Максимальная скорость!'
})

const bubbleCount = computed(() => Math.ceil(rate.value / 20))

function bubbleStyle(n) {
  const positions = [10, 25, 40, 55, 70]
  return {
    left: positions[(n - 1) % positions.length] + '%',
    animationDelay: (n * 0.4) + 's',
    animationDuration: (2 + (n % 3)) + 's',
    opacity: rate.value > 20 ? 1 : 0
  }
}

const limitingFactor = computed(() => {
  if (rate.value >= 80) return null
  if (light.value < 30) return 'Освещённость'
  if (co2.value < 20) return 'Концентрация CO₂'
  if (temp.value < 10 || temp.value > 37) return 'Температура'
  return null
})

const insight = computed(() => {
  if (light.value < 10) return 'Без света фотосинтез невозможен — именно свет даёт энергию для реакции.'
  if (temp.value > 38) return 'При +40°C ферменты теряют форму — фотосинтез резко падает. Это называется тепловой денатурацией.'
  if (co2.value < 10) return 'CO₂ — это строительный материал для глюкозы. Без него некуда вставить атомы углерода.'
  if (rate.value > 80) return 'Все три фактора в оптимуме — именно так работает лист в солнечный летний день!'
  return 'Фотосинтез идёт тем быстрее, чем ближе все три фактора (свет, CO₂, температура) к оптимуму.'
})
</script>

<style scoped>
.photo-sim {
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

.sliders-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.slider-row {}

.slider-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.slider-icon { font-size: 16px; }

.slider-val {
  margin-left: auto;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-gold);
}

.bio-slider {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: var(--bg-elevated);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

.bio-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent-gold);
  border-radius: 50%;
  cursor: pointer;
}

.slider-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
  min-height: 16px;
}

.reaction-display {
  background: #080d14;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.reaction-formula {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 15px;
  font-family: monospace;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.r-co2 { color: #e08060; transition: opacity 0.5s; }
.r-h2o { color: #60a0e0; transition: opacity 0.5s; }
.r-plus { color: var(--text-muted); }
.r-arrow { color: var(--text-muted); font-size: 18px; }
.r-light { color: var(--accent-gold); }
.r-sun { font-style: italic; }
.r-glucose { color: var(--correct); transition: opacity 0.5s; }
.r-o2 { color: #80d0ff; transition: opacity 0.5s; }

.rate-display {}

.rate-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.rate-bar-wrap {
  background: var(--bg-elevated);
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 4px;
}

.rate-bar {
  height: 100%;
  background: linear-gradient(90deg, #2a6a2a, #4a9a4a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  transition: width 0.4s ease;
  min-width: 28px;
}

.rate-pct {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.rate-status {
  font-size: 12px;
  color: var(--correct);
  text-align: right;
}

.o2-bubbles {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  height: 30px;
  pointer-events: none;
}

.bubble {
  position: absolute;
  color: #80d0ff;
  font-size: 12px;
  animation: float-up linear infinite;
  bottom: 0;
  transition: opacity 0.3s;
}

@keyframes float-up {
  from { transform: translateY(0); opacity: 0.8; }
  to { transform: translateY(-30px); opacity: 0; }
}

.sim-insight {
  background: rgba(168, 197, 216, 0.07);
  border: 1px solid rgba(168, 197, 216, 0.15);
  border-radius: var(--radius);
  padding: 12px;
  margin-bottom: 8px;
}

.insight-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-blue);
  margin-bottom: 4px;
}

.insight-text {
  font-size: 13px;
  line-height: 1.5;
}

.limiting-factor {
  background: rgba(232, 200, 145, 0.07);
  border: 1px solid rgba(232, 200, 145, 0.2);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 13px;
}

.limit-label {
  color: var(--text-muted);
  margin-right: 6px;
}

.limit-val {
  font-weight: 600;
  color: var(--accent-gold);
}
</style>
