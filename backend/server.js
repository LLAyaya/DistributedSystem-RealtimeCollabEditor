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
                            type: 'accept sign-up',
                            data: {
                                message: 'Sign up successfully',
                                userName: user.userName
                            }
                        }, null, 4))
                    }
                    else {
                        ws.send(JSON.stringify({
                            type: 'deny sign-up',
                            data: 'Sign-up failed. Username already taken'
                        }, null, 4))
                    }
                    
                }
                catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny sign-up',
                        data: 'Sign-up failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break 

            case 'log-in':
                try {
                    const user = await User.findOne({ userName: message.data.userName, userPassword: message.data.userPassword }).exec()
                    
                    if (user != null) {
                        const rooms = await Room.find({'roomId': {$in: user.userRoomIds}}).exec()
                        
                        // console.log(rooms)

                        const roomDetail = rooms.map(room =>({
                            roomId: room.roomId,
                            roomMembers: room.roomMembers,
                            content: room.content
                        }))
                        
                        console.log(roomDetail)

                        ws.send(JSON.stringify({
                            type: 'accept log-in',
                            data: { 
                                message: 'Log-in successful',
                                userName: user.userName,
                                isIn: user.userRoomIds,
                                roomDetail: roomDetail
                            }
                        }, null, 4))
                    }
                    else {
                        ws.send(JSON.stringify({
                            type: 'deny log-in',
                            data: 'Log-in failed. Incorrect username or password'
                        }, null, 4))
                    }

                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny log-in',
                        data: 'Log-in failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break 
            
            case 'create-room':
                try{
                    const existedRoom = await Room.findOne({ roomId: message.data.roomId }).exec()
                    const user = await User.findOne({userName: message.data.userName}).exec()
                    let roomId = message.data.roomId || Math.floor(Math.random() * 1000000);
                    
                    if (existedRoom == null){
                        const room = new Room({
                            roomId,
                            roomMembers: [{
                                name: message.data.userName,
                                cursorLine: 0,
                                cursorChar: 0,
                            }]
                        })
                        await room.save();

                        
                        if (!user.userRoomIds.includes(message.data.roomId)){
                            user.userRoomIds.push(message.data.roomId);
                            await user.save();
                        }

                        ws.send(JSON.stringify({
                            type: 'accept create room',
                            data: {
                                message: 'Room created successfully',
                                roomDetail: {
                                    roomId: roomId,
                                    roomContent: content,
                                    roomMembers: roomMembers
                                }
                            }
                        }, null, 4))
                    } else {
                        ws.send(JSON.stringify({
                            type: 'deny create room',
                            data: 'Room already exists'
                        }, null, 4))
                    }
                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny create room',
                        data: 'Create-room failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break

            case 'join-room':
                try {
                    const room = await Room.findOne({roomId: message.data.roomId}).exec()
                    const member = await User.findOne({userName: message.data.userName}).exec()

                    if (room != null && member != null) {
                        if(!room.roomMembers.some(roomMember => roomMember.name === message.data.userName)) {
                            room.roomMembers.push({
                                name: message.data.userName,
                                cursorLine: 0,
                                cursorChar: 0,
                            });
                            await room.save();

                            if (!member.userRoomIds.includes(message.data.roomId)){
                                member.userRoomIds.push(message.data.roomId);
                                await member.save();
                            }

                            ws.send(JSON.stringify({
                                type: 'accept join-room',
                                data: {
                                    message: 'Joined room successfully',
                                    roomInfo: {
                                        roomId: room.roomId,
                                        roomMembers: room.roomMembers,
                                        content: room.content
                                    }
                                }
                            }, null, 4))

                            // ws.send(JSON.stringify({
                            //     type: 'sync',
                            //     data: {
                            //         roomMembers: room.roomMembers,
                            //         content: room.content
                            //     }
                            // }, null, 4))

                        } else {
                            ws.send(JSON.stringify({
                                type: 'deny join-room',
                                data: 'User already in the room'
                            }, null, 4))
                        }
                    } else {
                        ws.send(JSON.stringify({
                            type: 'deny join-room',
                            data: 'Room not found'
                        }, null, 4))
                    }
                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny join-room',
                        data: 'Join-room failed. Unexpected error from the server. Please try again'
                    }, null, 4))
                }
            break
            
            case 'edit-content':
                try {
                    const room = await Room.findOne({roomId: message.data.roomId}).exec()
                    if (room != null ) {
                        if(!room.roomMembers.some(roomMember => roomMember.name === message.data.userName)) {
                            console.log(message.data.name)
                            ws.send(JSON.stringify({
                                type: 'deny edit-content',
                                data: 'User is not a member of the room'
                            }, null, 4))
                            return
                        }


                        // Operational Transformation (add, delete)

                        const {char, line, col } = message.data;
                        const extractedLine = room.content.split('\n');

                        switch (message.data.operation) {
                            case 'add':
                                if (line < extractedLine.length) {
                                    const targetLine = extractedLine[line];
                                    if (col <= targetLine.length) {
                                        extractedLine[line] = targetLine.slice(0, col) + char + targetLine.slice(col);
                                        room.content = extractedLine.join('\n');
                                    } else {
                                        ws.send(JSON.stringify({
                                            type: 'deny edit-content',
                                            data: 'Invalid column position'
                                        }, null, 4));
                                        return;
                                    }
                                } else {
                                    ws.send(JSON.stringify({
                                        type: 'deny edit-content',
                                        data: 'Invalid line position'
                                    }, null, 4));
                                    return;
                                }
                                break
                                    
                            case 'delete': 
                                if (line < extractedLine.length) {
                                    const targetLine = extractedLine[line];
                                    if (col > 0) {
                                        extractedLine[line] = targetLine.slice(0, col - 1) + targetLine.slice(col);
                                    } else if (line > 0) {
                                        const previousLine = extractedLine[line - 1];
                                        extractedLine[line - 1] = previousLine + targetLine;
                                        extractedLine.splice(line, 1);
                                    }
                                    room.content = extractedLine.join('\n');
                                } else {
                                    ws.send(JSON.stringify({
                                        type: 'deny edit-content',
                                        data: 'Invalid line position'
                                    }, null, 4));
                                    return;
                                }
                                break

                            case 'update':
                                room.content = message.data.content;
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
                            type: 'accept edit-content',
                            data: {
                                message: 'Content updated successfully',
                                operation:  `${message.data.operation} - '${message.data.content}'`,
                                newContent: room.content
                            }
                        }, null, 4))
                    } else {
                        ws.send(JSON.stringify({
                            type: 'deny edit-content',
                            data: 'Room not found'
                        }))
                    }
                } catch (err) {
                    console.error(err);
                    ws.send(JSON.stringify({
                        type: 'deny edit-content',
                        data: 'Failed to update content. Please try again'
                    },null,4))
                }
            break
                
        }
    });

    const updateContent = Room.watch();

    updateContent.on('change', async (change) => {
        switch (change.operationType) {
            case 'update':
                const updatedFields = change.updateDescription.updatedFields;
                if (updatedFields.content != null) {
                    const docId = change.documentKey._id;

                    const room = await Room.findById(docId);
                    
                    const newContent = updatedFields.content;

                    // big problem uh oh
                    wss.clients.forEach(client => {
                        
                        // if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'room content sync',
                                roomId: room.roomId,
                                content: newContent
                            }));
                        // }
                    });
                }
                break;
        }
    });
})