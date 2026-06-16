import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handleSubmit=(e)=>{
    e.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
  }
  return (
    <div className='flex flex-col justify-center items-center h-[500px]  bg-gray-100 w-100 m-auto border-2 border-gray-300 rounded-lg shadow-lg text-blue-500 my-25'>
      <h1 className='text-3xl text-black font-bold mb-4'>Login</h1>
      <form className='flex flex-col w-80' onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className='mb-4 p-2 border 2 border-gray-300 rounded-lg shadow-md' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className='mb-4 p-2 border 2 border-gray-300 rounded-lg shadow-md' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className='bg-blue-500 border 2 border-blue-300 rounder-lg shadow-md hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Login
        </button>
        <p className='my-4 text-center text-gray-600'>Don't have account,<Link to="/signup" className='text-blue-500 hover:text-blue-700'>Signup</Link></p>
      </form>

    </div>
  )
}

export default Login