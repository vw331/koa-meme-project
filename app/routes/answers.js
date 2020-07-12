const Router = require('koa-router')
const {AnswerCtrl} = require('../controllers')
const {auth, checkAnswerer, checkAnswerExist} = require('../middleware')

const router = new Router({
  prefix: '/questions/:questionId/answers'
})


router.get('/', AnswerCtrl.find.bind(AnswerCtrl))
router.get('/:id', AnswerCtrl.findById.bind(AnswerCtrl))
router.post('/', auth, AnswerCtrl.create.bind(AnswerCtrl))
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, AnswerCtrl.update.bind(AnswerCtrl))
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, AnswerCtrl.delete.bind(AnswerCtrl))

module.exports = router