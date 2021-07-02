import React, {useContext, useState, useEffect} from "react";
import firebase from "../firebase"
import {auth} from "../firebase"
import {useHistory} from 'react-router-dom'

const AuthContext= React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] =useState();
    const [loading,setLoading]= useState(true);
    const history=useHistory();

    function login(){
        var provider= new firebase.auth.OAuthProvider("microsoft.com");
        return auth.signInWithPopup(provider);
    }
    function logout(){
        return auth.signOut();
    }

    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
          if(user){
           setCurrentUser(user);
           setLoading(false);
          }else {
              setCurrentUser(null);
          }
   
    })},[currentUser,history]);

    const value={
        currentUser,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}