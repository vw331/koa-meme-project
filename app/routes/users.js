const Router = require('koa-router')
const jwt = require('koa-jwt')
const userCtrl = require('../controllers/UserController')
const { secret } = require('../config')

const router = new Router({ 
  prefix: '/users'
})


const auth = jwt({ secret })

const checkOwner = async (ctx, next) => {
  if(ctx.params.id !== ctx.state.user.id) {
    ctx.throw(403, '没有权限')
  }
  await next()
}


router.get('/', auth, userCtrl.find)
router.get('/:id', auth, userCtrl.findById)
router.post('/', auth, userCtrl.create)
router.patch('/:id', auth, checkOwner,userCtrl.update)
router.delete('/:id', auth, checkOwner, userCtrl.delete)
router.post('/login', userCtrl.login)

module.exports = router