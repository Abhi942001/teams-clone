import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase";
import {
  DefaultButton,
  FontIcon,
  PrimaryButton,
  Toggle,
  Icon,
  IconButton,
  TooltipHost,
} from "@fluentui/react";
import RoomChat from "../components/MeetingRoom/RoomChat/RoomChat";

import "./Room.css";

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
`;

const videoContainerStyles = {
  overflow: "hidden",
  height: "97%",
  width: "97%",
  position: "relative",
  borderRadius: "6px",
};

const vidCoverIcon = {
  borderRadius: "100%",
  width: "82px",
  height: "82px",
  background: "hotpink",
  color: "white",
  boxShadow: "2px 2px 5px 0px rgba(0, 0, 0, 0.25)",
  display: "grid",
  placeItems: "center",
  fontWeight: "bold",
  fontSize: "xx-large",
};

const Video = (props) => {
  const ref = useRef();
  const name = props.displayName ? props.displayName : "N A";

  const [isVideoOn, setIsVideoOn] = useState(true);
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [props.peer]);

  const coverStyles = {
    display: isVideoOn ? "none" : "grid",
    width: "100%",
    height: "100%",
    position: "absolute",
    left: "0px",
    top: "0px",
    background: "darkgray",
    placeItems: "center",
  };

  return (
    <div style={videoContainerStyles}>
      <StyledVideo playsInline autoPlay ref={ref} />
      <div style={coverStyles}>
        <div style={vidCoverIcon}>
          {name[0]}
          {name.split(" ")[1][0]}
        </div>
      </div>
    </div>
  );
};

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const history = useHistory();
  const { currentUser } = useAuth();
  const [isMuted, setMuted] = useState(false);
  const [isVideoOff, setVideo] = useState(false);

  useEffect(() => {
    db.collection("user")
      .doc(currentUser.uid)
      .collection("rooms")
      .doc(roomID)
      .set({});

    db.collection("user")
      .doc(currentUser.uid)
      .set({ displayName: currentUser.displayName });
    socketRef.current = io.connect("http://localhost:8000");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => {
          
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);

            peersRef.current.push({
              peerID: userID,
              peer,
              displayName: currentUser.displayName,
              userID: currentUser.uid,
            });
            peers.push({
              peerID: userID,
              peer,
              displayName: currentUser.displayName,
              userID: currentUser.uid,
            });
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            displayName: currentUser.displayName,
            userID: currentUser.uid,
          });
          setPeers([...peersRef.current]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("user-left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        })
      })
      .catch(() => {
        alert("Please Give Access to Camera and Microphone!");
      });
      
      return ()=>{
        socketRef.current.disconnect();
      }

  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const disconnectUser = () => {
    socketRef.current.emit("disconnectPeer");

    history.push("/dashboard");
  };

  const muteAudio = () => {
    const enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;

    if (enabled) {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
    } else {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
    }
    
  };
  const videoControl = () => {
    const enabled = userVideo.current.srcObject.getVideoTracks()[0].enabled;

    if (enabled) {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
    } else {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
    }
  };

  const isSelfVideoOn = true;

  const videoCoverStyles = {
    display: isSelfVideoOn ? "none" : "grid",
    width: "100%",
    height: "100%",
    position: "absolute",
    left: "0px",
    top: "0px",
    background: "darkgray",
    placeItems: "center",
  };

  return (
    <div className="Room">
      <div className="RoomVideo">
        <div style={videoContainerStyles}>
          <StyledVideo muted ref={userVideo} autoPlay playsInline />
          <div style={videoCoverStyles}>
            <div style={vidCoverIcon}>
              {currentUser.displayName[0]}
              {currentUser.displayName.split(" ")[1][0]}
            </div>
          </div>
        </div>
        {peers.map((peer) => {
          return (
            <Video
              key={peer.peerID}
              peer={peer.peer}
              displayName={peer.displayName}
            />
          );
        })}
      </div>

      <div className="meeting-controls">
        <div className="icon-group">
        <TooltipHost content="Audio">
          <button
            onClick={() => {
              setMuted((prev) => !prev);
              return muteAudio();
            }}
            className="toggle-button"
          >
            <FontIcon
              iconName={isMuted ? "MicOff" : "Microphone"}
              style={{
                color: isMuted ? "lightcoral" : "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            ></FontIcon>
          </button>
          </TooltipHost>
        </div>
        <div className="icon-group">
          <TooltipHost content="Video">

          <button
            onClick={() => {
              setVideo((prev) => !prev);
              return videoControl();
            }}
            className="toggle-button"
            >
            <FontIcon
              iconName={isVideoOff ? "VideoOff" : "Video"}
              style={{
                color: isVideoOff ? "lightcoral" : "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
              ></FontIcon>
          </button>
              </TooltipHost>
        </div>
        <div className="icon-group">
        <TooltipHost content="Disconnect">
          <button
            className="toggle-button disconnect"
            style={{
              color: "#f5f5f5",
            }}
            onClick={disconnectUser}
          >
            <FontIcon
              style={{
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
              iconName="DeclineCall"
            ></FontIcon>
          </button>
          </TooltipHost>
        </div>
      </div>
      <div className="chatRoom">
        <RoomChat roomID={roomID} />
      </div>
    </div>
  );
};

export default Room;
