import {useEffect,useState,useContext,createContext} from 'react'
import {auth} from './services/firebase'
const AuthContext = createContext();
export function AuthProvider({children}){
  
}
export function useAuth(){

}

const AuthContext = () => {
  return (
    <div>AuthContext</div>
  )
}

export default AuthContext