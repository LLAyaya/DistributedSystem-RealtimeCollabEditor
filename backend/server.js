require('dotenv').config()
const express = require('express')
const app = express()
const server = app.listen(5000, () => console.log('Server Started'))

const { WebSocketServer } = require('ws')

// Setting up websocket server
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
    console.log('websocket connected: ', ws)
})

// // Setting up mongoose
if (process.env.NO_DATABASE == 'true') {
    console.log('NO_DATABASE=true')
}
else {
    const mongoose = require('mongoose')

    mongoose.connect(process.env.MONGODB_URL)
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open',() => console.log('Connected to Database'))
}

// Setting up routes    
app.use(express.json())

const userRouter = require('./routes/User.js')
const roomRouter = require('./routes/Room.js')

app.use('/User', userRouter)
app.use('/Room', roomRouter)
