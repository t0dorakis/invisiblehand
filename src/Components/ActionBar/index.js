import React, { useState } from 'react'
import './ActionBar.scss'
import { Link, withRouter } from "react-router-dom";


// FUNCTIONAL COMPONENT
const ActionBar = (props) => {
    // const [time, setTime] = useState(50);
    // const timer = setInterval(() => setTime(time - 1), 1);
    //
    // if (time < 0) {
    //     timer.clearInterval()
    // }


    console.log(props)
    const checkIfHome = props.location.pathname === '/'
    const menuList = props.links.map((link) => {
        return <li className="action-bar--menu-list--item" key={link.name}><Link to={`/${link.name}`}>{link.name}</Link></li>;
    })

    return (
        <div className="action-bar">
            {/*{time}*/}
            {!checkIfHome ? (
                <div className="back-button">
                    <Link to="/">
                        BACK
                    </Link>
                </div>
            ) : ( <div className="mobile-menu">
                MENU
            </div>
            &&
                <ul className="action-bar--menu-list">
                    {menuList}
                </ul>)
            }
            <div className="hand-shake">
                {/*<div className="vertical-text">*/}
                    {/*handshake*/}
                {/*</div>*/}
                <div className="circle">
                    <a href="mailto:handshake@invisiblehand.agency">
                        <div className="logo" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ActionBar)