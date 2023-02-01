import { useEffect, useState } from "react"
import axios from "axios"
import withAuth from "../HOC/withAuth"
import {Box, Grid } from "@mui/material"
import Product from "./Product/Product"

const Products = ({user}) => {
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState({flag: null, message: null})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const res = await axios.get('https://fakestoreapi.com/products')
        const res = await axios.get('/api/products')
        // console.log(res)
        setProducts(res.data)      
      } catch (error) {
        console.log('ERROR!!')
        if(error.response){
          setMessage({flag: false, message: error.response.data || "Fetching product error"})
        }
      }          
    }
    fetchProducts() 

  }, [])

  return (
    <Box sx={{flexGrow: 1}} display='flex' marginBottom='50px'>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12 }}>
        {products.map( product => (
          <Grid item xs={2} sm={4} md={4} key={product.title} sx={{wordWrap: 'break-word'}} style={{display: 'flex'}}>
            <Product product={product}/>
          </Grid>
        ))}
    </Grid>
    </Box>

  )
}

export default withAuth(Products)
