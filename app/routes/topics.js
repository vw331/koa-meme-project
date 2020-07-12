const Router = require('koa-router')
const TopicCtrl = require('../controllers/TopicController')
const {auth, checkTopicExist} = require('../middleware')

const router = new Router({
  prefix: '/topics'
})

router.get('/', TopicCtrl.find)
router.get('/:id', TopicCtrl.findById)
router.post('/', auth, TopicCtrl.create)
router.patch('/:id', auth, checkTopicExist, TopicCtrl.update)
router.get('/:id/followers', checkTopicExist, TopicCtrl.listTopicFollowers)
router.get('/:id/questions', checkTopicExist, TopicCtrl.listQuestions)

module.exports = router