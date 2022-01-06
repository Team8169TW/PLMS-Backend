'use strict'

const {DataTypes} = require("sequelize");

module.exports = async function (fastify, opts) {
  const History = fastify.sequelize.define(
    'History',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      note: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'history',
    }
  );
}
