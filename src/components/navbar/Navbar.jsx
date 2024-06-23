import { useContext, useState } from 'react'
import Login from '../login/login'
import './navbar.css'
import { commonContext } from '../../context/commonContext';

export default function Navbar() {
    const { setLeadboardOpen, loginOpen, setLoginOpen } = useContext(commonContext)
    const [isLogedIn, setIsLogedin] = useState(localStorage.getItem('typingUser') ? true : false);

    function handleLogout() {
        const confirmLogout = window.confirm('Are you sure you want to logout?');

        if (confirmLogout) {
            localStorage.removeItem('typingUser');
            window.location.reload();
        }
    };
    return (

        <>
            <nav>
                <img className='logo' src='./computer.png' alt='logo' />
                <div className='nav_btn_container'>

                    <button className="button-67" onClick={() => setLeadboardOpen(true)}>Leadboard</button>

                    {!isLogedIn && <button className="button-67" onClick={() => setLoginOpen(true)}>Login/Signup</button>}

                    {isLogedIn && <button className="button-67" onClick={handleLogout}>Logout</button>}
                </div>
            </nav>


        </>

    )
}

