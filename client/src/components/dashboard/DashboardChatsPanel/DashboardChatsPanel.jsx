import "./DashboardChatsPanel.css";
import { Icon } from "@fluentui/react/lib/Icon";
import { useAuth } from "../../../contexts/AuthContext";

const ChatPreview = ({ chat, id }) => {
  const doMsgsExist = chat.messages.length > 0 ? true : false;
  let lastMessage, lastMessageAt;
  if(doMsgsExist){
   lastMessage = chat.messages[chat.messages.length - 1];
   lastMessageAt =
    lastMessage.createdAt.toDate().getMonth() +
    1 +
    "/" +
    lastMessage.createdAt.toDate().getDate();
  }
  const { currentUser } = useAuth();

  return (
    <div className="chat-preview">
      <div className="chat-preview-icon">
        {chat.icon ? (
          <img src={chat.icon} alt="Profile Icon"/>
        ) : (
          <Icon iconName="MessageFill" style={{ transform: "scale(0.8)" }} />
        )}
      </div>
      <div className="chat-preview-title-group">
        <div className="chat-preview-title"> {chat.title}</div>
        {doMsgsExist && <div className="chat-preview-timestamp">{lastMessageAt}</div>}
      </div>

      {doMsgsExist && 
      <div className="chat-preview-last-message">
        {(lastMessage.displayName === currentUser.displayName
          ? "You"
          : lastMessage.displayName) +
          ": " +
          (lastMessage.text.length > 30
            ? lastMessage.text.slice(0, 30) + "..."
            : lastMessage.text)}
      </div>}
    </div>
  );
};

const DashboardChatsPanel = ({ rooms }) => {

  return (
    <div className="chats-panel">
      <div style={{ padding: "0px 20px 10px" }}>Chat</div>
      <hr />
      <div className="recent-chats">
        <div
          style={{
            padding: "10px 10px 5px 20px",
            fontSize: "small",
            fontWeight: "300",
          }}
        >
          Recents
        </div>
        <div className="new-chat-button">
          <Icon
            iconName="Contact"
            style={{
              background: "#f0f0f0",
              padding: "10px",
              borderRadius: "100%",
              marginRight: "10px",
              transform: "scale(0.85) translateX(-15%)",
            }}
          />
          New Chat
        </div>
        {rooms &&
          Object.keys(rooms).map((key, _index) => (
            <ChatPreview id={key} key={key} chat={rooms[key]}></ChatPreview>
          ))}
      </div>
    </div>
  );
};

export default DashboardChatsPanel;
