const { Schema, Model } = require('mongoose')

const userSchema = new Schema({
  name: { type: String, required: true, }
})

module.exports = model('User', userSchema)

