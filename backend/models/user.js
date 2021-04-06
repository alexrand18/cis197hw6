const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://ahr18:ahr18@cluster0.bq2wq.mongodb.net/User?retryWrites=true&w=majority'
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const { Schema, model } = mongoose

const userSchema = new Schema({
  username: String,
  password: String,
})

const User = model('User', userSchema)

module.exports = User
