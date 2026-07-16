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
    <div className='max-w-10xl flex flex-wrap justify-between gap-4 px-6 py-3 items-center backdrop-blur-md bg-white/40 border-b border-slate-200/60 text-blue-700 dark:bg-slate-900/70 dark:border-slate-700/60 dark:backdrop-blur-md dark:text-slate-50 text-2xl sticky top-0 z-50 shadow-sm dark:shadow-black/30'>
      <div className='ml-4'>
        <Link to ={"/"} className='text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 bg-clip-text text-transparent transition-opacity hover:opacity-80'>
      CareerSync
      </Link>
      
      </div>
      <div className='flex flex-wrap items-center gap-4 text-blue-700 font-semibold dark:text-slate-200 mr-4 text-base md:text-lg'>
        {user?(
          <div className='flex flex-wrap items-center gap-4 mr-4'>
          <Link to={"/dashboard"} className='transition-colors hover:text-sky-500 dark:hover:text-sky-400'>Dashboard</Link>
          <Link to={"/analytics"} className='transition-colors hover:text-sky-500 dark:hover:text-sky-400'>Analytics</Link>
          <button onClick={logout} className='transition-colors bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 rounded-full px-4 py-1.5 text-white shadow-sm'>Logout</button>
          <button onClick={toggleTheme} className='p-2 rounded-full transition-colors hover:bg-slate-200/60 dark:hover:bg-slate-700/60'>{theme==="dark"?(<CgSun/>
    ):(<CgMoon/>)}
      </button>
          </div>
        ):(

          <div className='flex flex-wrap items-center gap-4 mr-4'>
            <Link to={"/"} className='transition-colors hover:text-sky-500 dark:hover:text-sky-400'>Home</Link>
            <Link to={"/login"} className='transition-colors hover:text-sky-500 dark:hover:text-sky-400'>Login</Link>
            <Link className='transition-colors bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 rounded-full px-4 py-1.5 text-white shadow-sm' to={"/signup"} >Signup</Link>
            <button onClick={toggleTheme} className='p-2 rounded-full transition-colors hover:bg-slate-200/60 dark:hover:bg-slate-700/60'>{theme==="dark"?(<CgSun/>
    ):(<CgMoon/>)}
      </button>
          </div>
)}
      </div>
    </div>
  )
}

export default Navbar