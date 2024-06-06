import React from 'react';
import Avatar from 'react-avatar';

const Member = ({memberName}) => {
    return (
        <div className="room">
            <Avatar name={memberName.toString()} size={60} round={true}>
                {memberName.toString()}
            </Avatar>        
            <span className="roomId">{memberName.toString()}</span>
        </div>
        
    );
};

export default Member;