const crypto = require('crypto');

exports.getParts = fastify => async function (request, reply) {
  const {partId} = request.params;
  const {Part, Supplier, StorePart, StoreBox, StoreGrid, StoreArea, History, User} = fastify.sequelize.models;
  let storeParts = (await StorePart.findAll({
    attributes: ['id'],
    include: [
      {
        model: Part,
        attributes: ['id', 'category', 'common_name', 'spec', 'quantity', 'unit', 'product_name', 'product_code', 'note', 'createdAt'],
        include: [
          {
            model: Supplier,
            attributes: ['name'],
          }, {
            model: History,
            attributes: ['id', 'type', 'quantity', 'createdAt', 'operator_id'],
            limit: 3,
            order: [['id', 'DESC']],
            include: {
              model: User,
              attributes: ['name'],
            },
          }
        ],
        where: !!partId ? {id: partId} : {}
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
  })).map(function (item) {
    const {Supplier, Histories, ...others} = item.Part.dataValues;
    return {
      part: {...others, supplier_name: Supplier.name},
      store: {
        area_code: item.StoreBox.StoreGrid.StoreArea.code,
        area_name: item.StoreBox.StoreGrid.StoreArea.name,
        grid_number: item.StoreBox.StoreGrid.number,
        grid_name: item.StoreBox.StoreGrid.name,
        box_number: item.StoreBox.number,
      },
      history: Histories.map(function (history) {
        const {User, operator_id, ...others} = history.dataValues;
        return {...others, operator_name: User.name};
      }),
    };
  });
  if (storeParts.length === 0)
    throw fastify.httpErrors.notFound('Part Not Found');
  if (!!partId)
    storeParts = storeParts[0];
  reply.code(200).send(storeParts);
}
