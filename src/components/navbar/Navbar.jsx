import { useState } from 'react'
import Login from '../login/login'
import './navbar.css'

export default function Navbar() {
    const [isLogedIn , setIsLogedin] = useState(localStorage.getItem('typingUser') ? true : false);
    const [loginOpen , setLoginOpen] = useState(false)

    function handleLoginModalClose(){
        setIsLogedin()
    }
    return (

        <>
        <nav>
            <img className='logo' src='./computer.png' />
            <div className='nav_btn_container'>

                <button className="button-67" >Leadboard</button>

                {!isLogedIn && <button className="button-67" onClick={()=>setLoginOpen(true)}>Login/Signup</button>}

                {isLogedIn && <button className="button-67">Logout</button>}
            </div>
        </nav>

       { loginOpen && <Login  loginSignupClose={handleLoginModalClose}/>}
        </>
        
    )
}

