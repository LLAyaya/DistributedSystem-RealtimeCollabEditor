
import ReconnectingWebSocket from 'reconnecting-websocket';
import WS from 'ws';

export const initSocket = async () => {
    const options = {
        WebSocket: WS,
        connectionTimeout: 10000,
        maxEntries: 10,
    }
    
    const rws = new ReconnectingWebSocket('ws://localhost:5000', [], options)
    
    rws.addEventListener('open', () => {
        console.log('Connected to the Server')
    })

    // To be overridden
    // rws.onmessage = (message) => {
    //     switch(message.data.type) {
    //         case 'accept':
    //             console.log(JSON.parse(message.data).data)
    //             break
    //         case 'deny':
    //             console.log(JSON.parse(message.data).data)
    //             break
    //     }
    // }

    rws.onmessage = (message) => {
        switch(message.data.type) {
            case 'accept':
                break
            case 'deny':
                break
        }
        console.log(JSON.parse(message.data).data)
    }
    // Setup rws wrapper
    const rwsController = {
        rws: rws,
        onmessage: rws.onmessage,
        
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
        }
    }

    return rwsController
}

const rwsController = await initSocket()

// Example usage

// rwsController.signup('MynameisTraSua', 'TraSuaMuonNam')

// rwsController.login('Quan', '1231231')

// rwsController.createRoom()

// rwsController.createRoom(69420)

rwsController.joinRoom(1, 'Thong')

// rwsController.editContent(1, 'Thong', 'add', 'xin chao')

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
