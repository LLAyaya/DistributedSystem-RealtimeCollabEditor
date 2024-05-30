require('dotenv').config()
const express = require('express')
const app = express()
const server = app.listen(5000, () => console.log('Server Started'))

// Setting up mongoose
const mongoose = require('mongoose')
if (process.env.NO_DATABASE == 'true') {
    console.log('NO_DATABASE=true')
}
else {
    connect()
    async function connect() {
        mongoose.connect(process.env.MONGODB_URL)
        const db = mongoose.connection
        db.on('error', (error) => console.error(error))
        db.once('open',() => console.log('Connected to Database'))
    }
}

// Setting up routes    
app.use(express.json())

const userRouter = require('./routes/User.js')
const roomRouter = require('./routes/Room.js')

app.use('/User', userRouter)
app.use('/Room', roomRouter)

// Setting up websocket server
// const ACTIONS = require('./actions/Actions');
const { WebSocketServer } = require('ws')
const User = require('./models/UserSchema.js')
const Room = require('./models/RoomSchema.js')

const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
    console.log('websocket connected')

    ws.on('message', async (rawMessage) => {
        // console.log(`Received message: ${message}`)
        const message = JSON.parse(rawMessage)

        switch(message.type) {
            case 'sign-up':
                try {
                    const existedUser = await User.findOne({ userName: message.data.userName }).exec()
                    
                    if (existedUser == null) {
                        const user = new User({
                            userName: message.data.userName,
                            userPassword: message.data.userPassword,
                            userRoomIds: []
                        })
                        await user.save()
    
                        ws.send(JSON.stringify({
                            type: 'accept',
                            data: 'Sign-up successful'
                        }))
                    }
                    else {
                        ws.send(JSON.stringify({
                            type: 'deny',
                            data: 'Sign-up failed. Username already taken'
                        }))
                    }
                    
                }
                catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny',
                        data: 'Sign-up failed. Unexpected error from the server. Please try again'
                    }))
                }
            break 

            case 'log-in':
                try {
                    const user = await User.findOne({ userName: message.data.userName, userPassword: message.data.userPassword }).exec()
                    
                    if (user != null) {
                        ws.send(JSON.stringify({
                            type: 'accept',
                            data: 'Log-in successful'
                        }))
                    }
                    else {
                        ws.send(JSON.stringify({
                            type: 'deny',
                            data: 'Log-in failed. Incorrect username or password'
                        }))
                    }

                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny',
                        data: 'Log-in failed. Unexpected error from the server. Please try again'
                    }))
                }
            break 
        }
        
    });
})

