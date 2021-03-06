'use strict'

const processors = require('./processors')
const comparators = require('./comparators')
const algorithms = require('./algorithms')
const modes = require('./modes')
const RequestError = require('../../RequestError')

function init(mode = 'promises') {
    const process = modes[mode](processors, comparators, algorithms)
    return function (processor = 'goeburst', comparator = 'goeburst', algorithm = 'boruvka', profiles, lvs) {
        return process(processor, comparator, algorithm, profiles, lvs)
            .catch(() => { throw new RequestError('Invalid parameters', 400) })
    }
}

module.exports = init