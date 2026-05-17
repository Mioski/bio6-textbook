<template>
  <div class="quiz-section">
    <h3 class="quiz-title">🎯 Финальный квиз</h3>

    <div v-if="!finished">
      <div class="quiz-progress">
        Вопрос {{ current + 1 }} из {{ shuffled.length }}

      </div>
      <div class="quiz-question">{{ shuffled[current].text || shuffled[current].question }}</div>
      <div class="quiz-options">
        <button
          v-for="(opt, i) in shuffled[current].options"
          :key="i"
          class="quiz-option"
          :class="getOptionClass(i)"
          @click="answer(i)"
          :disabled="answered"
        >
          <span class="opt-letter">{{ ['А', 'Б', 'В', 'Г'][i] }}</span>
          <span class="opt-text">{{ opt }}</span>
        </button>
      </div>
      <transition name="fade">
        <div v-if="answered" class="quiz-feedback" :class="{ correct: lastCorrect, wrong: !lastCorrect }">
          <div class="fb-verdict">{{ lastCorrect ? '✓ Верно' : '✗ Не совсем' }}</div>
          <div class="fb-text">{{ shuffled[current].explanation || shuffled[current].feedback }}</div>
          <button class="fb-next" @click="next">
            {{ current < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить →' }}
          </button>
        </div>
      </transition>
    </div>

    <div v-else class="quiz-result">
      <div class="result-emoji">{{ resultEmoji }}</div>
      <div class="result-score">{{ score }} / {{ shuffled.length }}</div>
      <div class="result-label">{{ resultLabel }}</div>
      <div class="result-pct">{{ Math.round((score / shuffled.length) * 100) }}% верных ответов</div>
      <button class="retry-btn" @click="restart">Попробовать ещё раз</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ questions: Array })
const emit = defineEmits(['completed'])

const current = ref(0)
const answered = ref(false)
const lastCorrect = ref(false)
const score = ref(0)
const finished = ref(false)
const selectedIdx = ref(null)

function shuffleQuestion(q) {
  const indices = q.options.map((_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return {
    ...q,
    options: indices.map(i => q.options[i]),
    correct: indices.indexOf(q.correct)
  }
}

const shuffled = ref([])

function buildShuffled() {
  shuffled.value = props.questions.map(shuffleQuestion)
}

buildShuffled()

function answer(i) {
  if (answered.value) return
  answered.value = true
  selectedIdx.value = i
  const correct = i === shuffled.value[current.value].correct
  lastCorrect.value = correct
  if (correct) score.value++
}

function getOptionClass(i) {
  if (!answered.value) return ''
  if (i === shuffled.value[current.value].correct) return 'correct'
  if (i === selectedIdx.value && !lastCorrect.value) return 'wrong'
  return 'dimmed'
}

function next() {
  if (current.value < shuffled.value.length - 1) {
    current.value++
    answered.value = false
    selectedIdx.value = null
  } else {
    finished.value = true
    emit('completed', { ok: true, score: score.value, attempts: 1 })
  }
}

function restart() {
  buildShuffled()
  current.value = 0
  answered.value = false
  lastCorrect.value = false
  score.value = 0
  finished.value = false
  selectedIdx.value = null
}

const resultEmoji = computed(() => {
  const pct = score.value / shuffled.value.length
  if (pct >= 0.8) return '🏆'
  if (pct >= 0.6) return '👍'
  return '📖'
})

const resultLabel = computed(() => {
  const pct = score.value / shuffled.value.length
  if (pct >= 0.8) return 'Отличный результат!'
  if (pct >= 0.6) return 'Хорошо, но есть что повторить.'
  return 'Советую перечитать конспект и попробовать снова.'
})
</script>

<style scoped>
.quiz-section { margin-bottom: 24px; }

.quiz-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
}

.quiz-progress {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.quiz-level {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.quiz-question {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 16px;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.quiz-option {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.12s, background 0.12s;
}

.quiz-option:hover:not(:disabled) {
  border-color: var(--accent-blue);
  background: var(--bg-elevated);
}

.quiz-option:disabled { cursor: default; }

.quiz-option.correct {
  border-color: var(--correct);
  background: rgba(140, 200, 130, 0.08);
}

.quiz-option.wrong {
  border-color: var(--wrong);
  background: rgba(232, 160, 112, 0.08);
}

.quiz-option.dimmed { opacity: 0.4; }

.opt-letter {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  background: var(--bg-elevated);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}

.opt-text { font-size: 14px; line-height: 1.4; }

.quiz-feedback {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 14px;
  border: 1px solid var(--border);
}

.quiz-feedback.correct { border-color: var(--correct); }
.quiz-feedback.wrong { border-color: var(--wrong); }

.fb-verdict {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
}

.quiz-feedback.correct .fb-verdict { color: var(--correct); }
.quiz-feedback.wrong .fb-verdict { color: var(--wrong); }

.fb-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.fb-next {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text);
  width: 100%;
}

.fb-next:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.quiz-result {
  text-align: center;
  padding: 24px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.result-emoji { font-size: 44px; margin-bottom: 8px; }

.result-score {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent-gold);
  margin-bottom: 4px;
}

.result-label {
  font-size: 15px;
  margin-bottom: 4px;
}

.result-pct {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.retry-btn {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text);
}

.retry-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
