import React, { useState, useContext } from 'react'
import { Store } from '../../Store';
import { Link, withRouter } from "react-router-dom";
import './Header.scss'


// FUNCTIONAL COMPONENT
const Header = (props) => {
  const { state, dispatch } = useContext(Store);

    const mobileMenuOpen = state.mobileMenuOpen
    const checkIfHome = props.location.pathname === '/'
    const menuList = props.links.map((link) => {
        return <li className="header--menu-list--item" key={link.name}><Link to={`/${link.url}`}>{link.name}</Link></li>;
    })

    return (
        <div className="header">
          { checkIfHome &&
            <ul className="header--menu-list">
              {menuList}
            </ul>
          }
        </div>
    )
}

export default withRouter(Header)