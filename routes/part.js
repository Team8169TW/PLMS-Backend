'use strict'

const Part = require('../services/Part');

module.exports = async function (fastify, opts) {
  fastify.get('/part', Part.getParts(fastify));
  fastify.get('/part/:partId', Part.getParts(fastify));
}
