import { useAuth } from "../../../contexts/AuthContext";

const MessagesPart = ({ msg }) => {
  const { currentUser } = useAuth();
  const color = { self: "#e9eaf6", others: "#ffffff" };

  const timestamp = msg.createdAt
    .toDate()
    .toLocaleTimeString()
    .replace(/(.*)\D\d+/, "$1");

  return currentUser.uid === msg.userId ? (
    <div
      style={{
        background: color.self,
        maxWidth: "70%",
        marginLeft: "auto",
        marginBottom: "8px",
        borderRadius: "4px",
        height: "max-content",
        textAlign: "left",
        padding: "16px 18px 8px 18px",
        fontSize: "1rem",
        fontWeight: "light",
        overflowWrap: "break-word",
        wordBreak: "break-all",
      }}
    >
      <div style={{ fontWeight: "500", fontSize: "small" }}>{timestamp}</div>
      {msg.text}
    </div>
  ) : (
    <div
      style={{
        position: "relative",
        background: color.others,
        maxWidth: "70%",
        height: "max-content",
        marginRight: "auto",
        marginBottom: "8px",
        borderRadius: ".4rem",
        textAlign: "left",
        padding: "8px 18px 2px 22px",
        fontSize: "1rem",
        fontWeight: "light",
        overflowWrap: "break-word",
        wordBreak: "break-all",
      }}
    >
      <div
        style={{
          borderRadius: "100%",
          position: "absolute",
          left: "0px",
          transform: "translateX(-50%)",
          background: "lightpink",
          color: "maroon",
          width: "32px",
          height: "32px",
          display: "grid",
          placeItems: "center",
          fontSize: "small",
          fontWeight: "500",
        }}
      >
        {msg.displayName.split(" ")[0][0] + msg.displayName.split(" ")[1][0]}
      </div>
      <div style={{ fontSize: "small", fontWeight: "500" }}>
        {msg.displayName} {timestamp}
      </div>
      {msg.text}
    </div>
  );
};
export default MessagesPart;
