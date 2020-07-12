const auth = require('./auth')
const checkOwner = require('./checkOwner')
const checkUserExist = require('./checkUserExist')
const checkTopicExist = require('./checkTopicExist')
const checkQuestionExist = require('./checkQuestionExist')
const checkQuestioner = require('./checkQuestioner')

module.exports = {
  auth,
  checkOwner,
  checkUserExist,
  checkTopicExist,
  checkQuestionExist,
  checkQuestioner,
  checkAnswerer: require('./checkAnswerer'),
  checkAnswerExist: require('./checkAnswerExist'),
  checkCommentExist: require('./checkCommentExist'),
  checkCommentator: require('./checkCommentator')
}