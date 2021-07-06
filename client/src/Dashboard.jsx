import { useEffect, useState,useRef} from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {db} from "./firebase"
import DashboardNavigation from "./components/dashboard/DashboardNavigation/DashboardNavigation";
import DashboardChatsPanel from "./components/dashboard/DashboardChatsPanel/DashboardChatsPanel";
import { useAuth } from "./contexts/AuthContext";

const Dashboard = () => {
  const history = useHistory();
  const {currentUser}=useAuth();
  const unsubRef = useRef();

  const [rooms, setRooms] = useState({});

  
  useEffect(() => {
    async function fetchRooms() {
      const unsubscribe1 =  db
        .collection("user")
        .doc(currentUser.uid)
        .collection("rooms")
        .onSnapshot((userRoomsSnapshot) => {
          userRoomsSnapshot.docs.forEach(async (userRoomID) => {
            let doc = await db.collection("rooms").doc(userRoomID.id).get();
            let title = doc.data().title;
           
            unsubRef.current = db.collection("rooms")
              .doc(userRoomID.id)
              .collection("messages")
              .orderBy("createdAt")
              .limit(100)
              .onSnapshot((querySnapshot) => {
                const messages = querySnapshot.docs.map((message) =>
                  message.data()
                );
                const newRooms = rooms;
                newRooms[userRoomID.id] = { title, messages };
                setRooms(null);
                setRooms(newRooms);
              });
          });
        });
        return ()=> { unsubscribe1(); unsubRef.current && unsubRef.current()};
    }
    const unsubscribe = fetchRooms();
    return () => unsubscribe;
  }, []);
  

  const CreateRoom = () => {
    const roomID = uuidv4();
    console.log(roomID);
    let title="Meeting with "+ currentUser.displayName;
    if(db){
      db.collection("rooms").doc(roomID).set({title});
    }
    history.push(`/room/${roomID}`);
  };

  return (
    <div className="dashboard">
      <DashboardNavigation></DashboardNavigation>

      <div className="dashboard-body">
        <div className="dashboardChatsPanel">
          <DashboardChatsPanel rooms= {rooms}/>
        </div>
        <div className="buttons">
          <Button
            variant="contained"
            onClick={() => {
              CreateRoom();
            }}
          >
            {" "}
            Create Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
