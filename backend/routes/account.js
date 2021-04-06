const express = require('express')

const router = express.Router()
const User = require('../models/user')
const isAuthenticated = require('../middlewares/isAuthenticated')

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body
  User.create({ username, password }, (err, data) => {
    if (err) next(new Error('Failure signing up'))
    else {
      req.session.username = username
      res.send('success')
    }
  })
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  User.findOne({ username, password }, (err, data) => {
    if (err) next(new Error('Failure logging in'))
    else if (!data) res.send('The username and password are not found')
    else {
      req.session.username = username
      res.send('success')
    }
  })
})

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.username = null
  res.send('NO ONE IS LOGGED IN')
})

module.exports = router
