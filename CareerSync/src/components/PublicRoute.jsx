import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


const PublicRoute = ({children}) => {
  const {user}=useAuth();
  return (
    <>
     {user?(
        <Navigate to='/' replace />
      ):(
       children
      )}
    </>
  )
}

export default PublicRoute