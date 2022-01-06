'use strict'

const {DataTypes} = require("sequelize");

module.exports = async function (fastify, opts) {
  const Supplier = fastify.sequelize.define(
    'Supplier',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'suppliers',
    }
  );
}
