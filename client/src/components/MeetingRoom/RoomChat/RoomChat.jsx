import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import MessagesPart from "./MessagesPart";
import { TextField } from "@fluentui/react";
import { IconButton } from "@fluentui/react/lib/Button";
import { Icon } from "@fluentui/react/lib/Icon";
import "./RoomChat.css";

const RoomChat = (props) => {
  const [messages, setMessages] = useState([]);
  const { roomID } = props;
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (db) {
      const unsubscribe = db
        .collection(roomID)
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
  }, [db]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (db) {
      db.collection(roomID).add({
        text: newMessage,
        createdAt: new Date(),
        userId: currentUser.uid,
        displayName: currentUser.displayName,
      });
    }
    setNewMessage("");
  };

  return (
    <div className="RoomChat">
      <div className="messages">
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
          <IconButton type="submit" disabled={!newMessage} style={{marginLeft: "auto"}}>
            <Icon iconName="send"></Icon>
          </IconButton>
        </form>
      </div>
    </div>
  );
};

export default RoomChat;
