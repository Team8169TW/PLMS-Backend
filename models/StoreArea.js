'use strict'

const {DataTypes} = require("sequelize");

module.exports = async function (fastify, opts) {
  const StoreArea = fastify.sequelize.define(
    'StoreArea',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'store_areas',
    }
  );
}
