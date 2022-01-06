const crypto = require('crypto');

exports.getPart = fastify => async function (request, reply) {
  const {Part, Supplier, StorePart, StoreBox, StoreGrid, StoreArea} = fastify.sequelize.models;
  const storeParts = await StorePart.findAll({
    attributes: ['id'],
    include:[
      {
        model: Part,
        attributes: ['id','category','common_name','spec','quantity','unit','product_name','product_code','note','createdAt'],
      },{
        model: StoreBox,
        attributes: ['number'],
        include: {
          model: StoreGrid,
          attributes: ['number','name'],
          include: {
            model: StoreArea,
            attributes: ['code','name'],
          },
        },
      }
    ]
  });

  reply.code(200).send(storeParts);
}
