<template>
  <div class="tf-trainer">
    <div class="trainer-header">
      <span class="trainer-icon">✓✗</span>
      <span class="trainer-title">Верно или нет?</span>
    </div>

    <div v-if="!finished" class="task-area">
      <div class="statement-card">
        <p class="statement-text">{{ current.statement }}</p>
      </div>

      <div class="answer-row">
        <button class="btn-true" :disabled="answered" @click="answer(true)">
          <span class="btn-icon">✓</span> Верно
        </button>
        <button class="btn-false" :disabled="answered" @click="answer(false)">
          <span class="btn-icon">✗</span> Неверно
        </button>
      </div>

      <transition name="slide-up">
        <div v-if="answered" class="feedback" :class="feedbackClass">
          <div class="feedback-verdict">{{ feedbackVerdict }}</div>
          <p class="feedback-explanation">{{ current.explanation }}</p>
          <button class="btn-next" @click="next">
            {{ isLast ? 'Завершить' : 'Следующее →' }}
          </button>
        </div>
      </transition>

      <div class="progress-dots">
        <span
          v-for="(t, i) in tasks"
          :key="i"
          class="dot"
          :class="{
            current: i === index,
            correct: results[i] === true,
            wrong: results[i] === false
          }"
        />
      </div>
    </div>

    <div v-else class="result-screen">
      <div class="result-score">{{ correctCount }} / {{ tasks.length }}</div>
      <p class="result-label">правильных ответов</p>
      <button class="btn-restart" @click="restart">Попробовать ещё раз</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tasks: { type: Array, default: () => [] }
})

const emit = defineEmits(['completed'])

const index = ref(0)
const answered = ref(false)
const selected = ref(null)
const results = ref([])
const finished = ref(false)

const current = computed(() => props.tasks[index.value] || {})
const isLast = computed(() => index.value === props.tasks.length - 1)
const correctCount = computed(() => results.value.filter(r => r === true).length)

const feedbackClass = computed(() => {
  if (!answered.value) return ''
  const wasRight = selected.value === current.value.isTrue
  return wasRight ? 'feedback-correct' : 'feedback-wrong'
})

const feedbackVerdict = computed(() => {
  if (!answered.value) return ''
  const wasRight = selected.value === current.value.isTrue
  return wasRight
    ? (current.value.isTrue ? '✓ Верно — это правда' : '✓ Верно — это неправда')
    : (current.value.isTrue ? '✗ Неверно — это правда' : '✗ Неверно — это неправда')
})

function answer(choice) {
  if (answered.value) return
  selected.value = choice
  answered.value = true
  const correct = choice === current.value.isTrue
  results.value = [...results.value, correct]
}

function next() {
  if (isLast.value) {
    finished.value = true
    emit('completed')
  } else {
    index.value++
    answered.value = false
    selected.value = null
  }
}

function restart() {
  index.value = 0
  answered.value = false
  selected.value = null
  results.value = []
  finished.value = false
}
</script>

<style scoped>
.tf-trainer {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 16px;
}

.trainer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.trainer-icon {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-gold);
}

.trainer-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.statement-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: var(--radius);
  padding: 16px;
  min-height: 72px;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.statement-text {
  font-size: 15px;
  line-height: 1.5;
  color: var(--text);
  margin: 0;
}

.answer-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.btn-true,
.btn-false {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius);
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.15s;
}

.btn-true {
  background: #1a4a1a;
  color: #7ee89a;
  border: 1px solid #2a6a2a;
}

.btn-false {
  background: #4a1a1a;
  color: #f08585;
  border: 1px solid #6a2a2a;
}

.btn-true:disabled,
.btn-false:disabled {
  opacity: 0.5;
  cursor: default;
}

.btn-icon {
  font-size: 18px;
  font-weight: 700;
}

.feedback {
  border-radius: var(--radius);
  padding: 14px 16px;
  margin-bottom: 12px;
}

.feedback-correct {
  background: #0d2a1a;
  border: 1px solid #2a5a3a;
}

.feedback-wrong {
  background: #2a0d0d;
  border: 1px solid #5a2a2a;
}

.feedback-verdict {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
}

.feedback-correct .feedback-verdict { color: #7ee89a; }
.feedback-wrong .feedback-verdict { color: #f08585; }

.feedback-explanation {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0 0 12px;
}

.btn-next {
  background: var(--accent-blue, #1f6feb);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.progress-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #30363d;
  transition: background 0.2s;
}

.dot.current { background: var(--accent-gold); }
.dot.correct { background: #2ea043; }
.dot.wrong { background: #da3633; }

.result-screen {
  text-align: center;
  padding: 16px 0;
}

.result-score {
  font-size: 40px;
  font-weight: 700;
  color: var(--accent-gold);
  line-height: 1;
}

.result-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 20px;
}

.btn-restart {
  background: #161b22;
  border: 1px solid #30363d;
  color: var(--text);
  border-radius: var(--radius);
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}

.slide-up-enter-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
