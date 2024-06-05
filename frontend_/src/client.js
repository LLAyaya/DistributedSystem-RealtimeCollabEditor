import ReconnectingWebSocket from 'reconnecting-websocket';

export const initClient = () => {
    const options = {
        connectionTimeout: 10000,
        maxEntries: 10,
    }

    const rws = new ReconnectingWebSocket('http://localhost:5000', [], options)
    
    rws.addEventListener('open', () => {
        console.log('Connected to the Server')
    })    

    // Setup rws wrapper
    const rwsController = {
        rws: rws,

        signup: function(userName, userPassword) {
            const message = {
                type: 'sign-up',
                data: {
                    userName: userName,
                    userPassword: userPassword,
                }
            }
            rws.send(JSON.stringify(message))
        },

        login: function(userName, userPassword) {
            const message = {
                type: 'log-in',
                data: {
                    userName: userName,
                    userPassword: userPassword,
                }
            }
            rws.send(JSON.stringify(message))
        },

        createRoom: function(roomId) {
            const message = {
                type: 'create-room',
                data: {
                    roomId: roomId
                }
            }
            rws.send(JSON.stringify(message))
        },

        joinRoom: function(roomId, userName) {
            const message = {
                type: 'join-room',
                data: {
                    roomId: roomId,
                    userName: userName
                }
            }
            rws.send(JSON.stringify(message))
        },

        editContent: function(roomId, userName, operation, content) {
            const message = {
                type: 'edit-content',
                data: {
                    roomId: roomId,
                    userName: userName,
                    operation: operation,
                    content: content        
                }
            }
            rws.send(JSON.stringify(message))
        },

        _messageCallbacks: {},
        onMessageType: function(messageType, callback) {
            rwsController._messageCallbacks[messageType] = callback
        }
    }

    rws.onmessage = (message) => {
        const data = JSON.parse(message.data)

        const callback = rwsController._messageCallbacks[data.type]
        if (typeof callback === 'function') {
            callback(data)
        }
        else {
            console.log('Uncaptured message: ', data)
        }
    }

    return rwsController
}

// const rwsController = await initClient()

// Example usage

// rwsController.signup('MynameisTraSua', 'TraSuaMuonNam')

// rwsController.login('MynameisTraSua', 'TraSuaMuonNam')

// rwsController.createRoom()

// rwsController.createRoom(69420)

// rwsController.joinRoom(500857, 'Quan')

// rwsController.editContent(500857, 'Quan', 'add', ' a')

// setTimeout(() => {
//     rwsController.editContent(500857, 'Quan', 'add', ' b')
// }, 1000)

// setTimeout(() => {
//     rwsController.editContent(500857, 'Quan', 'add', ' c')
// }, 2000)

// setTimeout(() => {
//     rwsController.editContent(500857, 'Quan', 'add', ' d')
// }, 3000)


// await rwsController.editContent(500857, 'Quan', 'add', ' 3')

// rwsController.editContent(500857, 'Quan', 'delete')
