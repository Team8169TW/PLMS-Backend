'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return {Success: true};
  })

  fastify.get('/authInfo', async function (request, reply) {
    return {clientId: process.env.GOOGLE_OAUTH_CLIENT_ID};
  })
}
