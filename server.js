const express = require('express')
const cookieSession = require('cookie-session')
const accountRouter = require('./routes/account')
const apiRouter = require('./routes/api')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieSession({
  name: 'session',
  keys: ['ALEXRAND123456789'],
}))

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!')
})

app.use('/account', accountRouter)
app.use('/api', apiRouter)

app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
