import React from 'react';
import Avatar from 'react-avatar';

const User = ({userName}) => {
    return (
        <div className="userSection">
            <Avatar name={userName.toString()} size={36} round={true}>
                {userName.toString()}
            </Avatar>        
            <h4 className="userSectionUserName">{userName.toString()}</h4>
        </div>
        
    );
};

export default User;