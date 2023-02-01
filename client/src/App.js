import { useEffect, useContext } from "react";
import axios from 'axios'
import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Products from "./components/Products/Products";
import Profile from "./components/Profile/Profile";
import PasswordReset from './components/Auth/PasswordReset/PasswordReset'
import RequestReset from "./components/Auth/PasswordReset/RequestReset";
import {UserContext} from "./UserContext";
import {CartContext} from "./CartContext"


function App() {
  const {user, setUser} = useContext(UserContext)

  const {setCart} = useContext(CartContext)

  useEffect(() => {
    console.log('Ejecutando use effect')
    const getUser = async () => {
      const res = await axios.get('/api/me')
      setUser(res.data || false)
    }
    getUser()
  }, [])


  useEffect(() => {
    console.log('Ejecutando use effect2')
    const getCart = async () => {
      if(!user) return
      console.log(user._id)
      const res = await axios.get('/api/cart/' + user._id)
      setCart(res.data)
    }
    getCart()
  }, [user])


  return (    
    <BrowserRouter>
    {console.log('Renderizando APP')}
    {/* {console.log('Cart: ', cart)} */}
      <div className="App">
        <Container maxWidth='lg'>
          <Navbar/>
          <Routes>
            <Route path='/' exact element={<Home/>}/>
            <Route path='/login' exact element={<Auth/>}/>
            <Route path='/password-reset' exact element={<RequestReset/>} />
            <Route path='/password-reset/:id/:token' exact element={<PasswordReset/>} />
            {/* Paths that need Login */}

            <Route path='/products' exact element={<Products />}/>
            <Route path='/profile' exact element={<Profile />}/>
          </Routes>
        </Container>
      </div>      
    </BrowserRouter>    
  );
}

export default App;
