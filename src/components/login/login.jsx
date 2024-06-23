import { useContext, useState } from 'react'
import './login.css'
import axios from 'axios';
import { commonContext } from '../../context/commonContext';

export default function Login() {
  const { setLoginOpen} = useContext(commonContext)


    const [currentTab , setCurrentTab] = useState('login');
    const [username , setUsername]= useState('');
    const [password , setPassword] = useState('')
    const [submited , setSubmited] = useState(false)
   


    function handleLoginTab(){
        setCurrentTab('login')
    }

    function handleSignupTab(){
        setCurrentTab('signup')
    }

 async function signup(){
     try{
       await  axios.post('https://typing-speed-test-backend.vercel.app/auth/register' , {username , password});
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
      const loginData  =  await axios.post('https://typing-speed-test-backend.vercel.app/auth/login' , {username , password});
       setUsername('');
       setPassword('');
       localStorage.setItem('typingUser', loginData.data.token);
       setLoginOpen(false)
       window.location.reload();
    }
    catch(err){
        alert(err.response.data.message)
       console.log(err);
    }
}

    function HandleSubmit(e){
        e.preventDefault()

        setSubmited(true)


        if(username && password){
            if(currentTab === 'signup'){
                signup()
            }else if(currentTab === 'login'){
                login()
            }
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
                           {submited && !username && <div className='error_text'>Username is required</div>}
                        </div>

                        <div className="form_group_container">
                            <label>Password</label>
                            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" />
                            {submited && !password && <div className='error_text'>Password is required</div>}
                        </div>

                        {currentTab === 'login' && <div className='login_text'>Dont have an account? <span onClick={handleSignupTab}>Signup</span></div>}
                        {currentTab === 'signup' && <div className='login_text'>Already have an accout? <span onClick={handleLoginTab}>Login</span></div>}
                        <div className='login_btn_container'>
                            <button type='button' className='cancel_btn' onClick={()=>setLoginOpen(false)}>Cancel</button>
                        <button type='submit' className='login_btn'>{currentTab === 'login' ? "Login" : 'Signup'}</button>
                        </div>
                        
                    </form>

                </div>
            </div>
        </div>
    )
}