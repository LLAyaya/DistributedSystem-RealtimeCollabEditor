import React, { useEffect,  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

const Home = ({clientControllerRef}) => {
    const navigate = useNavigate()

    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')

    useEffect(() => {
        clientControllerRef.current.onMessageType('accept sign-up', (data) => {
            console.log('throw toast notification pls: ', data.data)
            toast.success('Successfully sign-up')
        })
    
        clientControllerRef.current.onMessageType('deny sign-up', (data) => {
            toast.error('Sign-up failed')
            console.log('throw toast notification pls: ', data.data)
            
        }) 

        clientControllerRef.current.onMessageType('accept log-in', (data) => {
            toast.success('Successfully log-in')
            setTimeout(() => {
                console.log('throw toast notification pls: ', data.data)
                navigate('/editor', {
                    state: {
                        userName: data.data.userName,
                        roomsDetail: data.data.roomDetail
                    }
                });
            }, 1000)
        })

        clientControllerRef.current.onMessageType('deny log-in', (data) => {
            toast.error('Log-in failed')
            console.log('throw toast notification pls: ', data.data)
        })

        clientControllerRef.current.onMessageType('accept create-room', (data) =>{
            toast.success('Created room successfully!')
            console.log('throw toast notification pls: ', data.data)
        })

        clientControllerRef.current.onMessageType('deny create-room', (data) =>{
            toast.error('Create-room falied')
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
            <Toaster
                position='top-center'
                reverseOrder = {false} 
            />
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
                        type='password'
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