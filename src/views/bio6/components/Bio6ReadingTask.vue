<template>
  <div class="reading-task">
    <p class="reading-text">{{ task.text }}</p>
    <div class="reading-question">
      <p class="question-label">❓ {{ task.question }}</p>
      <div class="options">
        <button
          v-for="(opt, i) in task.options"
          :key="i"
          class="option-btn"
          :class="optionClass(i)"
          :disabled="answered"
          @click="answer(i)"
        >{{ opt }}</button>
      </div>
      <div v-if="answered" class="explanation">
        <span v-if="selected === task.correct" class="correct-mark">✓</span>
        <span v-else class="wrong-mark">✗</span>
        {{ task.explanation }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  task:   { type: Object, required: true },
  nodeId: { type: String, required: true }
})
const emit = defineEmits(['completed'])

const selected = ref(null)
const answered = ref(false)

function answer(i) {
  if (answered.value) return
  selected.value = i
  answered.value = true
  emit('completed', { correct: i === props.task.correct })
}

function optionClass(i) {
  if (!answered.value) return ''
  if (i === props.task.correct) return 'correct'
  if (i === selected.value) return 'wrong'
  return 'dimmed'
}
</script>

<style scoped>
.reading-task {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
}

.reading-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.question-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-btn {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.12s;
}

.option-btn:not(:disabled):hover {
  border-color: var(--accent-gold);
}

.option-btn.correct {
  border-color: var(--correct);
  color: var(--correct);
  background: #0f2a0f;
}

.option-btn.wrong {
  border-color: var(--wrong);
  color: var(--wrong);
  background: #2a0f0f;
}

.option-btn.dimmed {
  opacity: 0.4;
}

.explanation {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
  padding: 10px;
  background: var(--bg-elevated);
  border-radius: 6px;
}

.correct-mark { color: var(--correct); font-weight: 700; margin-right: 4px; }
.wrong-mark   { color: var(--wrong);   font-weight: 700; margin-right: 4px; }
</style>
