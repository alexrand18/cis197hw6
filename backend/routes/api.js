const express = require('express')

const router = express.Router()
const Question = require('../models/question')
const isAuthenticated = require('../middlewares/isAuthenticated')

router.get('/questions', async (req, res, next) => {
  Question.find({}, (err, data) => {
    if (err) next(new Error('Could not get the questions in DB'))
    else res.send(data)
  })
})

router.post('/questions/add', isAuthenticated, async (req, res, next) => {
  const { questionText } = req.body
  Question.create({ author: req.session.username, questionText }, (err, data) => {
    if (err) next(new Error('Error adding questions'))
    else res.send(data)
  })
})

router.post('/questions/answer', isAuthenticated, async (req, res, next) => {
  const { _id, answer } = req.body
  Question.updateOne({ _id }, { answer }, (err, data) => {
    if (err) next(new Error('Error answering the question'))
    else {
      const { nModified } = data
      if (nModified === 0) next(new Error('This question doesnt exist'))
      else res.send(`The question with id = ${_id} now has the answer ${answer}`)
    }
  })
})

router.get('/loggedIn', async (req, res) => {
  res.send(req.session.username)
})

module.exports = router
