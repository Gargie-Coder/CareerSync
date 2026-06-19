import React from 'react'
import { Link } from 'react-router-dom'



const Navbar = () => {
  
  return (
    <div className='max-w-10xl flex flex-wrap justify-between gap-4 px-6 py-4 items-center bg-slate-900 h-32 text-2xl  sticky top-0 z-50 shadow-md'>
      <div className='ml-4'>
        <Link to ={"/"} className='bg-gray-100 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to violet-500 bg-clip-text text-transparent'>
      CareerSync
      </Link>
      </div>
      <div className='flex flex-wrap items-center gap-3 text-slate-200 mr-4'>
        <Link to={"/"} className='hover:text-blue-200'>Dashboard</Link>
      <Link to={"/login"} className='hover:text-blue-200'>Login</Link>
      <button className='hover:bg-slate-300 hover:text-blue-500 border border-blue-600 border bg-blue-500 rounded-full p-2  text-white'>
        <Link to={"/signup"} >Signup</Link>
      </button>
      
      </div>
      <button className='hover:bg-slate-300 hover:text-blue-500 border border-blue-600 border bg-blue-500 rounded-full p-2  text-white'>
        Put Data
      </button>
    </div>
  )
}

export default Navbar