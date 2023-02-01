import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Grid } from "@mui/material"

const Footer = ({formikRef, setSignUp, signUp}) => {
    const navigate = useNavigate()
    return (
    <>
        <Grid container justifyContent='end' sx={{marginTop:'20px'}}>
            <Grid item>
                <Button onClick={() => {
                    setSignUp(!signUp)
                    formikRef.current?.resetForm()
                    }}>
                    {signUp ? 'Already Have an account? Sign in' : "Don't have an account? Sign up"}
                </Button>
                <Button onClick={() => {
                    navigate('/password-reset')
                    }}>
                    Forgot Password?
                </Button>
            </Grid>
        </Grid>
    </>
    )
    }

export default Footer
