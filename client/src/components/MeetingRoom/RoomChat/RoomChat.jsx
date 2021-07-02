import { useState,useEffect, useRef } from "react";
import {db} from "../../../firebase"
import { useAuth } from "../../../contexts/AuthContext";
import MessagesPart from "./MessagesPart";
import {useCollectionData} from 'react-firebase-hooks/firestore'


const RoomChat = (props) => {
    const{currentUser}=useAuth();
    const roomID=props.roomID;
    const [message,setMessage]=useState("");
    const messageRef=db.collection('messages');
    const {displayName,uid}=currentUser

    const query= messageRef.orderBy('createdAt').limit(25);
    
    const [messages]=useCollectionData(query,{idField:roomID});
    console.log(useCollectionData(query));
    




const handleSubmit=async (e)=>{
    e.preventDefault();
    await messageRef.doc(roomID).set({
        displayName,
        id:uid,
        createdOn:new Date(),
        msg:message,


    })
    setMessage("");

};




    return ( 
        <div className="RoomChat">
            {roomID}
            <div>
                {messages && messages.map(msg=><RoomChat key={msg.id} message={msg}/>)}
            </div>

            <form onSubmit={handleSubmit}>
                <textarea 
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                placeholder="Enter Message"
                ></textarea>

                <button type="submit" disabled={!message}> Send
                </button> 
            </form>
        </div>
     );
}
 
export default RoomChat;