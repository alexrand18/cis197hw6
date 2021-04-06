/* eslint-disable no-console */
const express = require('express')
const cookieSession = require('cookie-session')
const path = require('path')
const http = require('http')
const socketIo = require('socket.io')
const accountRouter = require('./routes/account')
const apiRouter = require('./routes/api')

const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', socket => {
  socket.on('addNewQuestion', question => {
    io.emit('getNewQuestion', question)
  })
  socket.on('answeredQuestion', info => {
    io.emit('getNewAnswer', info)
  })
  socket.on('disconnect', () => console.log('disconnected'))
})

app.use(express.json())
app.use(express.static('dist'))
app.use(cookieSession({
  name: 'session',
  keys: ['ALEXRAND123456789'],
}))

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!')
})

app.use('/account', accountRouter)
app.use('/api', apiRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
