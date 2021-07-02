import { useState } from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import "./DashboardNavigation.css";

const DashboardNavigation = () => {
  const [searchPlaceholderText, setSearchPlaceholderText] = useState(
    "Search..."
  );
  const [backColor, setBackColor] = useState("#e0e0ed");

  return (
    <div className="navbar">
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
  );
};
export default DashboardNavigation;
