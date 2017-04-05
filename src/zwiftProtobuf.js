/* eslint-disable indent */
const fs = require('fs')
const protobuf = require('protobufjs')

const proto = fs.readFileSync(`${__dirname}/zwiftMessages.proto`)

module.exports = protobuf.parse(proto, { keepCase: true }).root
