'use strict'

const Auth = require('../services/Auth');

module.exports = async function (fastify, opts) {
  //fastify.post('/auth', (request, reply) => Auth.SignJwt(request, reply, fastify));
  fastify.post('/auth/token', Auth.signJwt(fastify));
  fastify.get('/auth/me', Auth.me(fastify));
  fastify.delete('/auth', async function (request, reply) {
    return {};
  });
}
