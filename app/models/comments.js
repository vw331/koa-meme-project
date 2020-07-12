const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String },
  commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: String, required: true },
  answerId: { type: String, required: true }
})

module.exports = model('Comment', commentSchema)

