import React from 'react'
import './ActionBar.scss'
import { Link, withRouter } from "react-router-dom";


// FUNCTIONAL COMPONENT
const ActionBar = (props) => {
    console.log(props)
    const checkIfHome = props.location.pathname === '/'
    const menuList = props.links.map((link) => {
        return <li className="action-bar--menu-list--item" key={link.name}><Link to={`/${link.name}`}>{link.name}</Link></li>;
    })

    return (
        <div className="action-bar">
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
                <div className="vertical-text">
                    handshake
                </div>
                <a href="mailto:mail@invisiblehandagency.com">
                    <div className="logo" />
                </a>
            </div>
        </div>
    )
}

export default withRouter(ActionBar)