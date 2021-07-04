import React, {useContext, useState, useEffect} from "react";
import firebase from "../firebase"
import {auth} from "../firebase"

const AuthContext= React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] =useState();
    const [loading,setLoading]= useState(true);

    function login(){
        var provider= new firebase.auth.OAuthProvider("microsoft.com");
        return auth.signInWithPopup(provider);
    }
    function logout(){
        return auth.signOut();
    }

    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
          
           setCurrentUser(user);
           setLoading(false);

          
   
    })},[]);

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