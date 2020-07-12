const Router = require('koa-router')
const {CommentCtrl} = require('../controllers')
const {auth, checkCommentExist, checkCommentator} = require('../middleware')

const router = new Router({
  prefix: '/questions/:questionId/answers/:answerId/comments'
})


router.get('/', CommentCtrl.find.bind(CommentCtrl))
router.get('/:id', CommentCtrl.findById.bind(CommentCtrl))
router.post('/', auth, CommentCtrl.create.bind(CommentCtrl))
router.patch('/:id', auth, checkCommentExist, checkCommentator, CommentCtrl.update.bind(CommentCtrl))
router.delete('/:id', auth, checkCommentExist, checkCommentator, CommentCtrl.delete.bind(CommentCtrl))

module.exports = router