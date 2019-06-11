import React from 'react'

export const Store = React.createContext();

const initialState = {
    fingerPosition: {x: 0, y: 0},
    fingerIsTouching: false
}

function reducer(state, action) {
    switch (action.type) {
        case 'SET_FINGER_POSITION':
            return { ...state, fingerPosition: action.payload };
        case 'FINGER_STARTS_TOUCHING':
            return { ...state, fingerIsTouching: true };
        case 'FINGER_STOPS_TOUCHING':
            return { ...state, fingerIsTouching: false };
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}
    </Store.Provider>
}