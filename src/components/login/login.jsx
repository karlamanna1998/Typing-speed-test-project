import { useState } from 'react'
import './login.css'
import axios from 'axios';

export default function Login({loginSignupClose}) {
    const [currentTab , setCurrentTab] = useState('login');
    const [username , setUsername]= useState('');
    const [password , setPassword] = useState('')
   


    function handleLoginTab(){
        setCurrentTab('login')
    }

    function handleSignupTab(){
        setCurrentTab('signup')
    }

 async function signup(){
     try{
       await  axios.post('http://localhost:5000/auth/register' , {username , password});
        setUsername('');
        setPassword('');
        setCurrentTab('login');
     }
     catch(err){
        console.log(err);
     }
 }

 async function login(){
    try{
      const loginData  =  await axios.post('http://localhost:5000/auth/login' , {username , password});
      console.log(loginData.data);
       setUsername('');
       setPassword('');
       localStorage.setItem('typingUser', loginData.data.token);
       loginSignupClose()
       window.location.reload();
    }
    catch(err){
       console.log(err);
    }
}

    function HandleSubmit(e){
        e.preventDefault()

        console.log("hit");

        if(currentTab === 'signup'){
            signup()
        }else if(currentTab === 'login'){
            login()
        }


    }
    return (
        <div className="login_wrapper">
            <div className="backdrop"></div>
            <div className="login_container">
                <div className="login_signup_tab_container">
                    <div className={ `tab ${currentTab === 'login' ? 'active' : ''}`} onClick={()=>handleLoginTab()}>Login</div>
                    <div  className={ `tab ${currentTab === 'signup' ? 'active' : ''}`} onClick={()=>handleSignupTab()}>Signup</div>
                </div>

                <div className="form_conatiner">
                    <form onSubmit={(e)=>HandleSubmit(e)}>
                        <div className="form_group_container">
                            <label>Username</label>
                            <input value={username} type="text" onChange={(e)=>setUsername(e.target.value)}/>
                        </div>

                        <div className="form_group_container">
                            <label>Password</label>
                            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" />
                        </div>

                        {currentTab === 'login' && <div className='login_text'>Dont have an account? <span>Signup</span></div>}
                        {currentTab === 'signup' && <div className='login_text'>Already have an accout? <span>Login</span></div>}
                        <div className='login_btn_container'>
                            <button type='button' className='cancel_btn'>Cancel</button>
                        <button type='submit' className='login_btn'>Login</button>
                        </div>

                        
                    </form>

                </div>
            </div>
        </div>
    )
}