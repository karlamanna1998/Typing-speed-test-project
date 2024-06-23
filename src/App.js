import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import { useContext } from 'react';
import { commonContext } from './context/commonContext';
import Leadboard from './components/leadboard/leadboard';
import Login from './components/login/login';

function App() {

  const {leadboardOpen , setLeadboardOpen , loginOpen , setLoginOpen} = useContext(commonContext)
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
