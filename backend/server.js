require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open',() => console.log('Connected to Database'))

app.use(express.json())

const userRouter = require('./routes/User.js')
const roomRouter = require('./routes/Room.js')

app.use('/User', userRouter)
app.use('/Room', roomRouter)

app.listen(3000, ()=> console.log('Server Started'))