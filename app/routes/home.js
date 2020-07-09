const Router = require('koa-router')
const router = new Router({
  prefix: '/home'
})
const homeCtrl = require('../controllers/HomeController')

router.get('/', homeCtrl.index)
router.post('/upload', homeCtrl.upload)

module.exports = router