const crypto = require('crypto');

exports.newDeclare = fastify => async function (request, reply) {
  const {Event, Declare} = fastify.sequelize.models;
  const {
    name,
    email,
    phone,
    orgId,
    roleId,
  } = request.body;

  const event = await Event.findOne({
    where: {
      code: request.params.eventCode,
    },
  });
  if (!event)
    throw fastify.httpErrors.notFound("Event Not Found");
  let hash = crypto.randomBytes(16).toString('hex');
  while (await Declare.count({where: {hash: hash}})) {
    hash = crypto.randomBytes(16).toString('hex');
  }
  await Declare.create({
    EventId: event.id,
    name: name,
    email: email,
    phone: phone,
    EventOrgId: orgId,
    EventRoleId: roleId,
    hash: hash,
  });
  reply.code(201).send({
    googleForm: (event.googleFormSrc != null),
    hash: `RNRSv3-${event.id}-${hash}`,
  });
}

exports.getDeclareByEventId = fastify => async function (request, reply) {
  const {Event, Declare, EventOrg, EventRole} = fastify.sequelize.models;
  const declare = await Declare.findAll({
    where: {
      EventId: request.params.eventId,
    },
    attributes: ['id', 'name', 'email', 'phone', 'hash', 'EventId', 'createdAt'],
    include: [
      {
        model: EventOrg,
        attributes: ['value'],
      },
      {
        model: EventRole,
        attributes: ['value'],
      },
    ],
  });

  reply.code(200).send(declare);
}
