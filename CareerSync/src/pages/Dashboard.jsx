import React, { Fragment, useState ,useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { addApplication,subscribeToApplications,updateApplication,deleteApplication} from '../services/addApplications'
import {CgAdd, CgFilters} from "react-icons/cg"
import {AiOutlineSearch} from "react-icons/ai"
import { Link } from 'react-router-dom';
import Modal from '../components/Modal'
import { STATUS_LABELS,STATUS_COLORS } from '../constants/status'



const Dashboard = () => {
  const {user}=useAuth()
  const [isModalOpen,setModal]=useState(false)
  // Start with an empty array; Firebase will supply the initial data immediately on mount
  const[applications,setApplication]=useState([])
  const[isLoading,setLoading]=useState(true);//default is true since when the page loads it will not have the data
  const [editingApp, setEditingApp] = useState(null)
  const[searchQuery,setSearchQuery]=useState("")
  const [statusFilter, setStatusFilter] = useState("")
 

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
  const filteredApplications=applications.filter((app)=>{
    return app.company.toLowerCase().includes(searchQuery.toLowerCase()) && (statusFilter ? app.status === statusFilter : true)
  })//here we are filtering the applications based on the search query and status filter. If the status filter is empty, we include all statuses,because it is a ternary operator that checks if statusFilter is truthy. If it is, we check if the application's status matches the filter; if not, we include all applications regardless of their status.

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
    <div className='w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] pl-15 pr-15'>
      <div className="max-w-7xl mx-auto">
        <div className="pb-10">
          <h1 className='text-amber-100 text-left font-bold text-4xl pb-2'>Welcome✨</h1>
          <span className='text-blue-100 text-lg italic font-serif pl-2'>{user.email}</span>
        </div>
      <div className=' flex justify-between items-center mb-6'>
       
        
        <button  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transition" onClick={()=>{setModal(true)
          console.log(isModalOpen)
        }}>
         <CgAdd className="text-xl"/>Add Application
        </button>  
                  <div className="flex items-center p-2  rounded-full text-center border-2 border-amber-100 bg-gray-600 text-white hover:bg-gray-500
focus-within:ring-2 focus-within:ring-blue-300">
                    <AiOutlineSearch className="text-2xl mr-2"/>
                    <input type='text' value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value)}} className="bg-gray-600 text-white placeholder-gray-100 outline-none text-xl flex-1" placeholder="Search applications..."/>
                  </div>
                  <div className="flex items-center p-2  rounded-full text-center border-2 border-amber-100 bg-slate-600 text-white hover:bg-slate-500
focus-within:ring-2 focus-within:ring-blue-300">
                    <CgFilters className="text-2xl mr-2"/>
                    <select className="bg-gray-600 text-white placeholder-gray-100 outline-none text-xl flex-1" onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                      <option value="">Sort by Status</option>
                      {STATUS_LABELS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
        
                   
      </div>
       <Modal isOpen={isModalOpen} onClose={() => {setModal(false); setEditingApp(null)}} onAddApplication={handleAddApplication} onUpdateApplication={handleUpdateApplication}  editingApp={editingApp}/>
         
      <div className='pt-4 p-4 bg-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        
        
        {applications.length===0?
        (<p className="text-gray-400 text-center w-full mt-8">
          No applications found. Click "Add Application" to create your first one.
        </p>)
        :
      (filteredApplications.length===0?
      <p className="text-gray-400 text-center w-full mt-8">
        No applications found for "{searchQuery}". Try a different search term or add a new application.
      </p>
        
      :filteredApplications.map((app) => (
           <div key={app.id} className=' card  bg-gray-100 border rounded-r-4xl transform transition duration-300 ease-in-out hover:scale-105 p-4  shadow-cyan-300 shadow-lg'>
         <h3 className='text-blue-800 text-2xl text-center font-bold'>{app.company}</h3> 
         <p className='text-gray-800 text-center pb-4'>{app.role}</p>
         <p className='text-blue-500 mb-4'>Date Applied: <span className='text-blue-900'>{app.date}</span></p>
        
          <span className={`font-semibold rounded-full ${STATUS_COLORS[app.status]}  text-sm px-3 py-1.5 mr-2 mb-2`}>
            {app.status}
          </span>
       
         <div className="mt-5 flex gap-2">
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
          
        
        </div>
      
      )))}
    </div> 
      </div>
       
        </div>
     
    </Fragment>
}
      
    </>
  )
}

export default Dashboard