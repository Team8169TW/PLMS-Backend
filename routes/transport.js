'use strict'

const Transport = require('../services/Transport');

module.exports = async function (fastify, opts) {
  fastify.get('/transport', Transport.getHistory(fastify));
  fastify.post('/transport', Transport.partsTransport(fastify));
}
