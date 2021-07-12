import { useCallback, useEffect, useState } from "react";
import "./DashboardNavigation.css";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Icon, TooltipHost, ComboBox } from "@fluentui/react";

const DashboardNavigation = ({ rooms, getSelectedRoom }) => {
  const [options, setOptions] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
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
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
      console.log(error);
    }
  }
  useEffect(() => {
    if(rooms){
    const roomList = Object.keys(rooms).map((key) => ({
      key,
      text: rooms[key].title,
    }));

    setOptions(roomList);
    }  },[rooms]);

  const onChange = useCallback(
    (event, option) => {
      if (option) {
        
        setSelectedKey(() => (selectedKey ? [option.key] : null));
        getSelectedRoom(option.key);
      }
    },
    [selectedKey,getSelectedRoom]
  );

  return (
    <div className="navbar">
      <div>
        <ComboBox
          allowFreeform
          autoComplete={"on"}
          placeholder={searchPlaceholderText}
          style={{ backgroundColor: backColor }}
          onFocus={() => {
            setSearchPlaceholderText("Search for people and chats.");
            setBackColor("white");
          }}
          onBlur={() => {
            setSearchPlaceholderText("Search...");
            setBackColor("#e0e0ed");
          }}
          options={options}
          onChange={onChange}
          dropdownMaxWidth={700}

          selectedKey={selectedKey}
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
