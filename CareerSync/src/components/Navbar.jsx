import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Analytics from '../pages/Analytics'
import { CgMoon,CgSun } from 'react-icons/cg'
import { useTheme } from '../context/ThemeContext'
const Navbar = () => {
  const {user,logout}=useAuth()
  const {theme,toggleTheme}=useTheme()
  return (
    <div className='max-w-10xl flex flex-wrap justify-between gap-4 px-6 py-4 items-center bg-slate-200/30 backdrop-blur-md text-blue-600 dark:bg-slate-900/60 dark:backdrop-blur-md dark:text-slate-50 text-2xl sticky top-0 z-50 shadow-white/20 shadow-2xl'>
      <div className='ml-4'>
        <Link to ={"/"} className='bg-gray-100 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent'>
      CareerSync
      </Link>
      
      </div>
      <div className='flex flex-wrap items-center gap-3 text-blue-600 font-semibold dark:text-slate-200 mr-4'>
        {user?(
          <div className='flex flex-wrap items-center gap-3  mr-4'>
          <Link to={"/dashboard"} className='hover:text-blue-200'>Dashboard</Link>
          <Link to={"/analytics"} className='hover:text-blue-200'>Analytics</Link>
          <button onClick={logout} className='hover:bg-slate-300 hover:text-blue-500 border border-blue-600 border bg-blue-500 rounded-full p-2  text-white'>Logout</button>
          <button onClick={toggleTheme}>{theme==="dark"?(<CgSun/>
    ):(<CgMoon/>)}
      </button>
          </div>
        ):(

          <div className='flex flex-wrap items-center gap-3 mr-4'>
            <Link to={"/"} className='hover:text-blue-200'>Home</Link>
            <Link to={"/login"} className='hover:text-blue-200'>Login</Link>
            <Link className='hover:bg-slate-300 hover:text-blue-500 bg-blue-500 rounded-full p-2 text-white' to={"/signup"} >Signup</Link>
            <button onClick={toggleTheme}>{theme==="dark"?(<CgSun/>
    ):(<CgMoon/>)}
      </button>
          </div>
)}
      </div>
    </div>
  )
}

export default Navbar