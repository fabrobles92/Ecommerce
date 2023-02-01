import { TextField} from "@mui/material"
import { useField } from "formik"
import './Input.css'

const Input = (props) => {
    const [field, meta] = useField(props)
    return (
    <div className="formField">
        <TextField {...field} {...props}  sx={{margin:'6px'}} />
        {meta.error && meta.touched && <label className="error">{meta.error}</label>}
    </div>
    )
}

export default Input
