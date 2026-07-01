import React, { Fragment, useState ,useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { addApplication,subscribeToApplications,updateApplication,deleteApplication} from '../services/addApplications'
import {CgAdd} from "react-icons/cg"
import { Link } from 'react-router-dom';
import Modal from '../components/Modal'


const Dashboard = () => {
  const {user}=useAuth()
  const [isModalOpen,setModal]=useState(false)
  // Start with an empty array; Firebase will supply the initial data immediately on mount
  const[applications,setApplication]=useState([])
  const[isLoading,setLoading]=useState(true);//default is true since when the page loads it will not have the data
  const [editingApp, setEditingApp] = useState(null)

  // Action: Triggered when the Modal form submits a new job application
  const handleAddApplication = async (newApp) => {
    try {
      // 1. Push directly to Firebase. Do NOT manually update local state here!
      await addApplication(user.uid, newApp)
    } catch (error) {
      console.error("Error saving application:", error)
    }
  }
  const handleUpdateApplication = async (appId, updatedData) => {
    try {
      await updateApplication(user.uid, appId, updatedData)
    } catch (error) {
      console.error("Error updating application:", error)
    }
  }

  const handleDeleteApplication = async (appId) => {
    try {
      await deleteApplication(user.uid, appId)
    } catch (error) {
      console.error("Error deleting application:", error)
    }
  }

  // Effect: Sets up the real-time database listener on component mount
   useEffect(()=>{
      if(!user?.uid)return
      const unsubscribe=subscribeToApplications(user.uid,(data) => {
  setApplication(data)
 setLoading(false)
})
      return ()=>unsubscribe
  },[user?.uid])


    return (
      <>
      {isLoading? <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>:
      <Fragment>
    <div className='w-full p-6 pt-12'>
      <div className=' flex justify-between items-center mb-6'>
        <h1 className='text-cyan-300 text-left font-bold text-3xl'>DashBoard</h1>
      <span className='text-blue-100 text-lg italic font-serif'>Welcome,{user.email}</span>
        <button  className=' flex items-center p-2 w-50 rounded-full text-center border-2 border-amber-100 bg-blue-400 text-white hover:bg-red-500 text-2xl' onClick={()=>{setModal(true)
          console.log(isModalOpen)
        }}>
         <CgAdd className="text-5xl"/>Add Application
        </button>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => {setModal(false); setEditingApp(null)}} onAddApplication={handleAddApplication} onUpdateApplication={handleUpdateApplication} onDeleteApplication={handleDeleteApplication} editingApp={editingApp}/>
         
      <div className='pt-4 p-4 bg-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {applications.length===0?
      <p className="text-gray-400 text-center w-full mt-8">
        No applications yet — add your first one!
      </p>
        
      :applications.map((app) => (
           <div key={app.id} className=' card  bg-gray-100 border rounded-lg transform transition duration-300 ease-in-out hover:scale-105 p-4 rounded shadow-cyan-300 shadow-md'>
         <h3 className='text-blue-800 text-2xl text-center font-bold'>{app.company}</h3> 
         <p className='text-gray-800 text-center pb-4'>{app.role}</p>
         <p className='text-blue-500'>Date Applied: <span className='text-blue-900'>{app.date}</span></p>
         <p className='text-blue-500'>
          <span className='text-blue-900'>Status: {app.status}</span></p>
          <button className='bg-blue-500 text-white py-2 px-4 m-2 rounded hover:bg-blue-600' onClick={() => {
            setEditingApp(app)
            setModal(true)
          }}>
            Edit
          </button>
        <button className='bg-red-500 text-white py-2 px-4 m-2 rounded hover:bg-red-600' onClick={() => {
          const confirmed = window.confirm(`Delete application for ${app.company}? This cannot be undone.`)
          if (confirmed) {
            handleDeleteApplication(app.id)
          }
        }}>
          Delete
        </button>
          
        
        </div>
      
      ))}
    </div> 
        </div>
     
    </Fragment>
}
      
    </>
  )
}

export default Dashboard