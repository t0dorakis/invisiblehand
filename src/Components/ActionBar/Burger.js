import React, { useContext } from 'react';
import { Store } from '../../Store';
import './Burger.scss'

export const Burger = (props) => {
  // const { isActive } = props
  const { state, dispatch } = useContext(Store);
  let isActive = state.mobileMenuOpen;
  const activate = () => {
    dispatch({type: 'SWITCH_MOBILE_MENU'})
  }
  const isActiveClass = 'burger isActive'

  return (
    <div className={isActive ? isActiveClass : 'burger'} onClick={activate}>
      <div className="burger--bar" ></div>
      <div className="burger--bar"></div>
    </div>
  )
}