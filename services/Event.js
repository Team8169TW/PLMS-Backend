exports.getAllEvent = fastify => async function (request, reply) {
  const {Event} = fastify.sequelize.models;

  const events = await Event.findAll({
    attributes: ['id', 'code', 'name', 'date', 'location', 'organize'],
  });

  console.log(JSON.stringify(events, null, 2));
  reply.send(events);
}

exports.getOrganizeEvent = fastify => async function (request, reply) {
  const {Event} = fastify.sequelize.models;
  const userOrg = request.user.organize;

  const events = await Event.findAll({
    attributes: ['id', 'code', 'name'],
    where: userOrg === "devteam" ?
        {}:{
            organize: request.user.organize,
        },
  });

  console.log(JSON.stringify(events, null, 2));
  reply.send(events);
}

exports.getEventDetail = fastify => async function (request, reply) {
  const {Event, EventOrg, EventRole, EventGate} = fastify.sequelize.models;

  const event = await Event.findOne({
    where: {
      code: request.params.eventCode,
    },
    include: [
      {
        model: EventOrg,
        as: "orgs",
        attributes: ['id', 'value'],
        //required: true,
      },
      {
        model: EventRole,
        as: "roles",
        attributes: ['id', 'value'],
        //required: true,
      },
      {
        model: EventGate,
        as: "gates",
        attributes: ['id', 'value'],
        //required: true,
      },
    ],
  });
  if (!event)
    throw fastify.httpErrors.notFound("Event Not Found");

  console.log(JSON.stringify(event, null, 2));
  reply.send(event);
}

