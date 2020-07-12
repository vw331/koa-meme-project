const Router = require('koa-router')
const userCtrl = require('../controllers/UserController')
const {auth, checkOwner, checkUserExist, checkTopicExist, checkAnswerExist } = require('../middleware')

const router = new Router({ 
  prefix: '/users'
})


router.get('/', auth, userCtrl.find)
router.get('/:id', auth, userCtrl.findById)
router.post('/', auth, userCtrl.create)
router.patch('/:id', auth , checkOwner,userCtrl.update)
router.delete('/:id', auth, checkOwner, userCtrl.delete)
router.post('/login', userCtrl.login)
router.get('/:id/following', userCtrl.listFollowing)
router.get('/:id/followers', userCtrl.listFollowers)
router.put('/following/:id', auth, checkUserExist, userCtrl.follow)
router.delete('/following/:id', auth, checkUserExist, userCtrl.unfollow)
router.put('/followingTopics/:id', auth, checkTopicExist, userCtrl.followTopic)
router.delete('/followingTopics/:id', auth, checkTopicExist, userCtrl.unfollowTopic)
router.get('/:id/followingTopics', userCtrl.listFollowTopics)
router.get('/:id/questions', auth, userCtrl.listQuestions)
router.put('/likingAnswers/:id', auth, checkAnswerExist, userCtrl.likeAnswer, userCtrl.undislikeAnswer)
router.delete('/likingAnswers/:id', auth, checkAnswerExist, userCtrl.unlikeAnswer)
router.get('/:id/likingAnswers', userCtrl.listLikingAnswers)
router.put('/dislikeAnswer/:id', auth, checkAnswerExist, userCtrl.dislikeAnswer, userCtrl.unlikeAnswer)
router.delete('/dislikeAnswer/:id', auth, checkAnswerExist, userCtrl.undislikeAnswer)
router.get('/:id/dislikeAnswer', auth, userCtrl.listDislikingAnswers)
router.put('/collectAnswer/:id', auth, checkAnswerExist, userCtrl.collectAnswer)
router.delete('/collectAnswer/:id', auth, checkAnswerExist, userCtrl.uncollectAnswer)
router.get('/:id/collectAnswer', userCtrl.listCollectingAnswers)

module.exports = router