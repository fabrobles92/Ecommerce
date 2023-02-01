import axios from "axios";
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button } from "@mui/material"
import { Formik, Form } from 'formik'
import SnackbarMessage from "../../Snackbar/SnackbarMessage";
import Input from '../../Input/Input'

const PasswordReset = () => {
    const [userExists, setUserExists] = useState(null)
    const [message, setMessage] = useState({flag: null, message: null})
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserExists = async () => {
            const response = await fetch(`/auth/${params.id}/${params.token}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
                }
            )
            if(response.status === 200){
                const data = await response.json()
                setUserExists(data)
            }
        }
        fetchUserExists()
    }, [])

    const validateForm = (values) => {
        const errors = {}
        
        if(!values.password){
            errors.password = 'Required'
        }else if(values.password.length < 8){
            errors.password = 'Your password must be at least 8 characters'
        }else if(values.password.search(/[a-z]/i) < 0){
            errors.password = 'Your password must contain at least one letter'
        }else if(values.password.search(/[0-9]/) < 0){
            errors.password = 'Your password must contain at least one digit'
        }

        if(!values.repeatedPassword){
            errors.repeatedPassword = 'Required'
        }else if(values.repeatedPassword !== values.password){
            errors.repeatedPassword = 'Passwords does not match'
        }

        return errors
    }

    const handleForm = async (values) => {
        try {
            const response = await axios.put(`/auth/passwordReset/${params.id}/${params.token}`, values)
            if(response.status === 200){
                navigate('/login')
            }
        } catch (error) {
            if(error.response){
                console.log(error.response)
                setMessage({flag: false, message: error.response.data || 'Error updating new password'})
            }
        }

    }

    const ResetForm = () => {
        return (
            <>
                <h1>Please set your new password</h1>
                <Formik
                    initialValues={{password: '', repeatedPassword: ''}}
                    validate={validateForm}
                    onSubmit={handleForm}
                >
                    <Form className="FormContainer">
                        <Input label='New Password' type='password' name='password'/>
                        <Input label='Repeat Password' type='password' name='repeatedPassword'/>
                        <Button type='submit' color="primary" variant="contained" sx={{margin:'15px 6px'}}>Submit</Button>
                        <SnackbarMessage state={message} handleClose={handleClose}/>
                    </Form>
                </Formik>
            </>
        )
    }

    const render = () => {
        switch (userExists) {
            case null:
                return;
            case false:
                return <h1>Link invalid or expired</h1>
            default:
                return <ResetForm/>
        }
    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setMessage(false);
    };


    return (
        <Box className='AuthContainer'>
            {render()}
        </Box>
    )
}

export default PasswordReset
