import { useState } from "react";
import axios from "axios";
import { Box, Button } from "@mui/material"
import { Formik, Form } from "formik"
import withAuth from "../HOC/withAuth"
import Input from "../Input/Input"
import './Profile.css'
import SnackbarMessage from "../Snackbar/SnackbarMessage";


const Profile = ({user}) => {
  const [message, setMessage] = useState({flag: null, message: null})
  const validateForm = (values) => {
    const errors = {}
    
    if(!values.oldPassword){
      errors.oldPassword = 'Required'
    }

    if(!values.newPassword){
      errors.newPassword = 'Required'
    }else if(values.newPassword.length < 8){
      errors.newPassword = 'Your password must be at least 8 characters'
    }else if(values.newPassword.search(/[a-z]/i) < 0){
        errors.newPassword = 'Your password must contain at least one letter'
    }else if(values.newPassword.search(/[0-9]/) < 0){
        errors.newPassword = 'Your password must contain at least one digit.'
    }else if(values.newPassword === values.oldPassword){
        errors.newPassword = 'Old Password cannot be the same as New Password'
    }

    return errors
  }

  const submitForm = async (values, {resetForm}) => {
    try {
      const response = await axios.put('/auth/changePassword',  values)
      if(response.status === 200){
        resetForm()
        setMessage({flag: true, message: "Password Updated Successfully"})
      }      
    } catch (error) {
      if(error.response){
        setMessage({flag: false, message: error.response.data || "Password update error"})
    }
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessage(false);
};

  return (
    <Box className="AuthContainer">
        <h1>Profile from {user.fullName}</h1>
        <Formik
          initialValues={{oldPassword: '', newPassword: ''}}
          validate={validateForm}
          onSubmit={submitForm}
        >
          <Form className="FormContainer">
            <h3>Change Password</h3>
            <Input label='Old Password..' name='oldPassword' type='password'/>
            <Input label='New Password..' name='newPassword' type='password'/>
            <Button type="submit" color="primary" variant="contained" sx={{margin:'15px 6px'}}>Change password</Button>
              <SnackbarMessage state={message} handleClose={handleClose}/>
          </Form>
        </Formik>
    </Box>
  )
}

export default withAuth(Profile)
