'use strict'

const Event = require('../services/Event');

module.exports = async function (fastify, opts) {
  fastify.get('/event', Event.getAllEvent(fastify));
  fastify.get('/event/organize', Event.getOrganizeEvent(fastify));
  fastify.get('/event/:eventCode', Event.getEventDetail(fastify));
}
