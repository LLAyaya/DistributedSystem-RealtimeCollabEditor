import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";
import Room from '../components/Room';
import Editor from '../components/Editor';
import Member from '../components/Member';
import User from '../components/User';
import Popup from '../components/Popup';
import toast from 'react-hot-toast';

const EditorPage = ({clientControllerRef}) => {
    const [lang, setLang] = useState('');
    const [theme, setTheme] = useState('material')
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


    const changeTheme = (e) => {
        setTheme(e.target.value);
    };

    const changeLanguage = (e) => {
        setLang(e.target.value);
    };
    
    const openRoom = (roomDetail) => {
        setSelectedRoomDetail(roomDetail);
        setIsRoomSelected(true);

    };

    clientControllerRef.current.onMessageType('room content sync', (data) => {
        if (data.content !== null) {
            onRoomContentSync(data.roomId, data.content);
        }
    });

    clientControllerRef.current.onMessageType('accept create room', (data) => {
        roomsDetail.current.push(data.roomDetail)
    });

    
    clientControllerRef.current.onMessageType('accept join-room', (data) => {
        const newRoomDetail = data.data.roomInfo;
        
        roomsDetail.current = roomsDetail.current.map(room => 
            room.roomId === newRoomDetail.roomId ? newRoomDetail : room
        );
        
        if (!roomsDetail.current.find(room => room.roomId === newRoomDetail.roomId)) {
            roomsDetail.current.push(newRoomDetail);
        }
        setSelectedRoomDetail(newRoomDetail);
        setIsRoomSelected(true);
    });

    const onRoomContentSync = (roomId, content) => {
        roomsDetail.current.forEach((roomDetail) => {
            if (roomDetail.roomId === roomId) {
                roomDetail.content = content;
            }
            if (selectedRoomDetail !== null) {
                if (selectedRoomDetail.roomId === roomId) {
                    setSelectedRoomContent(content);
                }
            }
        });
    };

    const createRoom = (desiredRoomIdString) => {
        const desiredRoomId = Number(desiredRoomIdString)
        const roomId = (desiredRoomIdString !== '' && !isNaN(desiredRoomId)) ? desiredRoomId : Math.floor(Math.random() * 1000000);
        const newRoomDetail = {
            roomId: roomId,
            roomName: `Room ${roomId}`, 
            content: '', 
            roomMembers: [ {name: userName, cursorLine: 0, cursorChar: 0} ] 
        };
    
        // Update the roomsDetail array
        roomsDetail.current = [...roomsDetail.current, newRoomDetail];
        setSelectedRoomDetail(newRoomDetail); 
        setIsRoomSelected(true); 
    
        clientControllerRef.current.createRoom(roomId, userName);
    };

    const joinRoom = async (roomId) => {
        clientControllerRef.current.joinRoom(roomId, userName);
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
                    <Popup trigger={buttonPopup} setTrigger={setButtonPopup} 
                    onCreateRoom={createRoom} onJoinRoom={joinRoom}>
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
                    lang={lang}
                    theme={theme}
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
                        Language
                        <select onChange={changeLanguage} value={lang}>
                            <option value="apl">APL</option>
                            <option value="asciiarmor">AsciiArmor</option>
                            <option value="asn.1">ASN.1</option>
                            <option value="asterisk">Asterisk</option>
                            <option value="brainfuck">Brainfuck</option>
                            <option value="clike">C / C++ / C# / Java</option>
                            <option value="clojure">Clojure</option>
                            <option value="cmake">CMake</option>
                            <option value="cobol">COBOL</option>
                            <option value="coffeescript">CoffeeScript</option>
                            <option value="commonlisp">Common Lisp</option>
                            <option value="crystal">Crystal</option>
                            <option value="css">CSS</option>
                            <option value="cypher">Cypher</option>
                            <option value="d">D</option>
                            <option value="dart">Dart</option>
                            <option value="django">Django</option>
                            <option value="dockerfile">Dockerfile</option>
                            <option value="dtd">DTD</option>
                            <option value="dylan">Dylan</option>
                            <option value="ebnf">Extended Backus–Naur form</option>
                            <option value="ecl">ECL</option>
                            <option value="eiffel">Eiffel</option>
                            <option value="erlang">Erlang</option>
                            <option value="factor">Factor</option>
                            <option value="fcl">FCL</option>
                            <option value="forth">Forth</option>
                            <option value="fortran">Fortran</option>
                            <option value="gas">GAS</option>
                            <option value="gfm">GitHub Flavored Markdown</option>
                            <option value="gherkin">Gherkin</option>
                            <option value="go">Go</option>
                            <option value="groovy">Groovy</option>
                            <option value="haml">HAML</option>
                            <option value="handlebars">Handlebars</option>
                            <option value="haskell">Haskell</option>
                            <option value="haskell-literate">Haskell-literate</option>
                            <option value="haxe">Haxe</option>
                            <option value="htmlembedded">HTML embedded</option>
                            <option value="htmlmixed">HTML-mixed</option>
                            <option value="http">HTTP</option>
                            <option value="idl">IDL</option>
                            <option value="javascript">JavaScript</option>
                            <option value="jinja2">Jinja2</option>
                            <option value="jsx">JSX</option>
                            <option value="julia">Julia</option>
                            <option value="livescript">LiveScript</option>
                            <option value="lua">Lua</option>
                            <option value="mathematica">Mathematica</option>
                            <option value="markdown">Markdown</option>
                            <option value="mbox">mbox</option>
                            <option value="meta">Meta</option>
                            <option value="mirc">mIRC</option>
                            <option value="mllike">ML-like</option>
                            <option value="modelica">Modelica</option>
                            <option value="mscgen">MscGen</option>
                            <option value="mumps">MUMPS</option>
                            <option value="nginx">Nginx</option>
                            <option value="nsis">NSIS</option>
                            <option value="ntriples">NTriples</option>
                            <option value="octave">Octave</option>
                            <option value="oz">Oz</option>
                            <option value="pascal">Pascal</option>
                            <option value="pegjs">PEG.js</option>
                            <option value="perl">Perl</option>
                            <option value="php">PHP</option>
                            <option value="pig">Pig</option>
                            <option value="powershell">PowerShell</option>
                            <option value="properties">Properties</option>
                            <option value="protobuf">Protocol Buffers</option>
                            <option value="pug">Pug</option>
                            <option value="puppet">Puppet</option>
                            <option value="python">Python</option>
                            <option value="q">Q</option>
                            <option value="r">R</option>
                            <option value="rpm">RPM</option>
                            <option value="rst">reStructuredText</option>
                            <option value="ruby">Ruby</option>
                            <option value="rust">Rust</option>
                            <option value="ruby">Ruby</option>
                            <option value="sas">SAS</option>
                            <option value="sass">Sass</option>
                            <option value="scheme">Scheme</option>
                            <option value="shell">Shell</option>
                            <option value="sieve">Sieve</option>
                            <option value="slim">Slim</option>
                            <option value="smalltalk">Smalltalk</option>
                            <option value="smarty">Smarty</option>
                            <option value="solr">Solr</option>
                            <option value="sql">SQL</option>
                            <option value="sparql">SPARQL</option>
                            <option value="spreadsheet">Spreadsheet</option>
                            <option value="stex">sTeX, LaTeX</option>
                            <option value="stylus">Stylus</option>
                            <option value="swift">Swift</option>
                            <option value="tcl">Tcl</option>
                            <option value="textile">Textile</option>
                            <option value="tiddlywiki">TiddlyWiki</option>
                            <option value="tiki">Tiki wiki</option>
                            <option value="toml">TOML</option>
                            <option value="tornado">Tornado</option>
                            <option value="troff">troff</option>
                            <option value="ttcn">TTCN</option>
                            <option value="turtle">Turtle</option>
                            <option value="twig">Twig</option>
                            <option value="vb">VB.NET</option>
                            <option value="vbscript">VBScript</option>
                            <option value="velocity">Velocity</option>
                            <option value="verilog">Verilog</option>
                            <option value="vhdl">VHDL</option>
                            <option value="vue">Vue.js app</option>
                            <option value="webidl">Web IDL</option>
                            <option value="xml">XML</option>
                            <option value="xquery">XQuery</option>
                            <option value="yacas">YACAS</option>
                            <option value="yaml">YAML</option>
                            <option value="z80">Z80</option>
                        </select>
                    </label>

                    <label className="themeSelector">
                        Theme
                        <select onChange={changeTheme} value={theme}>
                            <option value="default">default</option>
                            <option value="3024-day">3024-day</option>
                            <option value="3024-night">3024-night</option>
                            <option value="abbott">abbott</option>
                            <option value="abcdef">abcdef</option>
                            <option value="ambiance-mobile">ambiance-mobile</option>
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
                            <option value="ssms">ssms</option>
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
                        {selectedRoomDetail.roomMembers.map((member) => (
                            <Member
                                key={member.name}
                                memberName = {member.name}
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