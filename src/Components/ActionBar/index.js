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
              <Link to="/">
                <div className="button-box">
                    <div className="circle">
                        BACK
                    </div>
                  </div>
              </Link>
            ) : (
              <div className="hide-on-desktop">
                <div className="button-box">
                  <div className="circle">
                    <Burger isActive={true}></Burger>
                    <div className="animation-bar" style={mobileMenuOpen ? { height: 275 + "px" } : { height: 60+ "px"}}></div>
                  </div>
                </div>
                {
                  mobileMenuOpen &&
                  <div className="mobile-menu">
                    <ul className="action-bar--mobile-menu mobile-extra-margin">
                      {menuList}
                    </ul>
                  </div>
                }
              </div>
            )}
          { checkIfHome &&
            <ul className="action-bar--menu-list hide-on-mobile">
              {menuList}
            </ul>
          }
            <div className="button-box">
                <div className="circle scale-on-hover">
                    <a href="mailto:handshake@invisiblehand.agency">
                        {/*<div className="logo" />*/}
                        Handshake
                    </a>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ActionBar)