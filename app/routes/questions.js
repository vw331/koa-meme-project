const Router = require('koa-router')
const QuestionsCtrl = require('../controllers/QuestionsController')
const {auth, checkQuestionExist, checkQuestioner} = require('../middleware')

const router = new Router({
  prefix: '/questions'
})


router.get('/', QuestionsCtrl.find.bind(QuestionsCtrl))
router.get('/:id', QuestionsCtrl.findById.bind(QuestionsCtrl))
router.post('/', auth, QuestionsCtrl.create.bind(QuestionsCtrl))
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, QuestionsCtrl.update.bind(QuestionsCtrl))
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, QuestionsCtrl.delete.bind(QuestionsCtrl))

module.exports = router