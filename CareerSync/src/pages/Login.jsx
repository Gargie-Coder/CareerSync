import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '../constants/authErrors'


const Login = () => {
  const {navigate}=useNavigate()
  const {login}=useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit=(e)=>{
    e.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
    login(email,password).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert(`User logged in: ${user.email}`)
      
      
    }).catch((error) => {
      alert(getAuthErrorMessage(error.code));
    });
  }
  return (
    <div className='flex flex-col justify-center items-center h-[500px] bg-white dark:bg-slate-900 w-100 m-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl shadow-slate-300/50 dark:shadow-slate-950/50 text-slate-900 dark:text-slate-100 my-25'>
      <h1 className='text-3xl text-slate-900 dark:text-slate-100 font-bold mb-4'>Login</h1>
      <form className='flex flex-col w-80' onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className='mb-4 p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className='mb-4 p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className='bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 rounded-lg shadow-md text-white font-bold py-2 px-4 transition'>
          Login
        </button>
        <p className='my-4 text-center text-slate-600 dark:text-slate-300'>Don't have account,<Link to="/signup" className='text-sky-600 dark:text-blue-400 hover:text-sky-500 dark:hover:text-cyan-200 transition-colors'>Signup</Link></p>
      </form>

    </div>
  )
}

export default Login