const Router = require('koa-router');
const users = require('./users')
const home = require('./home')
const topics = require('./topics')

const v1 = new Router({
  prefix: '/api/v1'
});

v1.use(users.routes())
v1.use(home.routes())
v1.use(topics.routes())

module.exports = v1;