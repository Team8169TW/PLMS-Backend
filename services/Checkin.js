exports.newCheckin = fastify => async function (request, reply) {
  const {Event, Declare, Checkin, EventOrg, EventRole, EventGate} = fastify.sequelize.models;
  const {eventId} = request.params;
  const {
    hash,
    gateId,
  } = request.body;
  const [RNRSv3, eventId2, hashMD5, isPhone = false] = hash.split("-");
  if (RNRSv3 != "RNRSv3" || eventId2 != eventId)
    throw fastify.httpErrors.badRequest("Format does not match");
  const event = await Event.findOne({
    where: {
      id: eventId,
    },
  });
  if (!event)
    throw fastify.httpErrors.notFound("Event Not Found");
  const declareWhere = isPhone ? {
    phone: hashMD5,
    eventId: eventId,
  } : {
    hash: hashMD5,
    eventId: eventId,
  };
  const declare = await Declare.findOne({
    where: declareWhere,
    attributes: ['id', 'name', 'createdAt'],
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
  if (!declare)
    throw fastify.httpErrors.notFound("Hash Not Found");
  const history = await Checkin.findAll({
    where: {
      DeclareId: declare.id,
    },
    attributes: ['id', 'createdAt'],
    include: [
      {
        model: EventGate,
        attributes: ['value'],
      },
    ],
    limit: 3,
    order: [
      ['id', 'DESC'],
    ]
  });
  const checkin = await Checkin.create({
    DeclareId: declare.id,
    EventGateId: gateId,
    OperatorId: request.user.id,
  });
  reply.code(201).send({
    id: checkin.id,
    declare: declare,
    history: history,
  });
}

exports.getCheckinByEventId = fastify => async function (request, reply) {
  const {Checkin, Declare, User, EventGate, EventOrg, EventRole} = fastify.sequelize.models;
  const checkin = await Checkin.findAll({
    attributes: ['id', 'note', 'createdAt'],
    include: [
      {
        model: Declare,
        attributes: ['id', 'name', 'hash'],
        where: {
          EventId: request.params.eventId,
        },
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
      },
      {
        model: EventGate,
        attributes: ['value'],
      },
      {
        model: User,
        attributes: ['name'],
      },
    ],
    order:[
        ['id'],
    ],
  });

  reply.code(200).send(checkin);
}

exports.addNote = fastify => async function (request, reply) {
  const {Checkin} = fastify.sequelize.models;
  const {checkinId} = request.params;
  const {
    content,
  } = request.body;
  const checkin = await Checkin.findOne({
    where: {
      id: checkinId,
    },
  });
  if (!checkin)
    throw fastify.httpErrors.notFound("Checkin Not Found");
  await Checkin.update({
    note: content,
  }, {
    where: {
      id: checkinId,
    },
  });
  reply.code(201).send({});
}

exports.removeCheckin = fastify => async function (request, reply) {
  const {Checkin} = fastify.sequelize.models;
  const {checkinId} = request.params;
  const checkin = await Checkin.findOne({
    where: {
      id: checkinId,
    },
  });
  if (!checkin)
    throw fastify.httpErrors.notFound("Checkin Not Found");
  await checkin.destroy();
  reply.code(204).send({});
}
