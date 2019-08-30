import React, { useState, useContext, useEffect } from 'react'
import { Store } from '../../Store';
import { Link, withRouter } from "react-router-dom";
import { Burger } from "./Burger";
import './ActionBar.scss'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// FUNCTIONAL COMPONENT
const ActionBar = (props) => {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch({type: 'SHOW_CONTACT_BUTTON'})
      console.log(state.showContactButton, 'TIMEOUt')
    }, 5000)
    return () => {
      clearTimeout(timeout);
    }
  });


  const mobileMenuOpen = state.mobileMenuOpen
    const showContactButton = state.showContactButton
    const loadingDone = state.loadingDone
    const checkIfHome = props.location.pathname === '/'
    const menuList = props.links.map((link) => {
        return <li className="action-bar--menu-list--item" key={link.name}><Link to={`/${link.url}`}>{link.name}</Link></li>;
    })

    const singlePageMenu = () => (
      <div className="single-page-bar--wrapper">
        <div className="single-page-bar">
          <Link to="/">
            <div className="button-box">
              <div className="scale-on-hover">
                BACK
              </div>
            </div>
          </Link>

          <div className="button-box">
            <div className="scale-on-hover">
              <a href="mailto:handshake@invisiblehand.agency">
                {/*<div className="logo"/>*/}
                CONTACT
              </a>
            </div>
          </div>
        </div>
      </div>
    )

    const frontPageMenu = () =>(

        <div className="action-bar">
          <div className="button-box">
            <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>

            {showContactButton ?
            <div className="button scale-on-hover">
              <a href="mailto:handshake@invisiblehand.agency">
                CONTACT US
              </a>
            </div>:
              <div className="blinking">
                {loadingDone &&
                <a>
                  SCRATCH!
                </a>
                }
              </div>}
            </ReactCSSTransitionGroup>
          </div>
        </div>
    )

    return checkIfHome ? frontPageMenu() : singlePageMenu()

}

export default withRouter(ActionBar)