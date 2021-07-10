import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import MessagesPart from "./MessagesPart";
import { TextField } from "@fluentui/react";
import { IconButton } from "@fluentui/react/lib/Button";
import { Icon } from "@fluentui/react/lib/Icon";
import "./RoomChat.css";
import Picker from "emoji-picker-react";

const RoomChat = (props) => {
  const [messages, setMessages] = useState([]);
  const { roomID } = props;
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (db) {
      const unsubscribe = db
        .collection("rooms")
        .doc(roomID)
        .collection("messages")
        .orderBy("createdAt")
        .limit(100)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages(data);
        });

      return unsubscribe;
    }
  }, [roomID]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (db) {
      db.collection("rooms").doc(roomID).collection("messages").add({
        text: newMessage,
        createdAt: new Date(),
        userId: currentUser.uid,
        displayName: currentUser.displayName,
      });
    }
    setNewMessage("");
  };

  return (
    <div className="MeetingChat">
      <h4>Meeting Chat</h4>
      <div>
        <div className="messages-container">
          {messages.map((message) => (
            <MessagesPart msg={message} key={message.id} />
          ))}
        </div>
      </div>
      <div className="message-form">
        <form onSubmit={handleOnSubmit}>
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
          {/* <Picker /> */}
        </form>
      </div>
    </div>
  );
};

export default RoomChat;
