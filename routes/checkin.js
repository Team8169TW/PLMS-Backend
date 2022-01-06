'use strict'

const Checkin = require('../services/Checkin');

module.exports = async function (fastify, opts) {
  fastify.post('/checkin/:eventId', Checkin.newCheckin(fastify));
  fastify.post('/checkin/note/:checkinId', Checkin.addNote(fastify));
  fastify.get('/checkin/:eventId', Checkin.getCheckinByEventId(fastify));
  fastify.delete('/checkin/:checkinId', Checkin.removeCheckin(fastify));
}
