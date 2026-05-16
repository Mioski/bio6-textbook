const STORAGE_KEY = 'bio6_progress'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function markCompleted(nodeId, elementId) {
  const data = load()
  if (!data[nodeId]) data[nodeId] = { elements: [] }
  if (!data[nodeId].elements.includes(elementId)) {
    data[nodeId].elements.push(elementId)
  }
  save(data)
}

export function getProgress(nodeId) {
  const data = load()
  const node = data[nodeId]
  if (!node) return 0
  const total = 6
  return Math.min(100, Math.round((node.elements.length / total) * 100))
}

export function isCompleted(nodeId) {
  return getProgress(nodeId) >= 100
}

export function getCompletedElements(nodeId) {
  const data = load()
  return data[nodeId]?.elements || []
}

export function resetProgress(nodeId) {
  const data = load()
  delete data[nodeId]
  save(data)
}

const ProgressService = { markCompleted, getProgress, isCompleted, getCompletedElements, resetProgress }
export default ProgressService
