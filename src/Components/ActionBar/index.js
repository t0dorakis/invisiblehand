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

    const singlePageMenu = () => (
      <div className="single-page-bar">
          <Link to="/">
            <div className="button-box">
              <div className="circle">
                BACK
              </div>
            </div>
          </Link>

        <div className="button-box">
            <div className="circle scale-on-hover">
              <a href="mailto:handshake@invisiblehand.agency">
                <div className="logo"/>
              </a>
            </div>
        </div>
      </div>
    )

    const frontPageMenu = () => (
      <div className="action-bar">
        <div className="button-box">
            <div className="button scale-on-hover">
              <a href="mailto:handshake@invisiblehand.agency">
                Handshake
              </a>
            </div>
        </div>
      </div>
    )

    return checkIfHome ? frontPageMenu() : singlePageMenu()

}

export default withRouter(ActionBar)