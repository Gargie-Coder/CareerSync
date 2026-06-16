import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  const [name,setname]=useState("");
  const handleSubmit=(e)=>{
    e.preventDefault()
    console.log("Name:",name)
    console.log("Email:", email)
    console.log("Password:", password)
  }
  return (
    <div className='flex flex-col justify-center items-center h-[500px]  bg-gray-100 w-100 m-auto border-2 border-gray-300 rounded-lg shadow-lg text-blue-500 my-25'>
      <h1 className='text-3xl text-black font-bold mb-4'>Signup</h1>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input type='text' placeholder='Enter name' value={name} onChange={(e)=>{setname(e.target.value)}} className=' border 2 border-gray-300 rounded-lg shadow-md p-2 text-xl mb-4'/>
          <input type="email" placeholder="Email" className='mb-4 p-2 border 2 border-gray-300 rounded-lg shadow-md p-2 text-xl' value={email} onChange={(e) => setemail(e.target.value)} />
        <input type="password" placeholder="Password" className='mb-4 p-2 border 2 border-gray-300 rounded-lg shadow-md p-2 text-xl' value={password} onChange={(e) => setpassword(e.target.value)} />
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