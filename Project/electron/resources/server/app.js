'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const routes = require('./routes')
const RequestError = require('./RequestError')

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:3010' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(session({ secret: 'raccoonoo attak', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use(...routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(new RequestError('Not Found', 404))
})

// error handler
app.use(function (err, req, res, next) {
	const { message, status = 500 } = err
	console.log(`${status} - ${message}`)
	// set locals, only providing error in development
	res.locals.message = message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	res.status(status)
	res.send(message)
})

module.exports = app