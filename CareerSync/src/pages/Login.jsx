import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../constants/authErrors'
import { FcGoogle } from 'react-icons/fc'


const Login = () => {
  const {login,signInWithGoogle}=useAuth();
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

  const handleGoogleSignIn = () => {
    signInWithGoogle().catch((error) => {
      alert(getAuthErrorMessage(error.code));
    });
  }
  return (
    <div className='flex flex-col justify-center items-center min-h-[500px] bg-white dark:bg-slate-900 w-[90%] max-w-md m-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl shadow-slate-300/50 dark:shadow-slate-950/50 text-slate-900 dark:text-slate-100 my-25'>
      <h1 className='text-3xl text-slate-900 dark:text-slate-100 font-bold mb-4'>Login</h1>
      <form className='flex flex-col
      ' onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className='mb-4 p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className='mb-4 p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className='bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 rounded-lg shadow-md text-white font-bold py-2 px-4 transition'>
          Login
        </button>
        <p className='my-4 text-center text-slate-600 dark:text-slate-300'>Don't have account,<Link to="/signup" className='text-sky-600 dark:text-blue-400 hover:text-sky-500 dark:hover:text-cyan-200 transition-colors'>Signup</Link></p>
      </form>

      <div className='flex items-center gap-3 w-full max-w-[280px] my-2'>
        <div className='flex-1 h-px bg-slate-200 dark:bg-slate-700'></div>
        <span className='text-xs text-slate-400 dark:text-slate-500'>OR</span>
        <div className='flex-1 h-px bg-slate-200 dark:bg-slate-700'></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className='flex items-center justify-center gap-2 w-full max-w-[280px] mb-6 py-2 px-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg shadow-sm transition'
      >
        <FcGoogle className='text-xl'/>
        Continue with Google
      </button>

    </div>
  )
}

export default Login