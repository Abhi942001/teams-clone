import "./DashboardChatsPanel.css";
import { Icon, IconButton } from "@fluentui/react/lib/";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardCreateMeetingBtn from "../DashboardCreateMeeting/DashboardCreateMeetingBtn";

const ChatPreview = ({ chat, id, getSelectedRoom, isSelected }) => {
  const doMsgsExist = chat.messages.length > 0 ? true : false;
  let lastMessage, lastMessageAt;
  if (doMsgsExist) {
    lastMessage = chat.messages[chat.messages.length - 1];
    lastMessageAt =
      lastMessage.createdAt.toDate().getMonth() +
      1 +
      "/" +
      lastMessage.createdAt.toDate().getDate();
  }
  const { currentUser } = useAuth();
  return (
    <div
      className="chat-preview"
      style={{ background: isSelected ? "#ffffff" : null }}
      onClick={() => getSelectedRoom(id)}
    >
      <div className="chat-preview-icon">
        {chat.icon ? (
          <img src={chat.icon} alt="Profile Icon" />
        ) : (
          <Icon iconName="MessageFill" style={{ transform: "scale(0.8)" }} />
        )}
      </div>
      <div className="chat-preview-title-group">
        <div className="chat-preview-title"> {chat.title}</div>
        {doMsgsExist && (
          <div className="chat-preview-timestamp">{lastMessageAt}</div>
        )}
      </div>

      {doMsgsExist ? (
        <div className="chat-preview-last-message">
          {(lastMessage.displayName === currentUser.displayName
            ? "You"
            : lastMessage.displayName) +
            ": " +
            (lastMessage.text.length > 30
              ? lastMessage.text.slice(0, 30) + "..."
              : lastMessage.text)}
        </div>
      ) : (
        <div className="chat-preview-last-message">
          <i> Chat is empty</i>
        </div>
      )}
    </div>
  );
};

const DashboardChatsPanel = ({ rooms, getSelectedRoom, currentChat }) => {
  return (
    <div className="chats-panel">
      <div className="chats-panel-header">
        <div style={{ padding: "0px 20px 10px" }}>Chat</div>
        <div>
          <div className="chat-panel-header-rightBtn">
            <DashboardCreateMeetingBtn />
            <div onClick={() => getSelectedRoom(null)}>
              <IconButton>
                <Icon iconName="chat"></Icon>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
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
        {currentChat === null && (
          <div className="new-chat-button">
            <Icon iconName="Contact" className="new-chat-icon" />
            New Chat
          </div>
        )}
        {rooms &&
          Object.keys(rooms).map((key, _index) => (
            <ChatPreview
              id={key}
              key={key}
              chat={rooms[key]}
              getSelectedRoom={getSelectedRoom}
              isSelected={key === currentChat ? true : false}
            ></ChatPreview>
          ))}
      </div>
    </div>
  );
};

export default DashboardChatsPanel;
