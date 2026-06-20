import React from 'react'
import {createContext,useState,useEffect,useContext} from 'react'
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'firebase/auth'
import {app} from '../services/firebase'


const auth=getAuth(app);
const AuthContext=createContext()
export const useAuth=()=>{
    return useContext(AuthContext)
}
//Authprovider
export const AuthProvider=({children})=> {
    const [user,setUser]=useState(null)
    const[loading,setLoading]=useState(true);
  
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
          setUser(currentUser);
          setLoading(false);
        });
        return unsubscribe
    },[])
   
    const signup=(email,password)=>{
      return createUserWithEmailAndPassword(auth,email,password);
    };
    const login=(email,password)=>{
      return signInWithEmailAndPassword(auth,email,password);
    };
    const logout=()=>{
      return signOut(auth);
    };

   const value={
    user,
    loading,
    signup,
    login,
    logout
    };
    return (
        <AuthContext.Provider value={value}>
            {!loading&&children}
        </AuthContext.Provider>
    )
}

