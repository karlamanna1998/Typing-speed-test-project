import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import { useContext, useEffect } from 'react';
import { commonContext } from './context/commonContext';
import Leadboard from './components/leadboard/leadboard';
import Login from './components/login/login';
import axios from 'axios';

function App() {

  const {leadboardOpen , setLeadboardOpen , loginOpen , setLoginOpen} = useContext(commonContext)

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('typingUser');
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on component unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);



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
