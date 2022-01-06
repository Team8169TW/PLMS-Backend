'use strict'

const Auth = require('../services/Auth');

module.exports = async function (fastify, opts) {
  fastify.post('/auth/token', Auth.signJwt(fastify));
}
