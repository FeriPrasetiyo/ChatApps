import React, { Fragment } from "react";
export default function ContactItem(props) {
    return (
        <Fragment>
            <div style={{cursor: 'pointer'}} className={props.selected === props.contact ? 'p-3 mb-2 bg-primary text-white' : undefined}>
                <div className={props.selected === props.contact ? "px-2 text-white" : undefined} onClick={props.set}>
                    <div className="row">
                        <div className="col">
                            <span>{props.contact}</span>
                        </div>
                        <div className="col">
                            {props.count > 0 &&
                                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '5px', height: '5px', color: 'white', padding: '12px', backgroundColor: 'red', borderRadius: '20px', marginLeft: '60%' }}>{props.count}</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}