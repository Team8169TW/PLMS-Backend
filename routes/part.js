'use strict'

const Part = require('../services/Part');

module.exports = async function (fastify, opts) {
  fastify.get('/part', Part.getPart(fastify));
  fastify.get('/part/:partId', Part.getPart(fastify));
}
