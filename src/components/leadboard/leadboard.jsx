import axios from "axios"
import { useContext, useEffect, useState } from "react";
import './leadboard.css'
import { commonContext } from "../../context/commonContext";

export default function Leadboard(){

    const [leadboardData , setLeadboardData] = useState([])
    const {leadboardOpen , setLeadboardOpen} = useContext(commonContext)

    async function getLeadboardData(){
         try {
          const rankData = await axios.get('https://typing-speed-test-backend.vercel.app/result/rankings');
          setLeadboardData(rankData.data.data)
         }catch(err){
           console.log(err)
         }
    }

    useEffect(()=>{
        getLeadboardData()
    }, [])
    return (
        <div className='modal_outer_container' >
                <div className='backdrop'></div>
                <div className='modal_container'>
                    <div className='modal_head'><div>Leadboard</div><img className='close_icon' src='./delete.png' alt='close' onClick={()=>setLeadboardOpen(false)}/></div>
                    <div className='modal_body'>

                        <table className="leadboard_table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>User</th>
                                    <th>CPM</th>
                                    <th>WPM</th>
                                    <th>Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                 leadboardData.map((item , i)=>{
                                        return (
                                           <tr>
                                            <td>{i + 1}</td>
                                            <td>{item.username}</td>
                                            <td>{item.cpm}</td>
                                            <td>{item.wpm}</td>
                                            <td>{item.accuracy}%</td>
                                           </tr> 
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
    )
}