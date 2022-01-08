exports.getStore = fastify => async function (request, reply) {
  const {storeCode} = request.params;
  const [area, grid, box] = storeCode.split('-');
  const {Part, StorePart, StoreBox, StoreGrid, StoreArea} = fastify.sequelize.models;
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
    const sGrid = await StoreGrid.findOne({
      attributes: ['number', 'name'],
      where: {
        number: parseInt(grid),
      },
      order: [
        [StoreBox, 'number'],
      ],
      include: [
        {
          model: StoreArea,
          where: {
            code: area,
          },
        },
        {
          model: StoreBox,
          attributes: ['number'],
          where: parseInt(box) ? {
            number: parseInt(box),
          } : {},
          include: {
            model: StorePart,
            attributes: ['id'],
            include: {
              model: Part,
              attributes: ['id', 'common_name', 'spec', 'quantity', 'unit'],
            },
          },
        }
      ],
    });
    if (!sGrid)
      throw fastify.httpErrors.notFound(`Store ${parseInt(box) ? "Box" : "Grid"} Not Found`);
    reply.code(200).send({
      store: {
        area_code: sGrid.StoreArea.code,
        area_name: sGrid.StoreArea.name,
        grid_number: sGrid.number,
        grid_name: sGrid.name,
        box_number: parseInt(box),
      },
      storeContent: sGrid.StoreBoxes.map((box) => ({
        number: box.number,
        parts: box.StoreParts.map((storePart) => (storePart.Part)),
      })),
    });
  }
}

exports.getStores = fastify => async function (request, reply) {
  const {Part, StorePart, StoreBox, StoreGrid, StoreArea} = fastify.sequelize.models;
  const sArea = await StoreArea.findAll({
    attributes: ['code', 'name'],
    order: [
      'code',
      [StoreGrid, 'number'],
      [StoreGrid, StoreBox, 'number'],
    ],
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
  reply.code(200).send(sArea.map((area) => ({
    code: area.code,
    name: area.name,
    grids: area.StoreGrids.map((grid) => ({
      number: grid.number,
      name: grid.name,
      boxes: grid.StoreBoxes.map((box) => ({
        number: box.number,
        parts: box.StoreParts
          .map((storeParts) => (storeParts.Part.common_name))
          .filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
          }),
      })),
    })),
  })));
}

