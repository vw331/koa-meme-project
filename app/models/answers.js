const { Schema, model } = require('mongoose')

const answerSchema = new Schema({
  __V: { type: Number, select: false },
  content: { type: String, required: true },
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
  questionId: { type: String, required: true },
  voteCount: { type: Number, required: true, default: 0 }
}, { timestamps: true })

module.exports = model('Answer', answerSchema)