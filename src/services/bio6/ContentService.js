import courseFlow from '@data/course-flow.json'
import glossaryData from '@data/glossary.json'
import misconceptionsData from '@data/misconceptions.json'
import finalQuizData from '@data/final-quiz.json'
import sortTasksData from '@data/sort-tasks.json'
import matchTasksData from '@data/match-tasks.json'
import cheatsheetsData from '@data/cheatsheets.json'
import didYouKnowData from '@data/did-you-know.json'
import simData from '@data/sim-data.json'
import readingTasksData from '@data/reading-tasks.json'
import rememberCheckData from '@data/remember-check.json'
import trueFalseData from '@data/true-false-tasks.json'

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

export function getReadingTasks(nodeId) {
  const entry = readingTasksData.find(t => t.nodeId === nodeId)
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

export function getRememberCheck(nodeId) {
  const entry = rememberCheckData.find(r => r.nodeId === nodeId)
  return entry ? { remember: entry.remember, check: entry.check } : null
}

export function getTrueFalseTasks(nodeId) {
  const entry = trueFalseData.find(t => t.nodeId === nodeId)
  return entry ? entry.tasks : []
}

export function isDeepTopic(nodeId) {
  const node = getNode(nodeId)
  return node ? node.difficulty === 'deep' : false
}

const illustrations = {
  topic_12045_higher_lower:   { src: 'images/bio6/higher-lower-plants.svg',   caption: 'Низшие (водоросли) и высшие растения' },
  topic_12046_plant_cell:     { src: 'images/bio6/plant-cell.svg',             caption: 'Схема строения растительной клетки' },
  topic_12047_plant_tissues:  { src: 'images/bio6/plant-tissues.svg',          caption: 'Виды тканей растений' },
  topic_12049_root:           { src: 'images/bio6/root-types.svg',             caption: 'Стержневая и мочковатая корневые системы' },
  topic_12050_root_structure: { src: 'images/bio6/root-cross-section.svg',     caption: 'Поперечный срез корня' },
  topic_12051_root_zones:     { src: 'images/bio6/root-zones.svg',             caption: 'Зоны корня (от кончика вверх)' },
  topic_12054_shoot_buds:     { src: 'images/bio6/shoot-structure.svg',        caption: 'Строение побега: узел, почка, лист' },
  topic_12055_leaf_structure: { src: 'images/bio6/leaf-cross-section.svg',     caption: 'Поперечный срез листа' },
  topic_12056_photosynthesis: { src: 'images/bio6/photosynthesis.svg',         caption: 'Фотосинтез: исходные вещества и продукты' },
  topic_12057_root_breathing: { src: 'images/bio6/stomata.svg',                caption: 'Устьице: механизм открытия и закрытия' },
  topic_12061_stem_wood:      { src: 'images/bio6/stem-cross-section.svg',     caption: 'Поперечный срез деревянистого стебля' },
  topic_12062_vascular_root:  { src: 'images/bio6/transport.svg',              caption: 'Транспорт веществ: ксилема и флоэма' },
  topic_12063_transpiration:  { src: 'images/bio6/transport.svg',              caption: 'Восходящий и нисходящий токи' },
  topic_12064_meristem:       { src: 'images/bio6/meristem.svg',               caption: 'Зоны роста корня и побега (меристемы)' },
  topic_12068_vegetative_repro: { src: 'images/bio6/vegetative-repro.svg',     caption: 'Способы вегетативного размножения' },
  topic_12070_flowers_pollination: { src: 'images/bio6/flower-structure.svg',  caption: 'Строение цветка' },
  topic_12071_fertilization:  { src: 'images/bio6/double-fertilization.svg',   caption: 'Двойное оплодотворение (Навашин, 1898)' },
  topic_12072_fruit_types:    { src: 'images/bio6/fruit-types.svg',            caption: 'Сухие и сочные плоды покрытосеменных' },
  topic_12073_seed_structure: { src: 'images/bio6/seed-structure.svg',         caption: 'Строение семени фасоли' },
  topic_12074_seed_preparation: { src: 'images/bio6/germination.svg',          caption: 'Этапы прорастания семени' },
  topic_12076_life_forms:     { src: 'images/bio6/life-forms.svg',             caption: 'Жизненные формы: дерево, кустарник, трава' },
  topic_12079_tissues_lab:    { src: 'images/bio6/plant-tissues.svg',          caption: 'Виды растительных тканей' },
  topic_12080_root_types_lab: { src: 'images/bio6/root-types.svg',             caption: 'Стержневая и мочковатая корневые системы' },
  topic_12081_root_modifications: { src: 'images/bio6/root-modifications.svg', caption: 'Видоизменения корней' },
  topic_12082_shoot_lab:      { src: 'images/bio6/shoot-structure.svg',        caption: 'Строение побега на схеме' },
  topic_12083_stem_lab:       { src: 'images/bio6/stem-cross-section.svg',     caption: 'Слои стебля на поперечном срезе' },
  topic_12084_leaf_lab:       { src: 'images/bio6/leaf-cross-section.svg',     caption: 'Строение листа на поперечном срезе' },
  topic_12086_flower_lab:     { src: 'images/bio6/flower-structure.svg',       caption: 'Части цветка' },
  topic_12087_inflorescences: { src: 'images/bio6/inflorescence.svg',          caption: 'Типы соцветий покрытосеменных' },
  topic_12093_photosynthesis_role: { src: 'images/bio6/photosynthesis-equation.svg', caption: 'Уравнение и значение фотосинтеза' },
  topic_12095_leaf_stem_breathing: { src: 'images/bio6/stomata.svg',           caption: 'Механизм работы устьиц' },
  topic_12096_transport_lab:  { src: 'images/bio6/transport.svg',              caption: 'Транспорт веществ в растении' },
  topic_12098_seed_germination_practical: { src: 'images/bio6/germination.svg', caption: 'Условия и этапы прорастания семян' },
  topic_12101_pollination:    { src: 'images/bio6/double-fertilization.svg',   caption: 'Двойное оплодотворение покрытосеменных' },
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
  getReadingTasks,
  getCheatsheet,
  getDidYouKnow,
  getSimData,
  isDeepTopic,
  getIllustration,
  getRememberCheck,
  getTrueFalseTasks
}

export default ContentService
