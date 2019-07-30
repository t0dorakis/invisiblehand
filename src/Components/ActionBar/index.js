import React, { useState, useContext } from 'react'
import { Store } from '../../Store';
import { Link, withRouter } from "react-router-dom";
import { Burger } from "./Burger";
import './ActionBar.scss'


// FUNCTIONAL COMPONENT
const ActionBar = (props) => {
  const { state, dispatch } = useContext(Store);

    const mobileMenuOpen = state.mobileMenuOpen
    const checkIfHome = props.location.pathname === '/'
    const menuList = props.links.map((link) => {
        return <li className="action-bar--menu-list--item" key={link.name}><Link to={`/${link.url}`}>{link.name}</Link></li>;
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
              <Link to="/">
                <Burger isActive={true}></Burger>
              </Link>
                {
                  mobileMenuOpen &&
                  <ul className="action-bar--mobile-menu mobile-extra-margin">
                    {menuList}
                  </ul>
                }
              </div>
            )}
          { checkIfHome &&
            <ul className="action-bar--menu-list">
              {menuList}
            </ul>
          }
            <div className="hand-shake">
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