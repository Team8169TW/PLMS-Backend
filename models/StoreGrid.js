'use strict'

const {DataTypes} = require("sequelize");

module.exports = async function (fastify, opts) {
  const StoreGrid = fastify.sequelize.define(
    'StoreGrid',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      number: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'store_grids',
    }
  );
}
