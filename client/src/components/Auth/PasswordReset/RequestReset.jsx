import axios from 'axios'
import { useState } from 'react'
import { Formik, Form } from 'formik'
import { Box, Button} from "@mui/material"
import Input from '../../Input/Input'
import SnackbarMessage from "../../Snackbar/SnackbarMessage"

const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const RequestReset = () => {
    const [message, setMessage] = useState({flag: null, message: null})

    const validateForm = (values) => {
        const errors = {}

        if(!values.email){
            errors.email = 'Required'
        }else if(!re.test(values.email)){
            errors.email = 'Invalid Email'
        }

        return errors
    }

    const submitForm = async (values, {resetForm}) => {
        try {
            const response = await axios.post('/auth/passwordReset', values)
            if(response.status === 200){
                setMessage({flag: true, message: "A Link has been sent to the provided email, please check your inbox"})
            }
        } catch (error) {
            if(error.response){
                setMessage({flag: false, message: error.response.data || "Password Reset Error"})
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
        <Box className='AuthContainer'>
            <h1>Request Password Reset</h1>
            <Formik
            initialValues={{email: ''}}
            validate={validateForm}
            onSubmit={submitForm}
            >
                <Form className='FormContainer'>
                    <Input label='Email you used to register' name='email' />
                    <Button type='submit' color="primary" variant="contained" sx={{margin:'15px 6px'}}>Submit</Button>
                    <SnackbarMessage state={message} handleClose={handleClose}/>
                </Form>
            </Formik>
        </Box>
)
}

export default RequestReset
