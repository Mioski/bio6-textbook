let _router = null

export function setRouter(router) {
  _router = router
}

export function goToNode(nodeId) {
  if (_router) _router.push({ name: 'bio6-node', params: { nodeId } })
}

export function goToBlock(blockId) {
  if (_router) _router.push({ name: 'bio6-overview', params: { blockId } })
}

export function goToIndex() {
  if (_router) _router.push({ name: 'bio6-index' })
}

export function goNext(currentNodeId, courseFlow) {
  const node = courseFlow.find(n => n.id === currentNodeId)
  if (!node) return
  const next = courseFlow.find(n => n.order === node.order + 1)
  if (next) goToNode(next.id)
}

export function goPrev(currentNodeId, courseFlow) {
  const node = courseFlow.find(n => n.id === currentNodeId)
  if (!node) return
  const prev = courseFlow.find(n => n.order === node.order - 1)
  if (prev) goToNode(prev.id)
}

const NavigationService = { setRouter, goToNode, goToBlock, goToIndex, goNext, goPrev }
export default NavigationService
