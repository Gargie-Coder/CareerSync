import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="max-w-6xl px-4 py-10 mx-auto sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        {children}  
      </main>
    </div>
  )
}

export default Layout