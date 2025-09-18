import React from 'react'
import Navbar from "./components/Navbar/navbar";
import Sidebar from "./components/Sidebar/sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/login";
import List from "./pages/List/list";
import Order from './pages/Orders/order'
import Messages from './pages/Messages/messages';
const App = () => {
  const url = "https://scribble-club-backend.onrender.com";
  return (
    <div>
       <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Login url={url}/>} />
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Order url={url} />} />
          <Route path='/messages' element={<Messages />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
