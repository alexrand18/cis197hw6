const isAuthenticated = (req, res, next) => {
  if (req.session.username && req.session.username.length > 0) next()
  else next(new Error('User is not logged in'))
}

module.exports = isAuthenticated
