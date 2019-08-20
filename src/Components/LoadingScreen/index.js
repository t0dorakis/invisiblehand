import React from 'react'
import './LoadingScreen.scss'
import { TransitionGroup, CSSTransition } from "react-transition-group";



// FUNCTIONAL COMPONENT
const LoadingScreen = (props) => {
    const { visible } = props
    return (
        <TransitionGroup component={null}>
            {visible && (
                <CSSTransition classNames="dialog" timeout={300}>
                    <div className="loading-screen">
                        <div className="loading-screen--text">
                          <div className="logo" />
                        </div>
                    </div>
                </CSSTransition>
            )}
        </TransitionGroup>
    )
}

export default LoadingScreen