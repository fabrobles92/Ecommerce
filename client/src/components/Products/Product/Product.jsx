import { useContext } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { UserContext } from '../../../UserContext';
import { CartContext } from '../../../CartContext';
import axios from 'axios'

const Product = ({product}) => {
    const {setCart} = useContext(CartContext)
    const {user} = useContext(UserContext)

    const addToCart = async (product) => {
        try {
            const res = await axios.post('/api/cart/'+ user._id, {productId: product._id, quantity: 1})            
        
            if(res.status !== 201) throw new Error('Error adding product')

            setCart(res.data)

        } catch (error) {
            console.error('ERROR SENDING REQUEST:', error)
        }
    }

    return (
        <Card style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center'}}>
        <CardMedia
            sx={{ width: '75%' }}
            component="img"
            image={product.image}
            title={product.title}
        />
        <CardContent>
            <Typography gutterBottom variant="h4" component="div">
            ${product.price}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
            {product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {product.description}
            </Typography>
        </CardContent>
        <CardActions>
            {/* <Button size="small">Share</Button>
            <Button size="small">Learn More</Button> */}
            <Button onClick={() => addToCart(product)} sx={ { borderRadius: 100 , width: {xs:'25.5ch'}} } size="large" variant="contained" color='primary'>
                <span style={{marginRight: '8px'}}>Add to cart</span>
                <AddShoppingCartOutlinedIcon sx={{fontSize: "25px"}}/> 
            </Button>
        </CardActions>
        </Card>
    )
}

export default Product
