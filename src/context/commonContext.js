import   { createContext, useState } from "react";

export const commonContext = createContext();


export const ContextProvider = ({children})=>{

    const [leadboardOpen , setLeadboardOpen] = useState(false)
    const [loginOpen , setLoginOpen] = useState(false)


    return (
        <commonContext.Provider value={{leadboardOpen , setLeadboardOpen , loginOpen , setLoginOpen}}>
            {children}
        </commonContext.Provider>
    )
}