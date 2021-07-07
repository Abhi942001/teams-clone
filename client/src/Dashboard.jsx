import { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import DashboardNavigation from "./components/dashboard/DashboardNavigation/DashboardNavigation";
import DashboardChatsPanel from "./components/dashboard/DashboardChatsPanel/DashboardChatsPanel";
import DashboardChatsSection from "./components/dashboard/DashboardChatsSection/DashboardChatsSection";

import { useAuth } from "./contexts/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const unsubRef = useRef();
  const [rooms, setRooms] = useState({});
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    async function fetchRooms() {
      const unsubscribe1 = db
        .collection("user")
        .doc(currentUser.uid)
        .collection("rooms")
        .onSnapshot((userRoomsSnapshot) => {
          userRoomsSnapshot.docs.forEach(async (userRoomID) => {
            let doc = await db.collection("rooms").doc(userRoomID.id).get();
            let title = doc.data().title;

            unsubRef.current = db
              .collection("rooms")
              .doc(userRoomID.id)
              .collection("messages")
              .orderBy("createdAt")
              .limit(100)
              .onSnapshot((querySnapshot) => {
                const messages = querySnapshot.docs.map((message) => ({
                  ...message.data(),
                  id: message.id,
                }));
                var newRooms;
                setRooms((oldRooms) => {
                  newRooms = oldRooms;
                  return null;
                });
                setRooms((oldRooms) => {
                  newRooms[userRoomID.id] = { title, messages };
                  return newRooms;
                });
              });
          });
        });
      return () => {
        unsubscribe1();
        unsubRef.current && unsubRef.current();
      };
    }
    const unsubscribe = fetchRooms();
    return () => unsubscribe;
  }, [currentUser.uid]);

  const getSelectedRoom = (roomID) => {
    setCurrentChat((c) => roomID);
  };

  const getMessages = () => {
    let messages, roomKey;
    if (rooms) {
      roomKey = Object.keys(rooms).find((key) => {
        return currentChat === key;
      });

      roomKey ? (messages = rooms[roomKey].messages) : (messages = null);
    }
    return { messages, roomKey };
  };
  return (
    <div className="dashboard">
      <DashboardNavigation />
      <div className="dashboard-body">
        <div className="dashboardChatsPanel">
          <DashboardChatsPanel
            rooms={rooms}
            getSelectedRoom={getSelectedRoom}
            currentChat={currentChat}
          />
        </div>
        <DashboardChatsSection
          currentChat={currentChat}
          getMessages={getMessages}
        />
      </div>
    </div>
  );
};

export default Dashboard;
