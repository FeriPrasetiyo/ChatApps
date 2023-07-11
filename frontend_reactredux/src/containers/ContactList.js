import React, { useEffect, useState } from "react"
import ContactItem from "../components/ContactItem"
import { request } from '../utils/api';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loadContact, removeNotification } from "../actions/contact";
import { selectedChat } from "../actions/chats";

export default function ContactList(props) {
    const contacts = useSelector((state) => state.contacts.data)
    const dispatch = useDispatch()
    const [redirect, setRedirect] = useState(false)
    const [contactActive, setContactActive] = useState('')

    useEffect(() => {
        dispatch(loadContact())
    }, [dispatch])

    const LogOut = async () => {
        try {
            await request.get('users/signout')
            localStorage.removeItem('user')
            request.interceptors.request.use(function (config) {
                config.headers.Authorization = null

                return config
            })
            setRedirect(true)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectContact = (target, _id) => {
        setContactActive(target)
        props.formChat(target)
        dispatch(selectedChat({ target, _id }))
        dispatch(removeNotification(_id))
    };

    return (
        <div className="col-sm-3 col-xs-12">
            <div className="col-inside-lg chat">
                <div className="chat-users">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2 style={{ flex: 1 }}>Contacts</h2>
                        </div>
                        <div id='card-body-contact' className='card-body'>
                            {contacts.map((item, index) => (
                                <ContactItem
                                    key={index}
                                    id={item._id}
                                    count={item.unreadCount}
                                    contact={item.username}
                                    selected={contactActive}
                                    set={() => handleSelectContact(item.username, item._id)}
                                />
                            ))}
                        </div>
                        <div className='card-footer'>
                            <button type='button' style={{ display: 'flex', color: 'red', fontWeight: 'bold', borderColor: 'red', borderRadius: '5px', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }} onClick={LogOut} > LOG OUT</button>
                            {
                                redirect && (
                                    <Navigate to='/' replace={true} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

