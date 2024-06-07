import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";
import Room from '../components/Room';
import Editor from '../components/Editor';
import Member from '../components/Member';
import User from '../components/User';
import Popup from '../components/Popup';
import toast from 'react-hot-toast';

const EditorPage = ({clientControllerRef}) => {
    const [lang, setLang] = useState('javascript');
    const [them, setThem] = useState('default')
    const [userName, setUserName] = useState('');
    const roomsDetail = useRef([]);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState();
    const [selectedRoomContent, setSelectedRoomContent] = useState('');
    const [isRoomSelected, setIsRoomSelected] = useState(false); 
    const [buttonPopup, setButtonPopup] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setUserName(location.state?.userName);
        roomsDetail.current = location.state?.roomsDetail;
    }, [location.state.userName, location.state.roomsDetail]);


    const changeTheme = (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme);
        setThem(newTheme);
    };
    
    const openRoom = (roomDetail) => {
        console.log('Room'+roomDetail)
        setSelectedRoomDetail(roomDetail);
        console.log(roomDetail)
        setIsRoomSelected(!!roomDetail);

    };

    clientControllerRef.current.onMessageType('room content sync', (data) => {
        if (data.content !== null) {
            onRoomContentSync(data.roomId, data.content);
        }
    });

    clientControllerRef.current.onMessageType('accept create room', (data) => {
        roomsDetail.current.push(data.roomDetail)
    });

    const onRoomContentSync = (roomId, content) => {
        roomsDetail.current.forEach((roomDetail) => {
            if (roomDetail.roomId === roomId) {
                roomDetail.content = content;
            }
            if (selectedRoomDetail.roomId === roomId) {
                setSelectedRoomContent(content);
            }
        });
    };

    const createRoom = (desiredRoomIdString) => {
        const desiredRoomId = Number(desiredRoomIdString)
        const roomId = (desiredRoomIdString !== '' && !isNaN(desiredRoomId)) ? desiredRoomId : Math.floor(Math.random() * 1000000);
        const newRoomDetail = {
            roomId: roomId,
            roomName: `Room ${roomId}`, // Assuming you want to name the room like this
            content: '', // Initial content can be empty or some default value
            roomMembers: [userName] // Initially, the creator is the only member
        };
    
        // Update the roomsDetail array
        roomsDetail.current = [...roomsDetail.current, newRoomDetail];
        setSelectedRoomDetail(newRoomDetail); // Optionally select the new room
        setIsRoomSelected(true); // Set room as selected
    
        clientControllerRef.current.createRoom(roomId, userName);
    };

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(selectedRoomDetail.roomId);
            toast.success('Room ID has been copied to clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    return (
        <div className={`mainWrap ${isRoomSelected ? 'selected' : 'default'}`}>
            <div className="aside">
                <div className="asideInner">
                    <User userName={userName}></User>

                    <div className='divider1'></div>

                    <h3>Rooms</h3>
                    
                    <div className="roomsList">
                        {roomsDetail.current.map((roomDetail) => (
                            <Room
                                key={roomDetail.roomId}
                                roomDetail={roomDetail}
                                openRoom={openRoom}
                            />
                        ))}
                        <div className='room'></div>
                    </div>

                    <div className='divider2'></div>

                    <button className='styleBtn' onClick={()=> setButtonPopup(true)}>New room</button>
                    <Popup trigger={buttonPopup} setTrigger={setButtonPopup} onCreateRoom={createRoom}>
                    </Popup>

                </div>
                
            </div>

            <div className="editorWrap">
                <Editor
                    clientControllerRef={clientControllerRef}
                    roomsDetail={roomsDetail}
                    selectedRoomDetail={selectedRoomDetail}
                    selectedRoomContent={selectedRoomContent}
                    userName={userName}
                />
            </div>

            {(isRoomSelected) && (
                <div className="membersWrap">
                    <div 
                        style={{
                            margin: '10px 0' 
                        }}
                    ></div>

                    <label className="languageSelector">
                        Language:
                        <select value={lang} onChange={(e) => {setLang(e.target.value);}}>
                            <option value="clike">C / C++ / C# / Java</option>
                            <option value="css">CSS</option>
                            <option value="dart">Dart</option>
                            <option value="django">Django</option>
                            <option value="dockerfile">Dockerfile</option>
                            <option value="go">Go</option>
                            <option value="htmlmixed">HTML-mixed</option>
                            <option value="javascript">JavaScript</option>
                            <option value="jsx">JSX</option>
                            <option value="markdown">Markdown</option>
                            <option value="php">PHP</option>
                            <option value="python">Python</option>
                            <option value="r">R</option>
                            <option value="rust">Rust</option>
                            <option value="ruby">Ruby</option>
                            <option value="sass">Sass</option>
                            <option value="shell">Shell</option>
                            <option value="sql">SQL</option>
                            <option value="swift">Swift</option>
                            <option value="xml">XML</option>
                            <option value="yaml">yaml</option>
                        </select>
                    </label>

                    <label className="themeSelector">
                        Theme:
                        <select value={them} onChange={(e) => changeTheme(e.target.value)} className="seLang">
                            <option value="default">default</option>
                            <option value="3024-day">3024-day</option>
                            <option value="3024-night">3024-night</option>
                            <option value="abbott">abbott</option>
                            <option value="abcdef">abcdef</option>
                            <option value="ambiance">ambiance</option>
                            <option value="ayu-dark">ayu-dark</option>
                            <option value="ayu-mirage">ayu-mirage</option>
                            <option value="base16-dark">base16-dark</option>
                            <option value="base16-light">base16-light</option>
                            <option value="bespin">bespin</option>
                            <option value="blackboard">blackboard</option>
                            <option value="cobalt">cobalt</option>
                            <option value="colorforth">colorforth</option>
                            <option value="darcula">darcula</option>
                            <option value="duotone-dark">duotone-dark</option>
                            <option value="duotone-light">duotone-light</option>
                            <option value="eclipse">eclipse</option>
                            <option value="elegant">elegant</option>
                            <option value="erlang-dark">erlang-dark</option>
                            <option value="gruvbox-dark">gruvbox-dark</option>
                            <option value="hopscotch">hopscotch</option>
                            <option value="icecoder">icecoder</option>
                            <option value="idea">idea</option>
                            <option value="isotope">isotope</option>
                            <option value="juejin">juejin</option>
                            <option value="lesser-dark">lesser-dark</option>
                            <option value="liquibyte">liquibyte</option>
                            <option value="lucario">lucario</option>
                            <option value="material">material</option>
                            <option value="material-darker">material-darker</option>
                            <option value="material-palenight">material-palenight</option>
                            <option value="material-ocean">material-ocean</option>
                            <option value="mbo">mbo</option>
                            <option value="mdn-like">mdn-like</option>
                            <option value="midnight">midnight</option>
                            <option value="monokai">monokai</option>
                            <option value="moxer">moxer</option>
                            <option value="neat">neat</option>
                            <option value="neo">neo</option>
                            <option value="night">night</option>
                            <option value="nord">nord</option>
                            <option value="oceanic-next">oceanic-next</option>
                            <option value="panda-syntax">panda-syntax</option>
                            <option value="paraiso-dark">paraiso-dark</option>
                            <option value="paraiso-light">paraiso-light</option>
                            <option value="pastel-on-dark">pastel-on-dark</option>
                            <option value="railscasts">railscasts</option>
                            <option value="rubyblue">rubyblue</option>
                            <option value="seti">seti</option>
                            <option value="shadowfox">shadowfox</option>
                            <option value="solarized">solarized</option>
                            <option value="the-matrix">the-matrix</option>
                            <option value="tomorrow-night-bright">tomorrow-night-bright</option>
                            <option value="tomorrow-night-eighties">tomorrow-night-eighties</option>
                            <option value="ttcn">ttcn</option>
                            <option value="twilight">twilight</option>
                            <option value="vibrant-ink">vibrant-ink</option>
                            <option value="xq-dark">xq-dark</option>
                            <option value="xq-light">xq-light</option>
                            <option value="yeti">yeti</option>
                            <option value="yonce">yonce</option>
                            <option value="zenburn">zenburn</option>
                        </select>
                    </label>

                    <div className='divider1'></div>

                    <h3>Members</h3>

                    <div className="roomsList">
                        {console.log('yo', selectedRoomDetail.roomMembers)}
                        {selectedRoomDetail.roomMembers.map((memberName) => (
                            <Member
                                key={memberName}
                                memberName = {memberName}
                            />
                        ))}
                    </div>
                    
                    <div className='divider2'></div>

                    <button className='styleBtn'onClick={() => copyRoomId()}                     
                    >
                        Copy ID
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditorPage;