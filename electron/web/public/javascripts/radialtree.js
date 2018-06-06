'use strict'

import * as d3 from 'd3'

const defaultDistanceMultiplier = 100
const defaultZeroDistanceValue = 10

//Calculates the coordinates for each node 
//to represent a radial tree given a directed graph
function radialTree(r, edges) {
    const rootLeafCount = leafcount(r)
    let list = []
    list.push(r)
    r.rightborder = 0
    r.wedgesize = (2 * Math.PI)
    r.x = 0
    r.y = 0
    while (list.length > 0) {
        const v = list.pop()
        let v_border = v.rightborder
        v.children.forEach((w => {
            list.push(w)
            w.rightborder = v_border
            w.wedgesize = (2 * Math.PI) * leafcount(w) / rootLeafCount
            const w_alfa = w.rightborder + w.wedgesize / 2
            const edge_distance = w.distance
            let w_dist = edge_distance * defaultDistanceMultiplier + defaultZeroDistanceValue
            if (v == r) {
                r.xp = v.x + Math.cos(w_alfa) * w_dist
                r.yp = v.y + Math.sin(w_alfa) * w_dist
            }
            w.x = v.x + Math.cos(w_alfa) * w_dist
            w.y = v.y + Math.sin(w_alfa) * w_dist
            w.xp = v.x
            w.yp = v.y
            v_border += w.wedgesize
        }))
    }
}

//Determines how many leafs nodes the given node has
function leafcount(node) {
    return node.children.length === 0 ? 1 : node.children.reduce((acc, curr) => acc + leafcount(curr), 0)
}

//D3 fields
let svg
let link
let node
const height = 700
const width = 1400

//Initializer of D3 fields
function initRadial(canvas) {
    svg = canvas
        .attr('width', width)
        .attr('height', height)
        .call(d3.zoom().on('zoom', () => svg.attr('transform', d3.event.transform))).append('g')

    link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')

    node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
}


//Builds, using D3, a static representation of radial tree
function createRadialTree(vertices) {
    link = link
        .data(vertices)

    let edgeEnter = link
        .enter()
        .append('g')
        .attr('transform', d => 'rotate(0)')

    let line = edgeEnter
        .append('line')
        .attr('x1', d => d.x + width / 2)
        .attr('y1', d => d.y + height / 2)
        .attr('x2', d => d.xp + width / 2)
        .attr('y2', d => d.yp + height / 2)
        .style('stroke', '#000000')
        .attr('stroke-width', 1)

    let nodes = node
        .data(vertices)

    let nodeEnter = nodes
        .enter()
        .append('g')
        .attr('classe','node')
        .attr('transform', d => 'rotate(0)')

    let circle = nodeEnter
        .append('circle')
        .attr('id', d => d.id)
        .attr('cx', d => d.x + width / 2)
        .attr('cy', d => d.y + height / 2)
        .attr('r', 5)
        .style('fill', '#00549f')

    nodeEnter
        .append('text')
        .style('visibility', 'visible')
        .attr('dx',-1)
        .attr('dy', 0)
        .attr('x', d => d.x + width / 2)
        .attr('y', d => d.y + height / 2)
        .text(d => d.id)
        .style('font-size', d => d.size / 3 + 'px')
}

export { radialTree, createRadialTree, initRadial }