import { v4 as uuidv4 } from "uuid";
import { db } from "../../../firebase";
import { useHistory } from "react-router-dom";
import { IconButton } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import { useAuth } from "../../../contexts/AuthContext";
import "./DashboardCreateMeetingBtn.css";


const DashboardCreateMeetingBtn = () => {
    const history=useHistory();
    const {currentUser}=useAuth();

    const CreateRoom = () => {
        const roomID = uuidv4();
        console.log(roomID);
        let title = "Meeting with " + currentUser.displayName;
        if (db) {
          db.collection("rooms").doc(roomID).set({ title });
        }
        history.push(`/room/${roomID}`);
      };

  return (
    <div className="dashboardCreateMeeting">
      <IconButton
        variant="contained"
        className="create-meeting-btn"
        onClick={() => {
          CreateRoom();
        }}
      >
        <Icon iconName="Video"></Icon>
      </IconButton>
    </div>
  );
};

export default DashboardCreateMeetingBtn;
