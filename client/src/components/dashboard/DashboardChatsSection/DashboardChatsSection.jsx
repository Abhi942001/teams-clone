import { useState, useEffect } from "react";
import MessagesPart from "./MessagesPart";
import { TextField } from "@fluentui/react";
import { IconButton } from "@fluentui/react/lib/Button";
import { Icon } from "@fluentui/react/lib/Icon";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import Picker from "emoji-picker-react";
import "./DashboardChatsSection.css";

const DashBoardChatsSection = ({ getMessages, currentChat }) => {
  const { messages, roomKey } = getMessages();
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  var endOfMessages;
  var [showEmojiPanel, setShowEmojiPanel] = useState(false);

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

  return (
    <>
      {currentChat !== null && (
        <div className="chats-section">
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
      )}{" "}
    </>
  );
};

export default DashBoardChatsSection;
