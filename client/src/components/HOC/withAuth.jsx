import React, { useContext } from 'react'
import Auth from '../Auth/Auth'
import {UserContext} from '../../UserContext';

const withAuth = (Component) => (props) => {
    const {user} = useContext(UserContext)
    switch (user) {
        case null:
            return
        case false:
            return(<Auth/>)
        default:
            return <Component {...props} user={user}  />
            
    }
}

export default withAuth
