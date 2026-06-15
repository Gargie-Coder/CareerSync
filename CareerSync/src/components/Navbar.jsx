import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/CareerSynclogo.png'

const Navbar = () => {
  return (
    <div className='flex flex-row justify-evenly items-center bg-blue-400 p-4 text-3xl font-bold text-white'>
      <Link to ={"/"} className='hover:bg-blue-700'>
      <img src={logo} alt='CareerSync' className='h-10 w-10'/>
      </Link>
      <Link to={"/"} className='hover:text-blue-700'>Dashboard</Link>
      <Link to={"/login"} className='hover:text-blue-700'>Login</Link>
      <Link to={"/signup"} className='hover:text-blue-700'>Signup</Link>
    </div>
  )
}

export default Navbar