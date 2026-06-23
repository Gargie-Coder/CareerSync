import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import  initialdata  from '../utils/data'
import {CgAdd} from "react-icons/cg"
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const {user}=useAuth()
  const [isModalOpen,setModal]=useState(false)

  const[applications,setApplication]=useState(initialdata)
    return (
    <div className='w-full min-h-screen bg-slate-700 p-6 pt-12'>
      <h1 className='text-cyan-300 text-left font-bold text-3xl'>DashBoard</h1>
      <span className='text-blue-100 text-lg italic font-serif'>Welcome,{user.email}</span>
      
        <button  className=' flex items-center p-2 w-50 rounded-md text-center bg-blue-400 text-white hover:bg-red-500 text-2xl' onClick={()=>{setModal(!isModalOpen)
          console.log(isModalOpen)
        }}>
         <CgAdd className="text-5xl"/>Add Application
        </button>
        {isModalOpen?(<p text-white>The modal will open here</p>
          ):null}
      <div className='pt-4 p-4 bg-gray-800 flex flex-wrap gap-4'>
      {applications.map((app) => (

           <div key={app.id} className=' card h-50 w-50 bg-gray-100 border rounded-lg transform transition duration-300 ease-in-out hover:scale-105 p-4 rounded shadow-cyan-300 shadow-md'>
         <h3 className='text-blue-800 text-2xl text-center font-bold'>{app.company}</h3> 
         <p className='text-gray-800 text-center pb-4'>{app.role}</p>
         <p className='text-blue-500'>Date Applied: <span className='text-blue-900'>{app.date}</span></p>
         <p className='text-blue-500'>
          <span className='text-blue-900'>Status: {app.status}</span></p>
        </div>
      
      ))}
    </div>
        
         
       
     


        
      
        
       
        </div>
     
    
  )
}

export default Dashboard