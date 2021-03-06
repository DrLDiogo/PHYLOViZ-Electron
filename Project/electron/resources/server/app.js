'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./routes')
const RequestError = require('./RequestError')

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

app.use(...routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(new RequestError('Not Found', 404))
})

// error handler
app.use(function (err, req, res, next) {
	const { path, method } = req
	const { message, status = 500, stack } = err
	console.error(`\nPath: ${path}, Method: ${method}, Status: ${status}`)
	console.error(`${stack}`)
	// set locals, only providing error in development
	res.locals.message = message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	res.status(status)
	res.send(message)
})

module.exports = app