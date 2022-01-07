const crypto = require('crypto');

exports.getStore = fastify => async function (request, reply) {
  const {storeCode} = request.params;
  const [area, grid, box] = storeCode.split('-');
  const {Part, Supplier, StorePart, StoreBox, StoreGrid, StoreArea, History, User} = fastify.sequelize.models;
  if (area === "" || grid === undefined || grid === "" || box === undefined || box === "")
    throw fastify.httpErrors.badRequest("Store Code Format Error");
  if (parseInt(grid) === 0) {
    const sArea = await StoreArea.findOne({
      where: {
        code: area,
      },
      include: {
        model: StoreGrid,
        attributes: ['number', 'name'],
        include: {
          model: StoreBox,
          attributes: ['number'],
          include: {
            model: StorePart,
            attributes: ['id'],
            include: {
              model: Part,
              attributes: ['common_name'],
            },
          },
        },
      },
    });
    if (!sArea)
      throw fastify.httpErrors.notFound('Store Area Not Found');
    reply.code(200).send({
      store: {
        area_code: sArea.code,
        area_name: sArea.name,
      },
      storeContent: sArea.StoreGrids.map(function (grid) {
        return {
          number: grid.number,
          name: grid.name,
          boxes: grid.StoreBoxes.map(function (box) {
            let partNames = "";
            box.StoreParts.map((storePart) => (storePart.Part.common_name))
              .filter(function (element, index, arr) {
                return arr.indexOf(element) === index;
              }).forEach(function (name, index) {
              if (index !== 0)
                partNames += "、";
              partNames += name;
            });
            return {
              number: box.number,
              contents: partNames,
            };
          }),
        };
      }),
    });
  } else {

  }
  reply.code(200).send(null);
  return;

  if (storeParts.length === 0)
    throw fastify.httpErrors.notFound('Part Not Found');
  if (!!partId)
    storeParts = storeParts[0];
  reply.code(200).send(storeParts);
}
