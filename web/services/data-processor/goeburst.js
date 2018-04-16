'use strict'

const boruvka = require('./algorithms/boruvka')

module.exports = { process, reprocess, comparator }

// Generate a minimum spanning tree (edges and vertices) and distance matrix from the given allelic profiles and comparator
function process(profiles, comparator, lvs) {
	return new Promise(resolve => resolve(boruvka(profiles, comparator, lvs)))
}

// Generate a minimum spanning tree from an existing one using a different maximum distance
function reprocess(graph, max) {
	return {
		vertices: Object.assign({}, graph.vertices),
		edges: graph.edges.filter(edge => edge.distance <= max)
	}
}

// Compare two edges ({ source: vertex, target: vertex, distance: 1 }) with the following tie-breaking rules:
// 1. biggest distance
// 2. smallest LV count up to lvs
// 3. youngest (= biggest id)
function comparator(p, q, lvs = 3) {
	let diff = p.distance - q.distance
	if (diff !== 0)
		return diff
	const p_source_lvs = p.source.lvs, p_target_lvs = p.target.lvs
	const q_source_lvs = q.source.lvs, q_target_lvs = q.target.lvs
	for (let lv = 1; lv <= lvs; lv++) {
		diff = Math.max(q_source_lvs[lv] || 0, q_target_lvs[lv] || 0) - Math.max(p_source_lvs[lv] || 0, p_target_lvs[lv] || 0)
		if (diff !== 0)
			return diff
		diff = Math.min(q_source_lvs[lv] || 0, q_target_lvs[lv] || 0) - Math.min(p_source_lvs[lv] || 0, p_target_lvs[lv] || 0)
		if (diff !== 0)
			return diff
	}
	diff = Math.min(p.source.id, p.target.id) - Math.min(q.source.id, q.target.id)
	return diff !== 0 ? diff : (Math.max(p.source.id, p.target.id) - Math.max(q.source.id, q.target.id))
}