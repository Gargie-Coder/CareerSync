import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <>
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden ">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8 w-full">
        {children}  
      </main>
       
    </div>
    <Footer/>
    </>
  )
}

export default Layout