import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Canvas from './components/Canvas.vue'
import DatasetsTable from './components/DatasetsTable.vue'
import FileUpload from './components/FileUpload.vue'
import Algorithms from './components/Algorithms.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
Vue.component('Navbar', Navbar)
Vue.component('Sidebar', Sidebar)
Vue.component('Canvas', Canvas)
Vue.component('DatasetsTable', DatasetsTable)
Vue.component('Algorithms', Algorithms)
Vue.component('Register', Register)
Vue.component('Login', Login)

Vue.use(Router)
Vue.use(Vuex)
Vue.use(BootstrapVue)

const store = new Vuex.Store({
    state: {
        dataset: undefined,
        auth: false
    },
    mutations: {
        setDataset(state, data) {
            state.dataset = data
        },
        setAuth(state, auth) {
            state.auth = auth
        }
    }
})

const routes = [
    {
        path: '/public-datasets',
        component: DatasetsTable
    },
    {
        path: '/canvas',
        component: Canvas
    },
    {
        path: '/upload-dataset',
        component: FileUpload
    },
    {
        path: '/algorithms',
        component: Algorithms
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/login',
        component: Login
    }
]

const router = new Router({ mode: 'history', routes })

new Vue({
    store,
    router,
    el: '#app',
    render: h => h(App)
})