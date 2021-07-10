import { TextField, ComboBox, DefaultButton } from "@fluentui/react";
import { useState, useCallback, useEffect } from "react";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

const NewChat = ({ getSelectedRoom }) => {
  const { currentUser } = useAuth();
  useEffect(() => {
    var userOptions = [];
    async function getUsers() {
      let doc = await db.collection("user").get();
      doc.docs.forEach((user) => {
        if (user.id !== currentUser.uid) {
          const userOption = { key: user.id, text: user.data().displayName };
          userOptions.push(userOption);
        }
      });
      setOptions(userOptions);
    }
    getUsers();
  }, [currentUser.uid]);

  const [options, setOptions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [roomTitle, setRoomTitle] = useState(
    `Meeting with ${currentUser.displayName}`
  );

  const onChange = useCallback(
    (event, option) => {
      if (option) {
        let selected = option.selected;
        setSelectedKeys((prevSelectedKeys) =>
          selected
            ? [...prevSelectedKeys, option.key]
            : prevSelectedKeys.filter((k) => k !== option.key)
        );
      }
    },
    [selectedKeys]
  );

  function createRoom() {
    const roomID = uuidv4();
    // let title = "Meeting with " + currentUser.displayName;
    db.collection("rooms").doc(roomID).set({ title: roomTitle });

    db.collection("user")
      .doc(currentUser.uid)
      .collection("rooms")
      .doc(roomID)
      .set({});
    selectedKeys.forEach((key) => {
      db.collection("user").doc(key).collection("rooms").doc(roomID).set({});
    });

    getSelectedRoom(roomID);
  }

  return (
    <div className="new-chat-section">
      <div className="new-chats-section-1">
        <div className="new-chat-search-box">
          <ComboBox
            multiSelect
            allowFreeform
            autoComplete={"on"}
            label="Search"
            placeholder="Search for Users"
            options={options}
            onChange={onChange}
            selectedKey={selectedKeys}
          />
        </div>
        <div className="new-chat-title-box">
          <TextField
            label="Room Title"
            placeholder="Untitled Room"
            value={roomTitle}
            onChange={(e) => setRoomTitle(e.target.value)}
          ></TextField>
        </div>
      </div>
      <DefaultButton onClick={createRoom}>Create Room</DefaultButton>
    </div>
  );
};

export default NewChat;
