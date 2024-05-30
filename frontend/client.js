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

    rws.onmessage = (message) => {
        console.log(message.data)
        switch(message.data.type) {
            case 'accept':
                console.log(message.data.data)
            case 'deny':
                break;
        }
    }

    return rws
}

const rws = await initSocket()

function createRoom(roomId) {
    const message = {
        type: 'create-room',
        data: {
            roomId: roomId 
        }
    };
    rws.send(JSON.stringify(message));
}

function joinRoom(roomId, userId) {
    const message = {
        type: 'join-room',
        data: {
            roomId: roomId,
            userId: userId
        }
    }
    rws.send(JSON.stringify(message));
}

function editContent(roomId, userId, operation, content) {
    const message = {
        type: 'edit-content',
        data: {
            roomId: roomId,
            userId: userId,
            operation: operation,
            content: content        
        }
    };
    rws.send(JSON.stringify(message));
}

// createRoom();

// joinRoom(36088,'66558a6732c43e48f5a24888')

// editContent(36088, '66558e0ed4bc4c584aa9ea5f', 'add', ' hoi cham')

editContent(36088, '66558e0ed4bc4c584aa9ea5f', 'delete')

// const message = {
//     type: 'log-in',
//     data: {
//         userName: 'TuilaBIBI',
//         userPassword: 'weiwaiweiwai',
//     }
// }
// rws.send(JSON.stringify(message))