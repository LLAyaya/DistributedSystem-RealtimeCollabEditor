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
                        }, null, 4))
                    }
                    else {
                        ws.send(JSON.stringify({
                            type: 'deny',
                            data: 'Sign-up failed. Username already taken'
                        }, null, 4))
                    }
                    
                }
                catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny',
                        data: 'Sign-up failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break 

            case 'log-in':
                try {
                    const user = await User.findOne({ userName: message.data.userName, userPassword: message.data.userPassword }).exec()
                    
                    if (user != null) {
                        ws.send(JSON.stringify({
                            type: 'accept',
                            data: 'Log-in successful'
                        }, null, 4))
                    }
                    else {
                        ws.send(JSON.stringify({
                            type: 'deny',
                            data: 'Log-in failed. Incorrect username or password'
                        }, null, 4))
                    }

                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny',
                        data: 'Log-in failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break 
            
            case 'create-room':
                try{
                    const existedRoom = await Room.findOne({ roomId: message.data.roomId }).exec()
                    let roomId = message.data.roomId || Math.floor(Math.random() * 1000000);
                    if (existedRoom == null){
                        const room = new Room({
                            roomId,
                            roomMembers: [],
                            // content:
                        })
                        await room.save();

                        ws.send(JSON.stringify({
                            type: 'accept',
                            data: {
                                message: 'Room created successfully',
                                roomId:   roomId
                            }
                        }, null, 4))
                    } else {
                        ws.send(JSON.stringify({
                            type: 'deny',
                            data: 'Room already exists'
                        }, null, 4))
                    }
                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny',
                        data: 'Create-room failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break

            case 'join-room':
                try {
                    const room = await Room.findOne({roomId: message.data.roomId}).exec()
                    const member = await User.findOne({userName: message.data.userName}).exec()
                    
                    // console.log(room)
                    // console.log(member)

                    if (room != null && member != null){   
                        if(!room.roomMembers.includes(message.data.userName)){
                            room.roomMembers.push(message.data.userName);
                            await room.save();

                            if (!member.userRoomIds.includes(message.data.roomId)){
                                member.userRoomIds.push(message.data.roomId);
                                await member.save();
                            }

                            ws.send(JSON.stringify({
                                type: 'accept',
                                data: 'Joined room successfully'
                            }, null, 4))

                        } else {
                            ws.send(JSON.stringify({
                                type: 'deny',
                                data: 'User already in the room'
                            }, null, 4))
                        }
                    } else {
                        ws.send(JSON.stringify({
                            type: 'deny',
                            data: 'Room not found'
                        }, null, 4))
                    }
                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny',
                        data: 'Join-room failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break
            
            case 'edit-content':
                try {
                    const room = await Room.findOne({roomId :message.data.roomId}).exec()
                    if (room!= null ) {
                        if(!room.roomMembers.includes(message.data.userName)){
                            ws.send(JSON.stringify({
                                type: 'deny',
                                data: 'User is not a member of the room'
                            }, null, 4))
                            return
                        }
                        
                        switch (message.data.operation) {
                            case 'add':
                                // console.log(`Adding content: '${message.data.content}'`);
                                room.content += message.data.content; 
                                // console.log(`Updated content after add: '${room.content}'`);
                                break
                            case 'delete': 
                                if (message.data.content != null) {
                                    // Remove only the specified part of the content
                                    const index = room.content.indexOf(message.data.content);
                                    if (index > -1) {
                                        room.content = room.content.substring(0, index) + room.content.substring(index + message.data.content.length);
                                    } else {
                                        ws.send(JSON.stringify({
                                            type: 'deny',
                                            data: 'Specified content not found'
                                        }, null, 4))
                                        return
                                    }
                                } else {
                                    room.content = "";
                                }
                                break
                            default:
                                ws.send(JSON.stringify({
                                    type: 'deny',
                                    data: 'Invalid operation'
                                }, null, 4))
                                return
                        }

                        await room.save();

                        ws.send(JSON.stringify({
                            type: 'accept',
                            data: {
                                message: 'Content updated successfully',
                                operation:  `${message.data.operation} - '${message.data.content}'`,
                                newContent: room.content
                            }
                        }, null, 4))
                    } else {
                        ws.send(JSON.stringify({
                            type: 'deny',
                            data: 'Room not found'
                        }))
                    }
                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny',
                        data: 'Failed to update content. Please try again'
                    },null,4))
                }
            break
                
        }
    });

    const updateContent = Room.watch();

    updateContent.on('change', (change) => {
        switch (change.operationType) {
            case 'update':
                const updatedFields = change.updateDescription.updatedFields;
                if (updatedFields.content != null) {
                    const roomId = change.documentKey._id;
                    const newContent = updatedFields.content;

                    wss.clients.forEach(client => {
                        // if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'update-content',
                                roomId: roomId,
                                content: newContent
                            }));
                        // }
                    });
                }
                break;
        }
    });
})

