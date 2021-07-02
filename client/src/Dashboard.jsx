import {useAuth} from "./contexts/AuthContext"
import Button from '@material-ui/core/Button';
import {  useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import {v4 as uuidv4 } from "uuid"
import DashboardNavigation from "./components/dashboard/DashboardNavigation/DashboardNavigation"


const Dashboard = () => {
    const {currentUser,logout}= useAuth();
    const [error,setError]= useState("");
    const history=useHistory();


    useEffect(()=>{
        console.log(currentUser);
    },[])
    async function handleLogout(){
        setError('')

        try{
            await logout
            history.push("/");
        }catch{
            setError("Failed to log out")
        }
        
    }

    const CreateRoom=() => {
        
            const roomID=uuidv4();
            console.log(roomID);
            history.push(`/room/${roomID}`);
        
    }



    return ( 
        <div className="Dasboard">
            <DashboardNavigation></DashboardNavigation>
            {/* {currentUser.displayName} */}
            <Button variant="contained" onClick={()=>{
                handleLogout();
            }}>logout</Button>
            {error}

            <Button variant="contained" onClick={()=>{
                CreateRoom();
            }}> Create Meeting</Button>
        </div>
     );
}
 
export default Dashboard;