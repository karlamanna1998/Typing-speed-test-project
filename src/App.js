import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import { useContext } from 'react';
import { commonContext } from './context/commonContext';
import Leadboard from './components/leadboard/leadboard';
import Login from './components/login/login';
import axios from 'axios';
import { Router } from 'express';

function App() {

  const {leadboardOpen , setLeadboardOpen , loginOpen , setLoginOpen} = useContext(commonContext)

  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('typingUser')
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
      }
      config.headers['Content-Type'] = 'application/json';
     
      return config
    },
    error => {
      Promise.reject(error)
    }
  )


  axios.interceptors.response.use(
    response => {
      console.log(response);
      return response.data
    },
    error => {
      Promise.reject(error)
    }
  )


  return (
    <BrowserRouter>
    <Routes>
    <Route  path='/'  element={<Home/>}/>
    </Routes>

    {leadboardOpen && <Leadboard/>}
    {loginOpen &&  <Login/>}
    </BrowserRouter>
  );
}

export default App;
