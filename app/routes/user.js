const Router = require('koa-router')
const router = new Router({ prefix: '/users'})
const userCtrl = require('../controllers/UserController')

router.get('/', userCtrl.find)

module.exports = router