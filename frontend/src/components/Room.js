import React from 'react';
import Avatar from 'react-avatar';

const Room = ({roomDetail, openRoom}) => {
    return (
        <div className="room">
            <button onClick={() => {openRoom(roomDetail)}} className='room-avatar'>
                <Avatar name={roomDetail.roomId.toString()} size={60} round={true}>
                    {roomDetail.roomId.toString()}
                </Avatar>        
            </button>
            <span className="roomId">{roomDetail.roomId}</span>
        </div>
        
    );
};

export default Room;