import React from 'react'
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';

const MiniCart = ( {quantity} ) => {
    const renderQuantity = () => {
        switch (quantity) {
            case 0:                
                return;                        
            default:
                return (
                    <div style={{backgroundColor: '#FF7A59', position: 'relative', left: '35px', top: '21px', width: '23px', height: '23px', borderRadius: '50%',  padding: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span >
                            {quantity > 10 ? '10+' : quantity.toString()}
                        </span>
                    </div>
                )
        }
    }
    console.log('cantidad', quantity)
     return (
        <a style={{textDecoration: 'none', color: 'inherit', display: 'flex'}} href='Cart'>
            {renderQuantity()}
            <ShoppingCartTwoToneIcon sx={{ display: { xs: 'flex' }, mr: 1 }} />
            <span>Cart</span>
        </a>
  )
}

export default MiniCart
