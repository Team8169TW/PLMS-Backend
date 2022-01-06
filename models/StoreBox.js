'use strict'

const {DataTypes} = require("sequelize");

module.exports = async function (fastify, opts) {
  const StoreBox = fastify.sequelize.define(
    'StoreBox',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      number: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'store_boxes',
    }
  );
}
