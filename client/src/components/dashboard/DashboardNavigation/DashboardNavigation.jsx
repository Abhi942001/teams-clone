import { useState } from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import "./DashboardNavigation.css";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Icon } from "@fluentui/react";

const DashboardNavigation = () => {
  const [searchPlaceholderText, setSearchPlaceholderText] = useState(
    "Search..."
  );
  const [error, setError] = useState("");
  
  const { logout } = useAuth();
  const [backColor, setBackColor] = useState("#e0e0ed");
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout;
      history.push("/");
    } catch {
      setError("Failed to log out");
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
    <div className="logout-icons" >
        <Icon iconName="SignOut" onClick={handleLogout} style={{width:"10px"}}></Icon>
    
    </div> 
    </div>
  );
};
export default DashboardNavigation;
