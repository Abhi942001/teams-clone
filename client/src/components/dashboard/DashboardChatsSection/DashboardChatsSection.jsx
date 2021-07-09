import MessagesPart from "./MessagesPart";
import NewChat from "./NewChat";
import Picker from "emoji-picker-react";
import "./DashboardChatsSection.css";
import { useState, useEffect } from "react";
import { TextField } from "@fluentui/react";
import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { Icon } from "@fluentui/react/lib/Icon";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router";

const DashBoardChatsSection = ({
  getMessages,
  currentChat,
  getSelectedRoom,
}) => {
  const { messages, roomKey } = getMessages();
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  var endOfMessages;
  var [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (endOfMessages) endOfMessages.scrollIntoView();
  }, [messages, endOfMessages]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (db) {
      db.collection("rooms").doc(roomKey).collection("messages").add({
        text: newMessage,
        createdAt: new Date(),
        userId: currentUser.uid,
        displayName: currentUser.displayName,
      });
    }
    setNewMessage("");
  };
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage((previousValue) => previousValue + emojiObject.emoji);
  };

  const joinMeeting = () => {
    history.push(`/room/${roomKey}`);
  };

  return (
    <>
      {currentChat === null ? (
        <NewChat getSelectedRoom={getSelectedRoom} />
      ) : (
        <div className="chats-section">
          <div className="joinBtn">
            <DefaultButton
              onClick={joinMeeting}
              style={{ backgroundColor: "#6264a7", color: "white" }}
            >
              <Icon iconName="video" /> &nbsp; Join Video Call
            </DefaultButton>
          </div>
          <div className="messages">
            {messages && (
              <>
                <div>
                  {messages.map((m) => (
                    <MessagesPart key={m.id} msg={m} />
                  ))}
                </div>
                <div
                  ref={(ele) => {
                    endOfMessages = ele;
                  }}
                ></div>
              </>
            )}
          </div>

          <div className="chats-send">
            <form onSubmit={handleOnSubmit} style={{ position: "relative" }}>
              <TextField
                className="msg-input"
                value={newMessage}
                onChange={handleOnChange}
                placeholder="Type message..."
                underlined
              />
              <IconButton
                type="submit"
                disabled={!newMessage}
                style={{ marginLeft: "auto" }}
              >
                <Icon iconName="send"></Icon>
              </IconButton>
              <IconButton
                onClick={() => {
                  setShowEmojiPanel((oldVal) => !oldVal);
                  console.log(showEmojiPanel);
                }}
              >
                <Icon iconName="emoji"></Icon>
              </IconButton>
              {showEmojiPanel && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    width: "fit-content",
                    height: "fit-content",
                  }}
                >
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DashBoardChatsSection;
