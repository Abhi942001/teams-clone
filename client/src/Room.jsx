import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import "./Room.css"
import RoomChat from "./components/MeetingRoom/RoomChat/RoomChat";
import { useHistory } from "react-router";
import {db} from "./firebase"
import { useAuth } from "./contexts/AuthContext";

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 50%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight ,
    width: window.innerWidth 
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    const history=useHistory();
    const {currentUser}=useAuth();
    
    useEffect( () => {
        socketRef.current = io.connect("http://localhost:8000");
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
            db.collection('user').doc(currentUser.uid).collection('rooms').doc(roomID).set({});
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);

            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peers.signal(payload.signal);
            });
        })

    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const disconnectUser=()=>{
        socketRef.current.emit("disconnectPeer");
        history.push("/dashboard")
    }


    return (
        <div className="Room">

        <Container>
            <div className="RoomVideo">

            <StyledVideo muted ref={userVideo} autoPlay playsInline />
                {peers.map((peer, index) => {
                    return (
                        <Video key={index} peer={peer} />
                        );
                    })}
            </div>
            <div className="diconnect">
                <button onClick={disconnectUser}>Disconnect</button>
            </div>
        </Container>
        <div className="chatRoom">
                            <h5>Meeting Chat</h5>
            <div className="mainChatWindow">

            </div>
                <RoomChat roomID={roomID}/>
            </div>
        </div>
    );
};

export default Room;