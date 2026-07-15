import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <>
    <div className="flex flex-col min-h-screen bg-[#f7f4ee]
     text-[#1A202C] dark:bg-slate-900 dark:text-slate-100">
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