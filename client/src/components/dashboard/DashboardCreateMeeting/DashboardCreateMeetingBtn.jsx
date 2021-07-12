import { v4 as uuidv4 } from "uuid";
import { db } from "../../../firebase";
import { useHistory } from "react-router-dom";
import { FontIcon } from "@fluentui/react/lib/Icon";

import DashboardMeetingTitlePopup from "../DashboardMeetingTitlePopup/DashboardMeetingTitlePopup";

import "./DashboardCreateMeetingBtn.css";
import { useState } from "react";

const DashboardCreateMeetingBtn = () => {
  const history = useHistory();
  const [showPopup, setShowPopup] = useState(false)

  const createRoom = async (title) => {
    const roomID = uuidv4();
    
    if (db) {
      await db.collection("rooms").doc(roomID).set({ title });
    }
    history.push(`/room/${roomID}`);
  };

  return (
    <div className="dashboardCreateMeeting">
      <button
        className="panel-video-button panel-top-buttons"
        style={{ borderRadius: "100%" }}
        onClick={() => {
          setShowPopup((prev) => !prev);
        }}
      >
        <FontIcon style={{ fontSize: "20px" }} iconName="Video"></FontIcon>
      </button>
      {showPopup && <DashboardMeetingTitlePopup createRoom={createRoom} />}
    </div>
  );
};

export default DashboardCreateMeetingBtn;
