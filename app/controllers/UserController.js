const User = require('../models/users')

class UserController {
  async find(ctx) {
    ctx.body = await User.find()
  }
}

module.exports = new UserController()