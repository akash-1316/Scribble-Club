import React from 'react'
import { useState } from 'react'
import Carousel from './components/carousel/carousel'
import Navbar from './components/Navbar/navbar'
import Products from './components/Products/products'
import Footer from './components/Footer/footer'
import { Route, Routes } from 'react-router-dom'
import Loginpopup from './components/LoginPopup/Loginpopup'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetail from './pages/ProductPage/productpage'
import Wishlist from './pages/Wishlist/wishlist'
import Checkout from './pages/PlaceOrder/placeorder'
import Cart from './pages/Cart/cart'
import Order from './pages/Orders/orders'
import Verify from './pages/Verify/verify'
import StripeReturn from './components/StripeReurn/stripeReturn'
import Policy from './pages/Policy/policy'
import TOS from './pages/Tos/tos'
import FAQ from './pages/FAQ/faq'
import Support from './pages/Support/Support'
import Profile from "./pages/Profile/profile";
const Home = () => (
  <>
    <Carousel />
    <Products />
  </>
);
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
    {showLogin ? <Loginpopup setShowLogin={setShowLogin}/> : <></>}
    <div className='app'>
       <ToastContainer />
      <Navbar setShowLogin = {setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/fav" element={<Wishlist />} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path='/checkout' element={<Checkout/>} />
          <Route path='/myorders' element={<Order/>} />
          <Route path='/verify' element={<Verify/>} />
          <Route path="/order-success" element={<StripeReturn />} />
          <Route path="/order-failed" element={<StripeReturn />} />
          <Route path='/privacy-policy' element={<Policy />} />
          <Route path='/tos' element={<TOS/>} />
          <Route path='/faq' element={<FAQ/>} />
          <Route path='/support' element={<Support/>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      <Footer/>
    </div>
    </>
  )
}

export default App
