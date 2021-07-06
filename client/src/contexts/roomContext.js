import React, {useContext, useState, } from "react";

const roomContext= React.createContext();

export function useRoom(){
    return useContext(roomContext)
}

export function RoomProvider({children}){
    const [rooms, setRooms] =useState({});

    const update=(newValue)=>{
        return setRooms(newValue);
    }


    const value={
        rooms,
        update,
    }

    return (
        <roomContext.Provider value={value}>
            {children}
        </roomContext.Provider>
    )
}