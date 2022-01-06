'use strict'

const {DataTypes} = require("sequelize");

module.exports = async function (fastify, opts) {
  const StorePart = fastify.sequelize.define(
    'StorePart',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'store_parts',
      indexes: [{ unique: true, fields: ['part_id'] }]
    }
  );
}
