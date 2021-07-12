import { DefaultButton, TextField } from "@fluentui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import "./DashboardMeetingTitlePopup.css";

const DashboardMeetingTitlePopup = ({ createRoom }) => {
  const [title, setTitle] = useState("");
  const { currentUser } = useAuth();
  useEffect(() => {
    setTitle("Meeting with " + currentUser.displayName);
  }, [currentUser]);

  return (
    <div className="title-popup">
      <div className="create-meeting-header">Meeting Name</div>
      <div className="create-meeting-text-field">
        <TextField
          underlined
          className="create-meeting-text"
          style={{ borderBottomColor: "#6264a7", color: "#6264a7" }}
          placeholder="Enter Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></TextField>
      </div>
      <DefaultButton
        style={{ background: "#6264a7", color: "white", width: "100%" }}
        onClick={() => createRoom(title)}
      >
        Create Meeting
      </DefaultButton>
    </div>
  );
};

export default DashboardMeetingTitlePopup;
