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
    <div className='flex flex-col justify-center items-center h-[500px]  bg-slate-900 w-100 m-auto border-2 border-gray-300 rounded-lg shadow-xl shadow-slate-500 text-slate-100 my-25'>
      <h1 className='text-3xl text-slate-100 font-bold mb-4'>Signup</h1>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input type='text' placeholder='Enter name' value={name} onChange={(e)=>{setName(e.target.value)}} className=' border-2 border-gray-300 rounded-lg shadow-md p-2 text-xl mb-4'/>
          <input type="email" placeholder="Email" className='mb-4 border-2 border-gray-300 rounded-lg shadow-md p-2 text-xl' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className='mb-4 border-2 border-gray-300 rounded-lg shadow-md p-2 text-xl' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  border-2 border-blue-500 rounded-lg shadow-md'>
         Register
        </button>
        <p className='mt-4 text-center'>Already Registered</p>
        <Link to="/login" className='font-bold hover:text-blue-300 text-center border-2 border-blue-500 rounded-lg shadow-md'>Login</Link>

      </form>
    </div>
  )
}

export default Signup