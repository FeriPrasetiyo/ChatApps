import '../styling/all.css'
import React, { useState, useCallback } from "react"
import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faRotateRight, faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap'

export default function ChatBody(props) {
    const [show, setShow] = useState(false)
    const [modal, setModal] = useState(false)
    const _id = JSON.parse(localStorage.getItem('user'))?.id
    const sender = JSON.parse(localStorage.getItem('user'))?.sender
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])

    const handleDeleteMessage = () => {
        props.delete()
        setModal(false)
    }


    if (props.sent === true && props.id === _id) {
        return (
            <div id="chat-body" ref={setRef} className="d-flex justify-content-end mb-4" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                {
                    show &&
                    <button type='button' className='btn btn-light' onClick={() => setModal(true)}><FontAwesomeIcon icon={faTrashCan} /></button>
                }

                <Modal style={{ paddingTop: '350px' }} show={modal} onHide={() => setModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure delete this message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                        {props.chat}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModal(false)}>
                            No
                        </Button>
                        <Button variant="primary" onClick={handleDeleteMessage}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <span style={{ marginLeft: '10px' }}><ReactMarkdown children={props.chat} />
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <div style={{ marginLeft: '10px' }}>
                            {props.readstatus === false ?
                                <FontAwesomeIcon icon={faCheck} color='white' />
                                :
                                <FontAwesomeIcon icon={faCheckDouble} color='white' />
                            }
                        </div>
                        {props.date}
                    </div>
                </span>
            </div>
        )

    } else if (props.sent === false && sender === _id) {
        return (
            <div id="chat-body" ref={setRef} className="d-flex justify-content-end mb-4">
                <button type='button' className='btn btn-light' onClick={props.resend}><FontAwesomeIcon icon={faRotateRight} /></button>
                <span style={{ marginLeft: '10px' }}><ReactMarkdown children={props.chat} />
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>{props.date}</div>
                </span>
            </div>
        )
    } else {
        return (
            sender === props.receiver ?
                <div id="chat-bodyreciver" ref={setRef} className="d-flex justify-content-end mb-4">
                    <span><ReactMarkdown children={props.chat} />
                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>{props.date}</div>
                    </span>
                </div>
                :
                null
        )
    }
}

