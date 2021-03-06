<template>
    <i v-if='loading' class='fa fa-spinner fa-spin' style='font-size:36px'></i>
    <div v-else-if='!!message' class='alert alert-success' role='alert'>{{message}}</div>
    <div v-else-if='!!error' class='alert alert-danger' role='alert'>{{error}}</div>
</template>

<script>
    import Bluebird from 'bluebird'
    Bluebird.config({ warnings: true, cancellation: true })
    import config from '../../config'

    export default {
        props: ['href', 'method', 'json', 'data', 'onSuccess'],
        data() {
            return {
                token: this.$store.state.token,
                loading: true,
                message: undefined,
                error: undefined,
                request: undefined
            }
        },
        created() {
            this.load()
        },
        beforeDestroy() {
            if (this.request)
                this.request.cancel()
        },
        watch: {
            href() { this.load() },
            json() { this.load() },
            data() { this.load() }
        },
        methods: {
            load() {
                if (this.request) {
                    this.request.cancel()
                    this.loading = true
                    this.message = undefined
                    this.error = undefined
                }
                const options = {
                    method: this.method || 'GET',
                    headers: {}
                }
                if (this.token)
                    options.headers['Authorization'] = `Bearer ${this.token}`
                if (this.json) {
                    options.body = JSON.stringify(this.json)
                    options.headers['Content-Type'] = 'application/json'
                } else if (this.data)
                    options.body = this.data
                this.request = Bluebird.resolve(fetch(`${config.api}${this.href}`, options))
                    .then(res => res.text().then(body => {
                        if (!res.ok)
                            this.error = body
                        else
                            this.message = this.onSuccess(JSON.parse(body))
                    }))
                    .catch(err => this.error = 'An error has occured...')
                    .finally(() => this.loading = false)
            }
        }
    }
</script>