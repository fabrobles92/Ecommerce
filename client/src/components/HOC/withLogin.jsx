import { useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {UserContext} from '../../UserContext';


const withLogin = (Component) => (props) => {
    const {user} = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(user){
            
            return navigate('/profile')
        }        
    }, [user, navigate])

    switch (user) {
        case null:
            return 
        case false:
            return <Component {...props}/>
    }
}

export default withLogin
