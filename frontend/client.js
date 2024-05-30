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

const message = {
    type: 'sign-up',
    data: {
        userName: 'TuilaBIBI',
        userPassword: 'weiwaiweiwai',
        userRoomIds: [],
    }
}
rws.send(JSON.stringify(message))