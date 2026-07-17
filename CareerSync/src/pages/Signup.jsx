import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import { getAuthErrorMessage } from '../constants/authErrors';


const Signup = () => {
  const {signup}=useAuth()
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
 
  
  const handleSubmit=(e)=>{
    e.preventDefault()
    console.log("Name:",name)
    console.log("Email:", email)
    console.log("Password:", password)
    signup(name,email,password).then((value)=>{
      alert(`User created: ${name}`);
    }).catch((error)=>{
      alert(getAuthErrorMessage(error.code));
    });
  }
  return (
    <div className='flex flex-col justify-center items-center min-h-[500px] bg-white dark:bg-slate-900 max-w-md w-[90%] m-auto border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl shadow-slate-300/50 dark:shadow-slate-950/50 dark:text-slate-100 my-25'>
      <h1 className='text-3xl dark:text-slate-100 font-bold mb-4'>Signup</h1>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input type='text' placeholder='Enter name' value={name} onChange={(e)=>{setName(e.target.value)}} className=' mb-4 border-2 border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition p-2 text-xl'/>
          <input type="email" placeholder="Email" className='mb-4 border-2 border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition p-2 text-xl' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className='mb-4 border-2 border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition p-2 text-xl' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className='bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold py-2 px-4  rounded-lg shadow-md'>
         Register
        </button>
        <p className='mt-4 text-center text-slate-600 dark:text-slate-300'>Already Registered</p>
        <Link to="/login" className='font-bold text-sky-600 dark:text-blue-400 hover:text-sky-500 dark:hover:text-cyan-200 transition-colors text-center rounded-lg'>Login</Link>

      </form>
    </div>
  )
}

export default Signup