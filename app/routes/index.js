const Router = require('koa-router');
const users = require('./users')
const home = require('./home')
const topics = require('./topics')
const questions = require('./questions')
const answers = require('./answers')
const comments = require('./comments')

const v1 = new Router({
  prefix: '/api/v1'
});

v1.use(users.routes())
v1.use(home.routes())
v1.use(topics.routes())
v1.use(questions.routes())
v1.use(answers.routes())
v1.use(comments.routes())

module.exports = v1;