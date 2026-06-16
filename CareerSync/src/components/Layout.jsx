import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl p-4 mx-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout