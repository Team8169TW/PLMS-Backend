const crypto = require('crypto');

exports.getHistory = fastify => async function (request, reply) {
  const {Part, StoreBox, StoreGrid, StoreArea, History, User} = fastify.sequelize.models;
  const history = await History.findAll({
    attributes: ['id', 'type', 'quantity', 'note', 'createdAt'],
    order: [['id', 'DESC']],
    include: [
      {
        model: Part,
        attributes: ['id', 'common_name', 'spec', 'unit'],
      }, {
        model: StoreBox,
        attributes: ['number'],
        include: {
          model: StoreGrid,
          attributes: ['number'],
          include: {
            model: StoreArea,
            attributes: ['code'],
          },
        },
      }, {
        model: User,
        attributes: ['name'],
      }
    ],
  });
  reply.code(200).send(history.map(function (item) {
    const {Part, StoreBox, User, ...historyOthers} = item.dataValues;
    const {id, ...partOthers} = Part.dataValues;
    return {
      ...historyOthers,
      ...partOthers,
      part_id: id,
      operator_name: User.name,
      storeCode: `${StoreBox.StoreGrid.StoreArea.code}-${StoreBox.StoreGrid.number}-${StoreBox.number}`,
    };
  }));
}

exports.partsTransport = fastify => async function (request, reply) {
  const {Part, Supplier, StorePart, StoreBox, StoreGrid, StoreArea, History} = fastify.sequelize.models;
  const {
    partId,
    type,
    number,
  } = request.body;
  if (number <= 0)
    throw fastify.httpErrors.badRequest('Number must be unsigned');
  const part = await Part.findOne({
    attributes: ['id', 'quantity'],
    where: {
      id: partId,
    },
    include: {
      model: StorePart,
      attributes: ['id'],
    },
  });
  let newQuantity;
  if (!part)
    throw fastify.httpErrors.notFound('Part Not Found');
  if (type === "STORE_IN") {
    newQuantity = part.quantity + number;
  } else if (type === "STORE_OUT") {
    newQuantity = part.quantity - number;
    if (newQuantity < 0)
      throw fastify.httpErrors.badRequest('Not enough parts');
  } else
    throw fastify.httpErrors.badRequest('Type Error');
  await Part.update({
    quantity: newQuantity,
  }, {
    where: {
      id: partId,
    },
  });
  const history = await History.create({
    part_id: partId,
    store_box_id: part.StorePart.id,
    type: type,
    quantity: number,
    operator_id: request.user.id,
  });
  const storeParts = (await StorePart.findOne({
    attributes: ['id'],
    include: [
      {
        model: Part,
        attributes: ['id', 'category', 'common_name', 'spec', 'quantity', 'unit', 'product_name', 'product_code', 'note', 'createdAt'],
        include: {
          model: Supplier,
          attributes: ['name'],
        },
        where: {
          id: partId,
        },
      }, {
        model: StoreBox,
        attributes: ['number'],
        include: {
          model: StoreGrid,
          attributes: ['number', 'name'],
          include: {
            model: StoreArea,
            attributes: ['code', 'name'],
          },
        },
      }
    ],
  }));
  const {Supplier: sup, ...others} = storeParts.Part.dataValues;
  reply.code(200).send({
    history_id:history.id,
    part: {...others, supplier_name: sup.name},
    store: {
      area_code: storeParts.StoreBox.StoreGrid.StoreArea.code,
      area_name: storeParts.StoreBox.StoreGrid.StoreArea.name,
      grid_number: storeParts.StoreBox.StoreGrid.number,
      grid_name: storeParts.StoreBox.StoreGrid.name,
      box_number: storeParts.StoreBox.number,
    },
  });
}