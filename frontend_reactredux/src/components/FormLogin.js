import React, { useState } from 'react'
import { request } from '../utils/api';
import { useNavigate } from "react-router-dom";
import socket from '../socket';

export default function FormLogin() {
    const [userName, setUserName] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const { data } = await request.post('users/auth', { username: userName })
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.data))
                request.interceptors.request.use(function (config) {
                    config.headers.Authorization = `Bearer ${data.data.token}`

                    return config
                })
                navigate('/chat', { replace: true })
                socket.emit('send new user', { username: data.data.username, _id: data.data.id, unreadCount: 0 })
                socket.emit('join room', data.data.username)
                setUserName('')
            } else {
                alert('fail login')
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-6">
                        <div className="card px-5 py-5">
                            <div className='card-body'>
                                <div className="form-data">
                                    <div className="forms-inputs mb-4">
                                        <h5 style={{ textAlign: 'center', color: '#23a927 ', fontWeight: 'bold' }}>LOGIN</h5>
                                        <hr />
                                        <input style={{ marginTop: 20 }} type="text" className='form-control' id='username' name='username' placeholder='Username' value={userName} onChange={(e) => setUserName(e.target.value)} />
                                    </div>
                                    <button type='submit' className="btn btn-info w-50" style={{ marginLeft: '25%', color: 'white', fontWeight: 'bold' }} >LOG IN</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div >
    )
}