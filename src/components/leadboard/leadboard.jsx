import axios from "axios"
import { useContext, useEffect, useState } from "react";
import './leadboard.css'
import { commonContext } from "../../context/commonContext";
import { UserContext } from "../../context/userContext";

export default function Leadboard() {

    const [leadboardData, setLeadboardData] = useState([])
    const [roomLeadboardData, setroomLeadboardData] = useState({
        result : [],
        roomCode : '',
        roomName : ''
    })
    const { leadboardOpen, setLeadboardOpen, setLoginOpen } = useContext(commonContext)
    const { loggedIn, roomId, setRoomId } = useContext(UserContext)
    const [currentTab, setCurrentTab] = useState(1)
    const [joinRoomSubmitted, setJoinRoomSubmitted] = useState(false)
    const [roomCode, setRoomCode] = useState('')
    const [creatRoomData, setCreateRoomData] = useState({
        roomName: '',
    })
    const [createRoomSubmitted, setCreateRoomSubmitted] = useState(false)
    const [joinRoomLoading , setJoinRoomLoading] = useState(false)
    const [createRoomLoading , setCreateRoomLoading] = useState(false)
    const [leadboardLoading , setLeadboardLoading] = useState(true)
    async function getLeadboardData() {
        setLeadboardLoading(true)
        try {
            const rankData = await axios.get(`${process.env.REACT_APP_API_URL}result/rankings`);
            setLeadboardData(rankData.data.data)
            setLeadboardLoading(false)
        } catch (err) {
            console.log(err)
            setLeadboardLoading(false)
        }
    }

    async function getRoomLeadboardData() {
        try {
            const rankData = await axios.get(`${process.env.REACT_APP_API_URL}room/roomWise-rank`);
            console.log(rankData.data.data.result);
            setroomLeadboardData(rankData.data.data);
        } catch (err) {
            console.log(err)
        }
    }


    async function joinRoom() {
        if (loggedIn) {
            setJoinRoomSubmitted(true);
            
            if (!roomCode) {
                alert('Please enter room code')
                return;
            }
            setJoinRoomLoading(true)
            try {
                const roomData = await axios.post(`${process.env.REACT_APP_API_URL}room/join-room`, { "room_code": roomCode });
                console.log(roomData, 'join');
                setJoinRoomLoading(false)
                setRoomId(roomData.data.data._id)
                alert(roomData.data.message)

            } catch (err) {
                setJoinRoomLoading(false)
                console.log(err, 'llll')
                alert(err.response.data.message)
            }
        }
    }

    async function createRoom() {
        if (loggedIn) {
            setCreateRoomSubmitted(true);
            if (!creatRoomData.roomName) {
                alert('Please enter room name')
                return;
            }
            setCreateRoomLoading(true)
            try {
                const roomData = await axios.post(`${process.env.REACT_APP_API_URL}room/create-room`, { "room_name": creatRoomData.roomName });
                console.log(roomData, 'join');
                setCreateRoomLoading(false)
                setRoomId(roomData.data.data.room_code)
                alert(roomData.data.message)
            } catch (err) {
                setCreateRoomLoading(false)
                console.log(err, 'llll')
                alert(err.response.data.message)
            }
        }
    }

    async function exitRoom() {
        const result = window.confirm('Are you sure you want to leave the room?');
        if (result) {
            try {
                const roomData = await axios.post(`${process.env.REACT_APP_API_URL}room/leave-room`);
                setRoomId('')
                alert(roomData.data.message)
            } catch (err) {
                console.log(err, 'llll')
                alert(err.response.data.message)
            }
        } else {

        }
    }

    function login() {
        setLeadboardOpen(false)
        setLoginOpen(true)
    }


    useEffect(() => {
        getLeadboardData()
        if (roomId) {
            getRoomLeadboardData()
        } else {
            setCurrentTab(1)
        }
    }, [roomId])
    return (
        <div className='modal_outer_container' >

            <div className='backdrop'></div>
            <div className='modal_container'>
                <div className='modal_head'>

                    <ul className="tabs_container">
                        <li className={currentTab === 1 && 'active'} onClick={() => setCurrentTab(1)}>Leadboard</li>
                        {<li className={currentTab === 2 && 'active'} onClick={() => setCurrentTab(2)}>Room Leadboard</li>}
                    </ul>

                    {/* <div>Leadboard</div> */}

                    <img className='close_icon' src='./delete.png' alt='close' onClick={() => setLeadboardOpen(false)} /></div>
                <div className='modal_body'>


                    {currentTab === 1 &&
                        <>
                            <div className="table_wrapper">
                                {!leadboardLoading && <table className="leadboard_table">
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
                                            leadboardData.map((item, i) => {
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

                                        {
                                           leadboardData.length == 0 && <tr><td colSpan={5}>No data found</td></tr>
                                        }
                                         
                                    </tbody>
                                </table>}
                                {
                                            leadboardLoading && <div className="loading_wrapper"><img src="./loading2.gif"/></div>
                                            }
                            </div>
                            {!loggedIn && <p className="helperText">* You need to <span onClick={login}>login</span> to compete with others on the leaderboard.</p>}
                        </>
                    }

                    {currentTab === 2 &&
                        <>
                            {roomId && <>

                                <div className="roomName_container">
                                    <p><span>Room Name :</span> {roomLeadboardData.roomName}</p>
                                    <p><span>Room Code :</span> {roomLeadboardData.roomCode}</p>
                                    <button className="common_btn" onClick={exitRoom}>Exit Room</button>
                                </div>

                                <div className="table_wrapper">

                                    <table className="leadboard_table room_leadbord_table">
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
                                                roomLeadboardData.result.length && roomLeadboardData.result.map((item, i) => {
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
                                            {
                                             roomLeadboardData.result.length == 0 && <tr><td colSpan={5}>No data found</td></tr>
                                            }
                                          
                                        </tbody>
                                    </table>
                                </div>
                                <p className="helperText">" Share the room code to compete with friends and fellow typists. Track your progress and see who can claim the top spot on the leaderboard in real-time. "</p>

                            </>
                            }

                            {!roomId && <>
                                <div className="new_room_join_container">
                                    <p className="Join_title">Join a room</p>
                                    <input type="text" placeholder="Room Code" disabled={!loggedIn} value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                                    <button className="common_btn" onClick={joinRoom} disabled={!loggedIn}>
                                    {joinRoomLoading ? <div class="spinner-border text-light" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                        </div> : 'Join'}
                                    </button>
                                </div>

                                <div className="or_container">
                                    <div className="or_line"></div>
                                    <div>OR</div>
                                    <div className="or_line"></div>
                                </div>

                                <div className="new_room_join_container create_room">
                                    <p className="Join_title">Create a room</p>
                                    <input type="text" placeholder="Room Name" value={creatRoomData.roomName} onChange={(e) => setCreateRoomData((prev) => ({ ...prev, roomName: e.target.value }))} disabled={!loggedIn} />
                                    <button className="common_btn" onClick={createRoom} disabled={!loggedIn}>
                                    {createRoomLoading ? <div class="spinner-border text-light" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                        </div> : 'Create'}

                                    </button>
                                </div>

                                {loggedIn && <p className="helperText">"Join an existing room or create a new one to compete with friends and fellow typists. Track your progress and see who can claim the top spot on the leaderboard in real-time. "</p>}
                                {!loggedIn && <p className="helperText">* You need to <span onClick={login}>login</span> to join or create a room.</p>}
                            </>}


                        </>

                    }


                </div>
            </div>
        </div>
    )
}