<template>
  <div class="match-trainer">
    <div class="trainer-header">
      <span class="trainer-badge">Сопоставление</span>
      <p class="trainer-instruction">{{ task.instruction }}</p>
    </div>

    <div v-if="!checked" class="match-body">
      <div class="match-columns">
        <div class="match-col left-col">
          <button
            v-for="pair in pairs"
            :key="pair.id"
            class="match-item left"
            :class="{ active: selectedLeft === pair.id, matched: leftMatched.has(pair.id) }"
            @click="selectLeft(pair.id)"
            :disabled="leftMatched.has(pair.id)"
          >{{ pair.left }}</button>
        </div>
        <div class="match-col right-col">
          <button
            v-for="pair in shuffledRight"
            :key="pair.id"
            class="match-item right"
            :class="{ matched: rightMatched.has(pair.id) }"
            @click="selectRight(pair.id)"
            :disabled="rightMatched.has(pair.id)"
          >{{ pair.right }}</button>
        </div>
      </div>

      <div class="match-progress">
        Сопоставлено: {{ leftMatched.size }} / {{ pairs.length }}
      </div>

      <button class="check-btn" :disabled="leftMatched.size < pairs.length" @click="check">
        Проверить
      </button>
    </div>

    <div v-else class="match-result">
      <div v-for="pair in pairs" :key="pair.id" class="result-pair">
        <span :class="['result-icon', matchMap[pair.id] === pair.id ? 'ok' : 'err']">
          {{ matchMap[pair.id] === pair.id ? '✓' : '✗' }}
        </span>
        <span class="result-left">{{ pair.left }}</span>
        <span class="result-arrow">↔</span>
        <span class="result-right" :class="{ wrong: matchMap[pair.id] !== pair.id }">
          {{ pairs.find(p => p.id === matchMap[pair.id])?.right || '?' }}
          <span v-if="matchMap[pair.id] !== pair.id"> (верно: {{ pair.right }})</span>
        </span>
      </div>
      <div class="feedback-box" :class="{ ok: isOk, fail: !isOk }">
        {{ isOk ? (task.feedbackOk || 'Отлично! Всё сопоставлено верно.') : (task.feedbackWrong || 'Есть ошибки — посмотри правильные ответы выше.') }}
      </div>
      <button class="retry-btn" @click="reset">Попробовать снова</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ task: Object, nodeId: String })
const emit = defineEmits(['completed'])

// Normalize pairs: ensure each has a unique id
const pairs = computed(() =>
  (props.task.pairs || []).map((p, i) => ({ ...p, id: p.id ?? String(i) }))
)

const selectedLeft = ref(null)
const connections = ref([]) // {leftId, rightId}
const checked = ref(false)
const shuffledRight = ref([])

function makeShuffle() {
  return [...pairs.value].sort(() => Math.random() - 0.5)
}

onMounted(() => {
  shuffledRight.value = makeShuffle()
})

const leftMatched = computed(() => new Set(connections.value.map(c => c.leftId)))
const rightMatched = computed(() => new Set(connections.value.map(c => c.rightId)))

function selectLeft(id) {
  selectedLeft.value = id
}

function selectRight(rightId) {
  if (!selectedLeft.value) return
  connections.value = connections.value.filter(c => c.leftId !== selectedLeft.value)
  connections.value.push({ leftId: selectedLeft.value, rightId })
  selectedLeft.value = null
}

const matchMap = computed(() => {
  const m = {}
  connections.value.forEach(c => { m[c.leftId] = c.rightId })
  return m
})

const isOk = computed(() => {
  const correct = pairs.value.filter(p => matchMap.value[p.id] === p.id).length
  return correct / pairs.value.length >= 0.7
})

function check() {
  checked.value = true
  emit('completed', { ok: isOk.value, score: pairs.value.filter(p => matchMap.value[p.id] === p.id).length, attempts: 1 })
}

function reset() {
  connections.value = []
  selectedLeft.value = null
  checked.value = false
  shuffledRight.value = makeShuffle()
}
</script>

<style scoped>
.match-trainer {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
}

.trainer-header { margin-bottom: 16px; }

.trainer-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(140, 200, 130, 0.15);
  color: var(--correct);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.trainer-instruction {
  font-size: 14px;
  line-height: 1.5;
}

.match-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.match-col { display: flex; flex-direction: column; gap: 6px; }

.match-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 12px;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  line-height: 1.4;
  transition: border-color 0.12s, background 0.12s;
}

.match-item:hover:not(:disabled) { border-color: var(--accent-blue); }

.match-item.active {
  border-color: var(--accent-gold);
  background: rgba(232, 200, 145, 0.12);
}

.match-item.matched {
  border-color: var(--correct);
  background: rgba(140, 200, 130, 0.08);
  opacity: 0.7;
  cursor: not-allowed;
}

.match-progress {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
  text-align: center;
}

.check-btn {
  width: 100%;
  background: var(--accent-gold);
  color: #0d1117;
  border: none;
  border-radius: var(--radius);
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.check-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.match-result { display: flex; flex-direction: column; gap: 6px; }

.result-pair {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  flex-wrap: wrap;
}

.result-icon { flex-shrink: 0; font-weight: 700; }
.result-icon.ok { color: var(--correct); }
.result-icon.err { color: var(--wrong); }

.result-arrow { color: var(--text-muted); }
.result-right.wrong { color: var(--wrong); }

.feedback-box {
  margin-top: 8px;
  padding: 12px;
  border-radius: var(--radius);
  font-size: 13px;
  line-height: 1.5;
}

.feedback-box.ok { background: rgba(140,200,130,0.08); border: 1px solid var(--correct); color: var(--correct); }
.feedback-box.fail { background: rgba(232,160,112,0.08); border: 1px solid var(--wrong); color: var(--wrong); }

.retry-btn {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text);
  margin-top: 4px;
}

.retry-btn:hover { border-color: var(--accent-gold); }
</style>
