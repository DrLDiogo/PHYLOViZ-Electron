<template>
        <div>
            <i class='fa fa-spinner fa-spin' v-if='loading' style='font-size:36px'></i>
            <form class='form-inline'>
                <div class='form-group'>
                    <label class='mr-sm-2' for='animation-speed'>Animation speed</label>
                    <input class='form-control-range mr-sm-2' id='animation-speed' type='range' min='0' max='100' v-model='speed' @change='sliderChange'>
                </div>
                <div class='form-group'>
                    <label class='mr-sm-2' for='cut-value'>Tree cut-off</label>
                    <input class='form-control mr-sm-2' id='cut-value' type='number' v-model='cut' min='0' :max='maxCut'>
                    <button class='btn btn-outline-success mr-sm-2' id='cut-button' @click='cutOff'>Cut</button>
                </div>
                <div class='form-group'>
                    <label class='mr-sm-2' for='search-input'>Search: </label>
                    <input class='form-control mr-sm-2' id='search-input' type='text' name='Search' v-model='nodeId'>
                    <button class='btn btn-outline-success mr-sm-2' id='search-button' @click='search'>Search</button>
                </div>
                <div class='form-group'>
                    <button class='btn btn-outline-success mr-sm-2' id='labels-button' @click='toggleLabels'>Toggle Labels</button>
                </div>
            </form>
            <br>
            <strong>{{project.name}}</strong>
            <svg id='canvas' :width='width' :height='height' style='border:1px solid black'></svg>
            <div id='ancillary'></div>
        </div>
</template>

<script>
    import { init, destroy } from '../../javascripts'

    export default {
        data() {
            return {
                functions: undefined,
                project: undefined,
                graph: undefined,
                flattened: undefined,
                ancillary: undefined,
                algorithm: undefined,
                speed: 50,
                cut: 0,
                maxCut: 0,
                nodeId: '',
                loading: false
            }
        },
        mounted() {
            this.algorithm = this.project.render
            this.functions = init(this.algorithm)
            this.cut = this.maxCut = Math.max(...this.project.graph.edges.map(e => e.distance))
            this.graph = this.functions.direct(this.project.graph)
            this.flattened = {
                vertices: this.functions.flatten(this.graph.root),
                edges: this.graph.edges
            }
            this.ancillary = this.project.ancillary.head || []
            this.functions.ancillary(this.flattened, this.project.ancillary.body)
            this.render()
        },
        created() {
            this.height = window.innerHeight - 200
            this.width = window.innerWidth - 300
            this.project = this.$store.state.project
        },
        beforeDestroy() {
            destroy()
            this.$store.commit('setProject')
        },
        methods: {
            render() {
                this.loading = true
                const graph = this.flattened
                graph.edges = this.graph.edges.filter(e => e.distance <= this.cut)
                this.functions.render(graph)
                this.loading = false
            },
            sliderChange() {
                this.functions.updateSpeed(this.speed / 100)
            },
            cutOff(e) {
                e.preventDefault()
                this.render()
            },
            search(e) {
                e.preventDefault()
                this.functions.search(this.nodeId)
            },
            toggleLabels(e) {
                e.preventDefault()
                this.functions.toggleLabels()
            }
        }
    }
</script>