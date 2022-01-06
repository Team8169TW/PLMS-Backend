'use strict'

require('dotenv').config();
const path = require('path');
const AutoLoad = require('fastify-autoload');
const SequelizeFastify = require('sequelize-fastify');
const Auth = require('./services/Auth');
const ModelAssociateSetup = require('./models/AssociateSetupSetup');

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(
    SequelizeFastify,
    {
      instance: 'sequelize',
      sequelizeOptions: {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      }
    }
  ).ready(async () => {
    try {
      await fastify.sequelize.authenticate();
      fastify.log.info('Connection has been established successfully.');
      // await fastify.sequelize.sync({alter: true});
    } catch (error) {
      fastify.log.error('Unable to connect to the database:', error);
    }
  });
  
  fastify.register(require('fastify-cors'), {});

  fastify.decorateRequest('user', null);
  fastify.addHook('onRequest', Auth.verifyJwt(fastify));

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'models'),
    options: Object.assign({}, opts)
  });
  fastify.register(ModelAssociateSetup);

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
  
  //fastify.close();
}
