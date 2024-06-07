import React from 'react';

function Popup (props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className='close-btn' onClick={()=> props.setTrigger(false)}>X</button>
                {props.children}
                <div className='inputGroup'>
                    <input
                        type='text'
                        className='inputBox'
                        placeholder='RoomId'
                        // onChange={(e) => setUserName(e.target.value)}
                        // value={rommId}
                        // onKeyUp={handleInputEnter}
                    />
                </div>
                
                <div className='verticalDiv'>
                    <button className="btn joinBtn" onClick={props.onCreateRoom}>
                        Create
                    </button>
                    <button className="btn joinBtn" onClick={props.onCreateRoom}>
                        Join
                    </button>
                </div>
            </div>
        </div>
    ): "";
};

export default Popup;


