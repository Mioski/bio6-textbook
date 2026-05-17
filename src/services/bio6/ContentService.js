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

const illustrations = {
  topic_12046_plant_cell:    { src: './images/bio6/plant-cell.svg',          caption: 'Схема строения растительной клетки' },
  topic_12051_root_zones:    { src: './images/bio6/root-zones.svg',          caption: 'Зоны корня (от кончика вверх)' },
  topic_12056_photosynthesis:{ src: './images/bio6/photosynthesis.svg',      caption: 'Фотосинтез: исходные вещества и продукты' },
  topic_12061_stem_wood:     { src: './images/bio6/stem-cross-section.svg',  caption: 'Поперечный срез деревянистого стебля' },
  topic_12055_leaf_structure:{ src: './images/bio6/leaf-cross-section.svg',  caption: 'Поперечный срез листа' },
  topic_12084_leaf_lab:      { src: './images/bio6/leaf-cross-section.svg',  caption: 'Строение листа на поперечном срезе' },
  topic_12070_flowers_pollination: { src: './images/bio6/flower-structure.svg', caption: 'Строение цветка' },
  topic_12086_flower_lab:    { src: './images/bio6/flower-structure.svg',    caption: 'Части цветка' },
  topic_12062_vascular_root: { src: './images/bio6/transport.svg',           caption: 'Транспорт веществ: ксилема и флоэма' },
  topic_12063_transpiration: { src: './images/bio6/transport.svg',           caption: 'Восходящий и нисходящий токи' },
  topic_12096_transport_lab: { src: './images/bio6/transport.svg',           caption: 'Транспорт веществ в растении' },
  topic_12071_fertilization: { src: './images/bio6/double-fertilization.svg',caption: 'Двойное оплодотворение (Навашин, 1898)' },
  topic_12101_pollination_fertilization: { src: './images/bio6/double-fertilization.svg', caption: 'Двойное оплодотворение покрытосеменных' },
  topic_12083_stem_lab:      { src: './images/bio6/stem-cross-section.svg',  caption: 'Слои стебля на поперечном срезе' },
}

export function getIllustration(nodeId) {
  return illustrations[nodeId] || null
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
  isDeepTopic,
  getIllustration
}

export default ContentService
