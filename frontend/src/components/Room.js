import React from 'react';
import Avatar from 'react-avatar';

const Room = ({roomId, openRoom}) => {
    return (
        <div className="room">
            <button onClick={() => {openRoom(roomId)}} className='room-avatar'>
                <Avatar name={roomId.toString()} size={60} round={true}>
                    {roomId.toString()}
                </Avatar>        
            </button>
            <span className="roomId">{roomId}</span>
        </div>
        
    );
};

export default Room;