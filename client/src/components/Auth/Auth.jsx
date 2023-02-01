import axios from "axios";
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom"
import {Formik, Form} from 'formik'
import { Box, Button, Avatar, Typography } from "@mui/material"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Input from "../Input/Input"
import SnackbarMessage from "../Snackbar/SnackbarMessage";
import {UserContext} from '../../UserContext';
import withLogin from "../HOC/withLogin";
import './Auth.css'
import Footer from "./Footer";


const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const Auth = () => {
    const [signUp, setSignUp] = useState(false)
    const navigate = useNavigate()
    const formikRef = useRef();
    const [message, setMessage] = useState({flag: null, message: null})
    const {setUser} = useContext(UserContext)

    const validateForm = (values) => {
        const errors = {}
        if(signUp && !values.firstName){
            errors.firstName = 'Required'
        }
        if(signUp && !values.lastName){
            errors.lastName = 'Required'
        }
        if(!values.email){
            errors.email = 'Required'
        }else if(!re.test(values.email)){
            errors.email = 'Invalid Email'
        }
        if(!values.password){
            errors.password = 'Required'
        }else if(signUp && values.password.length < 8){
            errors.password = 'Your password must be at least 8 characters'
        }else if(signUp && values.password.search(/[a-z]/i) < 0){
            errors.password = 'Your password must contain at least one letter'
        }else if(signUp && values.password.search(/[0-9]/) < 0){
            errors.password = 'Your password must contain at least one digit.'
        }
        if(signUp && !values.repeatedPassword){
            errors.repeatedPassword = 'Required'
        }else if(signUp && values.repeatedPassword !== values.password){
            errors.repeatedPassword = 'Passwords does not match'
        }
    
        return errors
    }

    const handleForm = async (values, {resetForm}) => {
        //If all values come with value then is a Sign Up
        if(Object.keys(values).every( key => values[key])){
            try {
                const res = await axios.post('/auth/register', values)
                if(res.status === 200){
                    setMessage({flag: true, message: "Registration Successfully please Log in with you new credentials"})
                    setSignUp(false)
                }        
            } catch (error) {
                if(error.response){
                    setMessage({flag: false, message: error.response.data || "Registration error"})
                }
            }
            
        }else{
            try {
                const res = await axios.post('/auth/email', {username: values.email, password: values.password})
                if(res.status === 200)
                {
                    setUser(res.data)
                    navigate('/profile')
                }                
            } catch (error) {
                if(error.response){
                    setMessage({flag: false, message: "Invalid Credentials"})
                }
            }
            
        }

        resetForm()
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setMessage(false);
    };

    return (
        <Box className="AuthContainer">
            <Avatar className="Avatar" sx={{backgroundColor: 'rgb(207, 62, 86)'}}> 
                <LockOutlinedIcon/>
            </Avatar>
            {signUp ? <h1>Sign up</h1>: <h1>Sign in</h1>}
            <Formik
                innerRef={formikRef}
                initialValues={{firstName: '', lastName: '', email: '', password: '', repeatedPassword: ''}}
                validate={validateForm}
                onSubmit={handleForm}
            >
                <Form className="FormContainer">
                    {signUp && 
                    <div className='NameLastNameGroup'>
                    <Input label="First Name" name='firstName' />
                    <Input label="Last Name" name='lastName' />    
                    </div>
                    }
                    <Input label="Email" name='email'/>
                    <Input label="Password" type="password" name='password' />
                    {signUp && <Input label="Repeat Password" type="password"  name='repeatedPassword' />}
                    <Button type='submit' color="primary" variant="contained" sx={{margin:'15px 6px'}}>{signUp ? 'Sign up' : 'Sign in' }</Button>
                    <SnackbarMessage state={message} handleClose={handleClose}/>
                </Form>            
            </Formik>
        {!signUp && 
        <>
            <Typography variant="body2" component='div' sx={{margin: '10px 0'}}>Or Login with</Typography>
            <div className="SocialNetworkLogin">
                <a href='/auth/google' className="google"/>
                <a href='/auth/google' className="facebook"/>
                
            </div>
        </>}
            <Footer formikRef={formikRef} signUp={signUp} setSignUp={setSignUp}/>
        </Box>
    )
}

export default withLogin(Auth)