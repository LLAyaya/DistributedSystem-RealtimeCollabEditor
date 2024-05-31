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
    }

    rwsController.signup = function(userName, userPassword) {
        const message = {
            type: 'sign-up',
            data: {
                userName: userName,
                userPassword: userPassword,
            }
        }
        rws.send(JSON.stringify(message))
    }

    rwsController.login = function(userName, userPassword) {
        const message = {
            type: 'log-in',
            data: {
                userName: userName,
                userPassword: userPassword,
            }
        }
        rws.send(JSON.stringify(message))
    }

    return rwsController
}

const rwsController = await initSocket()

rwsController.signup('MynameisTraSua', 'TraSuaMuonNam')

rwsController.login('MynameisTraSua', 'TraSuaMuonNam')

// function createRoom(roomId) {
//     const message = {
//         type: 'create-room',
//         data: {
//             roomId: roomId 
//         }
//     };
//     rws.send(JSON.stringify(message));
// }

// function joinRoom(roomId, userId) {
//     const message = {
//         type: 'join-room',
//         data: {
//             roomId: roomId,
//             userId: userId
//         }
//     }
//     rws.send(JSON.stringify(message));
// }

// function editContent(roomId, userId, operation, content) {
//     const message = {
//         type: 'edit-content',
//         data: {
//             roomId: roomId,
//             userId: userId,
//             operation: operation,
//             content: content        
//         }
//     };
//     rws.send(JSON.stringify(message));
// }

// createRoom();

// joinRoom(36088,'66558a6732c43e48f5a24888')

// editContent(36088, '66558e0ed4bc4c584aa9ea5f', 'add', ' hoi cham')

// editContent(36088, '66558e0ed4bc4c584aa9ea5f', 'delete')

// const message = {
//     type: 'log-in',
//     data: {
//         userName: 'TuilaBIBI',
//         userPassword: 'weiwaiweiwai',
//     }
// }
// rws.send(JSON.stringify(message))