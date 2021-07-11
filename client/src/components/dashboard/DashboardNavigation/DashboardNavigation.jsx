import { useState } from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import "./DashboardNavigation.css";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Icon, TooltipHost } from "@fluentui/react";

const DashboardNavigation = () => {
  const [searchPlaceholderText, setSearchPlaceholderText] = useState(
    "Search..."
  );
  const [error, setError] = useState("");

  const { logout, currentUser } = useAuth();
  const [backColor, setBackColor] = useState("#e0e0ed");
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout;
      history.push("/");
    } catch {
      setError("Failed to log out");
      console.log(error);
    }
  }

  return (
    <div className="navbar">
      <div>
        <TextField
          style={{ background: backColor }}
          placeholder={searchPlaceholderText}
          borderless
          onFocus={() => {
            setSearchPlaceholderText("Search for people and chats.");
            setBackColor("white");
          }}
          onBlur={() => {
            setSearchPlaceholderText("Search...");
            setBackColor("#e0e0ed");
          }}
        />
      </div>
      <TooltipHost content="Logout">
      <div className="logout-icons">
        <Icon iconName="SignOut" onClick={handleLogout}></Icon>
      </div>
      </TooltipHost>
      <div
        style={{
          borderRadius: "100%",
          width: "32px",
          height: "32px",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#999be1",
        }}
      >
        <TooltipHost content={currentUser.displayName}>

        <div
          style={{
            width: "min-content",
            color: "#f5f5f5",
            marginLeft: "0px",
            fontWeight: "bold",
          }}
          >
          {currentUser.displayName[0]}
          {currentUser.displayName.split(" ")[1][0]}
        </div>
          </TooltipHost>
      </div>
    </div>
  );
};
export default DashboardNavigation;
