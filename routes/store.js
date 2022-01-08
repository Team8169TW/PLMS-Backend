'use strict'

const Store = require('../services/Store');

module.exports = async function (fastify, opts) {
  fastify.get('/store/:storeCode', Store.getStore(fastify));
  fastify.get('/store', Store.getStores(fastify));
}
