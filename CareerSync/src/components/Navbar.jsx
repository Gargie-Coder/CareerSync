import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/CareerSynclogo.png'

const Navbar = () => {
  return (
    <div className='flex flex-row justify-evenly items-center bg-gray-100 p-4 text-3xl font-bold text-blue-500'>
      <Link to ={"/"} className='bg-gray-100 hover:bg-blue-700'>
      <img src={logo} alt='CareerSync' className='h-30 w-50'/>
      </Link>
      <Link to={"/"} className='hover:text-blue-700'>Dashboard</Link>
      <Link to={"/login"} className='hover:text-blue-700'>Login</Link>
      <Link to={"/signup"} className='hover:text-blue-700'>Signup</Link>
    </div>
  )
}

export default Navbar