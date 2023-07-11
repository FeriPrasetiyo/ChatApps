import '../styling/all.css'
import React, { Fragment, useState, useEffect } from "react"
import { IsLoggedIn } from "../utils/api"
import ContactList from './ContactList';
import socket from '../socket';
import ChatBody from '../components/ChatBody';
import { useDispatch, useSelector } from 'react-redux';
import { addChat, addMessage, loadChat, receiverReadNotice, removeChat, removeMessage, resendChat, selectedReadNotice } from '../actions/chats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { loadContact } from '../actions/contact';

export default function FormChat() {
    const selected = useSelector((state) => state.chats.selectedChat)
    const dispatch = useDispatch()

    const [chat, setChat] = useState(false)
    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        dispatch(loadChat())
        socket.on('connect', () => {
            socket.emit('join room', JSON.parse(localStorage.getItem('user'))?.username)
            setIsConnected(true);
        });

        socket.on('receive message', (data) => {
            dispatch(addMessage({ _id: data._id, message: data.message, date: data.date, sender: data.sender, receiver: data.receiver, readstatus: data.readstatus }, name))
        })

        socket.on('receive selected read notice', (id) => {
            dispatch(selectedReadNotice(id))
        })

        socket.on('receive receiver read notice', (id) => {
            dispatch(receiverReadNotice(id))
        })

        socket.on('receive new user', (data) => {
            dispatch(loadContact({ username: data.username, _id: data._id, unreadCount: data.unreadCount }))
        })

        socket.on('delete message', (id) => {
            dispatch(removeMessage(id))
        })

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        console.log(isConnected);

        return () => {
            socket.off('connect');
            socket.off('receive message');
            socket.off('delete message');
            socket.off('receive notification')
            socket.off('disconnect');

        };
    }, [dispatch, name, isConnected]);

    const handleFormChat = (target) => {
        setChat(true)
        setName(target)
    }

    const submitChat = (e) => {
        e.preventDefault()
        dispatch(addChat(message, name))
        setMessage('')
    }

    const resendMessage = (_id, message, name) => {
        dispatch(resendChat(_id, message, name))
        setMessage('')
    }

    return (
        <Fragment>
            <IsLoggedIn />
            <div className="container">
                <div className="row row-broken">
                    <ContactList formChat={handleFormChat} />
                    {
                        chat ?
                            <div className="col-sm-9 col-xs-12" >
                                <div className="col-inside-lg">
                                    <div className='card'>
                                        <div id='card-header' className='card-header text-center'>
                                            <h4>{name}</h4>
                                        </div>

                                        <form className='form-control' onSubmit={submitChat}>
                                            <div id='card-body-chat' className='card-body'>
                                                {
                                                    selected.map((item) => {
                                                        return (
                                                            <ChatBody key={item._id} chat={item.message} id={item.sender} receiver={item.receiver} sent={item.sent} date={item.date} readstatus={item.readstatus} delete={() => dispatch(removeChat(item._id, name))} resend={() => resendMessage(item._id, item.message, name)} />
                                                        )

                                                    })
                                                }
                                            </div>
                                            <div className='card-footer'>
                                                <div className="row">
                                                    <div className="col">
                                                        <input type='text' autoFocus={true} style={{ display: 'flex', borderWidth: 1, borderRadius: '100px', width: '180%', height: '100%', paddingLeft: '3%', borderColor: 'black' }} placeholder='Write a message...' id='inputchat' name='inputchat' autoComplete='off' value={message} onChange={(e) => setMessage(e.target.value)} />
                                                    </div>
                                                    <div className="col">
                                                        <button type='submit' style={{ display: 'flex', marginLeft: '80%', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 20, height: '35px', width: '35px', backgroundColor: '#0c8bee', color: 'white', borderColor: 'white' }}><FontAwesomeIcon icon={faPaperPlane} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="col-sm-9 col-xs-12" >
                                <div className="col-inside-lg">
                                    <div className='card'>
                                        <div id='card-header' className='card-header text-center'>
                                            <h2>Reciever Name</h2>
                                        </div>
                                        <div id='card-begin' className='card-body'>
                                            <h4 style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'center', flex: 1, marginTop: '40%' }}>Select a chat to start messaging</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div >
        </Fragment >
    )

}