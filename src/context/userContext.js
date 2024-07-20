import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const UserContext  = createContext();

export const UserContextProvider  = ({children})=>{
     const [loggedIn , setLoggedIn] = useState(localStorage.getItem('typingUser') ? true : false);
     const [roomId , setRoomId] = useState('');

     async function getRoomId(){
        try{
            // const token = localStorage.getItem('typingUser');
            await axios.get(`${process.env.REACT_APP_API_URL}room/userDetails`)
            setRoomId()
        }catch(e){
            console.log(e)
        }
     }


     useEffect(()=>{
        const token = localStorage.getItem('typingUser');
        if(token){
            getRoomId()  
        }
     }  , [])
    return (
        <UserContext.Provider value={{loggedIn}}>
        {children}
        </UserContext.Provider>
    )
}