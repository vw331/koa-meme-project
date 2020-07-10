const Router = require('koa-router')
const jwt = require('koa-jwt')
const { secret } = require('../config')
const TopicCtrl = require('../controllers/TopicController')

const auth = jwt({ secret })

const router = new Router({
  prefix: '/topics'
})

router.get('/', TopicCtrl.find)
router.get('/:id', TopicCtrl.findById)
router.post('/', auth, TopicCtrl.create)
router.patch('/:id', auth, TopicCtrl.update)

module.exports = router