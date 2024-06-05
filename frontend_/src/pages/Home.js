import React, { useEffect,  useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = ({clientControllerRef}) => {
    const navigate = useNavigate()

    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')

    useEffect(() => {
        clientControllerRef.current.onMessageType('accept sign-up', (data) => {
            console.log('throw toast notification pls: ', data.data)
        })
    
        clientControllerRef.current.onMessageType('deny sign-up', (data) => {
            console.log('throw toast notification pls: ', data.data)
        }) 

        clientControllerRef.current.onMessageType('accept log-in', (data) => {
            navigate('/editor', {
                state: {
                    userName: data.data.userName,
                    roomsDetail: data.data.roomDetail
                }
            })
        })

        clientControllerRef.current.onMessageType('deny log-in', (data) => {
            console.log('throw toast notification pls: ', data.data)
        })
    })
    
    const signup = () => {
        clientControllerRef.current.signup(userName, userPassword)
    }
    
    const login = () => {
        clientControllerRef.current.login(userName, userPassword)
    }

    
    return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <h4 className='mainLabel'>Realtime Collaborative Editor</h4>
                <div className='inputGroup'>
                    <input
                        type='text'
                        className='inputBox'
                        placeholder='Username'
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        // onKeyUp={handleInputEnter}
                    />
                    <input
                        type='text'
                        className='inputBox'
                        placeholder='Password'
                        onChange={(e) => setUserPassword(e.target.value)}
                        value={userPassword}
                        // onKeyUp={handleInputEnter}
                    />
                </div>
                <div className='verticalDiv'>
                    <button className="btn joinBtn" onClick={signup}>
                        Sign Up
                    </button>
                    <button className="btn joinBtn" onClick={login}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home