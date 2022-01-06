const readFileSync = require('fs').readFileSync;
const bcrypt = require('bcryptjs');
const {createSigner, createVerifier} = require('fast-jwt');
const authConfig = require('../config/authConfig');
const {OAuth2Client} = require('google-auth-library');

const privateKey = readFileSync(authConfig.privateKeyPath);
const publicKey = readFileSync(authConfig.publicKeyPath);
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

const sign = createSigner({
  algorithm: 'RS256',
  key: privateKey,
  expiresIn: authConfig.tokenExpiresIn * 1000,
});
const verify = createVerifier({
  key: publicKey,
  cache: true
});

exports.signJwt = fastify => async function (request, reply) {
  const {User} = fastify.sequelize.models;
  const {id_token} = request.body;
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: clientId,
  });
  const payload = ticket.getPayload();
  console.log(payload);
  let user = await User.findOne({where: {google_user_id: payload['sub']}});
  if (!user)
    user = await User.create({google_user_id: payload['sub'], email: payload['email'], name: payload['name'], role: 'visitor'});
  const token = sign({sub: user.id, user: {email: user.email, name: user.name, role: user.role}});
  reply.send({
    token_type: "Bearer",
    expires_in: authConfig.tokenExpiresIn,
    access_token: token,
  });
}

exports.verifyJwt = fastify => async function (request, reply) {
  const route = `${request.routerMethod} ${request.routerPath}`;
  if (!authConfig.authExclude.includes(route)) {
    try {
      const payload = verify((request.headers.authorization || '').replace('Bearer ', ''))
      request.user = await fastify.sequelize.models.User.findByPk(payload.sub);
    } catch (err) {
      throw fastify.httpErrors.unauthorized(err.code);
      //reply.send(err);
    }
  }
}
