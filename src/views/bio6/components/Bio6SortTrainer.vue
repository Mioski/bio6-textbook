<template>
  <div class="sort-trainer">
    <div class="trainer-header">
      <span class="trainer-badge">Сортировка</span>
      <p class="trainer-instruction">{{ task.instruction }}</p>
    </div>

    <div v-if="!checked" class="sort-body">
      <div class="items-pool">
        <button
          v-for="item in pool"
          :key="item.id"
          class="sort-item"
          :class="{ selected: selectedItem?.id === item.id }"
          @click="selectItem(item)"
        >{{ item.text }}</button>
      </div>

      <div class="buckets-row">
        <div
          v-for="bucket in task.buckets"
          :key="bucket.id"
          class="bucket"
          @click="dropIntoBucket(bucket.id)"
        >
          <div class="bucket-label">{{ bucket.label }}</div>
          <div class="bucket-items">
            <div
              v-for="item in getInBucket(bucket.id)"
              :key="item.id"
              class="bucket-item"
              @click.stop="removeFromBucket(item)"
            >{{ item.text }} <span class="remove-x">✕</span></div>
          </div>
        </div>
      </div>

      <button
        class="check-btn"
        :disabled="placed.length < task.items.length"
        @click="check"
      >Проверить</button>
    </div>

    <div v-else class="sort-result">
      <div class="result-row" v-for="item in task.items" :key="item.id">
        <span class="result-icon">{{ item.bucket === placedMap[item.id] ? '✓' : '✗' }}</span>
        <span class="result-item">{{ item.text }}</span>
        <span class="result-arrow">→</span>
        <span class="result-bucket" :class="{ wrong: item.bucket !== placedMap[item.id] }">
          {{ getBucketLabel(item.bucket) }}
          <span v-if="item.bucket !== placedMap[item.id]"> (ты: {{ getBucketLabel(placedMap[item.id]) }})</span>
        </span>
      </div>
      <div class="feedback-box" :class="{ ok: isOk, fail: !isOk }">
        {{ isOk ? (task.feedbackOk || 'Отлично! Все элементы разложены верно.') : (task.feedbackWrong || 'Есть ошибки — посмотри правильные ответы выше.') }}
      </div>
      <button class="retry-btn" @click="reset">Попробовать снова</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ task: Object, nodeId: String })
const emit = defineEmits(['completed'])

const placed = ref([]) // {itemId, bucketId}
const selectedItem = ref(null)
const checked = ref(false)

const pool = computed(() => props.task.items.filter(i => !placed.value.find(p => p.itemId === i.id)))

function selectItem(item) {
  selectedItem.value = selectedItem.value?.id === item.id ? null : item
}

function dropIntoBucket(bucketId) {
  if (!selectedItem.value) return
  placed.value.push({ itemId: selectedItem.value.id, bucketId })
  selectedItem.value = null
}

function removeFromBucket(item) {
  placed.value = placed.value.filter(p => p.itemId !== item.id)
}

function getInBucket(bucketId) {
  return placed.value
    .filter(p => p.bucketId === bucketId)
    .map(p => props.task.items.find(i => i.id === p.itemId))
}

const placedMap = computed(() => {
  const m = {}
  placed.value.forEach(p => { m[p.itemId] = p.bucketId })
  return m
})

function getBucketLabel(bucketId) {
  return props.task.buckets.find(b => b.id === bucketId)?.label || bucketId
}

const isOk = computed(() => {
  const correct = props.task.items.filter(i => placedMap.value[i.id] === i.bucket).length
  return correct / props.task.items.length >= 0.7
})

function check() {
  checked.value = true
  emit('completed', { ok: isOk.value, score: Object.keys(placedMap.value).filter(k => placedMap.value[k] === props.task.items.find(i => i.id === k)?.bucket).length, attempts: 1 })
}

function reset() {
  placed.value = []
  selectedItem.value = null
  checked.value = false
}
</script>

<style scoped>
.sort-trainer {
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
  background: rgba(168, 197, 216, 0.15);
  color: var(--accent-blue);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.trainer-instruction {
  font-size: 14px;
  line-height: 1.5;
}

.items-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 40px;
}

.sort-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
}

.sort-item.selected {
  border-color: var(--accent-gold);
  background: rgba(232, 200, 145, 0.12);
}

.sort-item:hover { border-color: var(--accent-blue); }

.buckets-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.bucket {
  background: var(--bg);
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 10px;
  min-height: 80px;
  cursor: pointer;
  transition: border-color 0.12s;
}

.bucket:hover { border-color: var(--accent-gold); }

.bucket-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.bucket-items { display: flex; flex-direction: column; gap: 4px; }

.bucket-item {
  font-size: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.remove-x {
  color: var(--wrong);
  font-size: 10px;
  margin-left: 4px;
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
  transition: opacity 0.15s;
}

.check-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sort-result { display: flex; flex-direction: column; gap: 6px; }

.result-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.result-icon {
  font-weight: 700;
  color: var(--correct);
  flex-shrink: 0;
}

.result-icon:contains('✗') { color: var(--wrong); }

.result-arrow { color: var(--text-muted); }

.result-bucket.wrong { color: var(--wrong); }

.feedback-box {
  margin-top: 8px;
  padding: 12px;
  border-radius: var(--radius);
  font-size: 13px;
  line-height: 1.5;
}

.feedback-box.ok {
  background: rgba(140, 200, 130, 0.08);
  border: 1px solid var(--correct);
  color: var(--correct);
}

.feedback-box.fail {
  background: rgba(232, 160, 112, 0.08);
  border: 1px solid var(--wrong);
  color: var(--wrong);
}

.retry-btn {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text);
  margin-top: 8px;
}

.retry-btn:hover { border-color: var(--accent-gold); }
</style>
