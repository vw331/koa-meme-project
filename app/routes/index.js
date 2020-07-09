const Router = require('koa-router');
const users = require('./users')
const home = require('./home')

const v1 = new Router({
  prefix: '/api/v1'
});

v1.use(users.routes())
v1.use(home.routes())

module.exports = v1;