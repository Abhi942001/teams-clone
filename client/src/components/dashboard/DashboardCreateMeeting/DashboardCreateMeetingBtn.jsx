import { v4 as uuidv4 } from "uuid";
import { db } from "../../../firebase";
import { useHistory } from "react-router-dom";
import { IconButton } from "@fluentui/react";
import { FontIcon } from "@fluentui/react/lib/Icon";
import { useAuth } from "../../../contexts/AuthContext";
import "./DashboardCreateMeetingBtn.css";

const DashboardCreateMeetingBtn = () => {
  const history = useHistory();
  const { currentUser } = useAuth();

  const CreateRoom = () => {
    const roomID = uuidv4();

    let title = "Meeting with " + currentUser.displayName;
    if (db) {
      db.collection("rooms").doc(roomID).set({ title });
    }
    history.push(`/room/${roomID}`);
  };

  return (
    <div className="dashboardCreateMeeting">
      <button
        className="panel-video-button panel-top-buttons"
        style={{ borderRadius: "100%" }}
        onClick={() => {
          CreateRoom();
        }}
      >
        <FontIcon style={{ fontSize: "20px" }} iconName="Video"></FontIcon>
      </button>
    </div>
  );
};

export default DashboardCreateMeetingBtn;
