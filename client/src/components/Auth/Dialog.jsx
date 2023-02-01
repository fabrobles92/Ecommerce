import {useState} from 'react';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '../Landing/Input';

const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validate = (values) => {
    const errors = {}

    if(!values.email.trim()){
      errors.email = 'Required'
    }else if(!re.test(values.email)){
      errors.email = 'Email not valid'
    }

    return errors
}

export default function FormDialog() {
  const [open, setOpen] = useState(true);

const handleSubmit = (values) => {
    //Send email with new password
    setOpen(false)
}

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Please submit the email you signed up with</DialogTitle>
        <DialogContent>
            <Formik
            initialValues={{email: ''}}
            validate={validate}
            onSubmit={handleSubmit}
            >
                <Form>
                    <Input
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        name = 'name'
            />
                    <DialogActions>
                    <Button type='submit'>Enter</Button>
                    </DialogActions>
                </Form>
            </Formik>          
        </DialogContent>        
      </Dialog>
    </div>
  );
}
