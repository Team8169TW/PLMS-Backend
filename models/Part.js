'use strict'

const {DataTypes} = require("sequelize");

module.exports = async function (fastify, opts) {
  const Part = fastify.sequelize.define(
    'Part',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      category: {
        type: DataTypes.STRING,
      },
      common_name: {
        type: DataTypes.STRING,
      },
      spec: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      unit: {
        type: DataTypes.STRING,
      },
      product_name: {
        type: DataTypes.STRING,
      },
      product_code: {
        type: DataTypes.STRING,
      },
      note: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'parts',
    }
  );
}
