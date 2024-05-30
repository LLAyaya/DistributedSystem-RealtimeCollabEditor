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


createRoom();

joinRoom(1,'66558e0ed4bc4c584aa9ea5f')

// const message = {
//     type: 'log-in',
//     data: {
//         userName: 'TuilaBIBI',
//         userPassword: 'weiwaiweiwai',
//     }
// }
// rws.send(JSON.stringify(message))