import courseFlow from '@data/course-flow.json'
import glossaryData from '@data/glossary.json'
import misconceptionsData from '@data/misconceptions.json'
import finalQuizData from '@data/final-quiz.json'
import sortTasksData from '@data/sort-tasks.json'
import matchTasksData from '@data/match-tasks.json'
import cheatsheetsData from '@data/cheatsheets.json'
import didYouKnowData from '@data/did-you-know.json'
import simData from '@data/sim-data.json'

const blocks = [
  { id: 'block1', title: 'Растительный организм', subtitle: 'Клетки, ткани, органы', emoji: '🔬' },
  { id: 'block2', title: 'Строение и жизнедеятельность', subtitle: 'Питание, дыхание, рост, размножение', emoji: '🌿' },
  { id: 'block3', title: 'Многообразие покрытосеменных', subtitle: 'Лабораторные работы', emoji: '🌸' },
  { id: 'block4', title: 'Жизнедеятельность организма', subtitle: 'Практические работы', emoji: '⚗️' },
  { id: 'block5', title: 'Резервное время', subtitle: 'Обобщение знаний', emoji: '📚' }
]

export function getCourseFlow() {
  return courseFlow
}

export function getBlocks() {
  return blocks
}

export function getBlock(blockId) {
  return blocks.find(b => b.id === blockId) || null
}

export function getBlockNodes(blockId) {
  return courseFlow.filter(n => n.block === blockId).sort((a, b) => a.order - b.order)
}

export function getNode(nodeId) {
  return courseFlow.find(n => n.id === nodeId) || null
}

export function getNextNode(nodeId) {
  const node = getNode(nodeId)
  if (!node) return null
  return courseFlow.find(n => n.order === node.order + 1) || null
}

export function getPrevNode(nodeId) {
  const node = getNode(nodeId)
  if (!node) return null
  return courseFlow.find(n => n.order === node.order - 1) || null
}

export function getGlossary(nodeId) {
  const entry = glossaryData.find(g => g.nodeId === nodeId)
  return entry ? entry.terms : []
}

export function getAllGlossaryTerms() {
  return glossaryData.flatMap(g => g.terms)
}

export function getMisconceptions(nodeId) {
  const entry = misconceptionsData.find(m => m.nodeId === nodeId)
  return entry ? entry.items : []
}

export function getFinalQuiz(nodeId) {
  const entry = finalQuizData.find(q => q.nodeId === nodeId)
  return entry ? entry.questions : []
}

export function getSortTasks(nodeId) {
  const entry = sortTasksData.find(t => t.nodeId === nodeId)
  return entry ? entry.tasks : []
}

export function getMatchTasks(nodeId) {
  const entry = matchTasksData.find(t => t.nodeId === nodeId)
  return entry ? entry.tasks : []
}

export function getCheatsheet(nodeId) {
  const entry = cheatsheetsData.find(c => c.nodeId === nodeId)
  return entry ? entry.sections : null
}

export function getDidYouKnow(nodeId) {
  const entry = didYouKnowData.find(d => d.nodeId === nodeId)
  return entry ? entry.facts : []
}

export function getSimData(nodeId) {
  const entry = simData.find(s => s.nodeId === nodeId)
  return entry ? entry.data : null
}

export function isDeepTopic(nodeId) {
  const node = getNode(nodeId)
  return node ? node.difficulty === 'deep' : false
}

const ContentService = {
  getCourseFlow,
  getBlocks,
  getBlock,
  getBlockNodes,
  getNode,
  getNextNode,
  getPrevNode,
  getGlossary,
  getAllGlossaryTerms,
  getMisconceptions,
  getFinalQuiz,
  getSortTasks,
  getMatchTasks,
  getCheatsheet,
  getDidYouKnow,
  getSimData,
  isDeepTopic
}

export default ContentService
