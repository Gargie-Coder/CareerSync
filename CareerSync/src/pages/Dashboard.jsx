import React, { Fragment, useState ,useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { addApplication,subscribeToApplications,updateApplication,deleteApplication} from '../services/addApplications'
import {CgAdd, CgFilters} from "react-icons/cg"
import { VscChevronDown, VscChevronUp } from "react-icons/vsc"
import {AiOutlineSearch} from "react-icons/ai"
import { Link } from 'react-router-dom';
import Modal from '../components/Modal'
import { STATUS_LABELS,STATUS_COLORS } from '../constants/status'
import { useApplications } from '../context/ApplicationContext'



const Dashboard = () => {
  const {user}=useAuth()
  const [isModalOpen,setModal]=useState(false)
  // Start with an empty array; Firebase will supply the initial data immediately on mount
 //default is true since when the page loads it will not have the data
  const [editingApp, setEditingApp] = useState(null)
  const[searchQuery,setSearchQuery]=useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [expandedId, setExpandedId] = useState(null)
 
const { applications, loading: isLoading } = useApplications()
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
  
    return (
      <>
      {isLoading? <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>:
      <Fragment>
    <div className='w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] pl-15 pr-15'>
      <div className="max-w-8xl mx-auto">
        <div className="pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
  <h1 className='text-slate-800 dark:text-slate-50 text-left font-bold font-sans text-3xl tracking-tight'>Welcome back!👋🏻 {user.displayName}</h1>
  <p className="text-sm text-sky-600 dark:text-slate-400 mt-1">Track, manage, and optimize your application pipeline.</p>
</div>
        
      <div className='flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8'>
       
        <button  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition shadow-md shadow-blue-900/20" onClick={()=>{setModal(true)
          console.log(isModalOpen)
        }}>
         <CgAdd className="text-xl"/>Add Application
        </button>  
                  <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-2xl justify-end">
                    <div className='flex items-center p-2.5 w-full sm:w-72 rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent transition'>
                    <AiOutlineSearch className="text-xl 
                    text-slate-400 
                    dark:text-slate-400 mr-2 shrink-0"/>
                    <input type='text' value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value)}} 
    className="bg-transparent placeholder-slate-400 dark:placeholder-slate-400 outline-none text-sm w-full" 
    placeholder="Search applications..." />
                  </div>
                  <div className="flex items-center p-2.5  rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent transition w-full sm:w-48">
  <CgFilters className="text-xl text-slate-400 dark:text-slate-400 mr-2 shrink-0"/>
  <select 
    className="bg-transparent text-slate-700 dark:text-white text-sm outline-none w-full cursor-pointer appearance-none" 
    onChange={(e) => setStatusFilter(e.target.value)} 
    value={statusFilter}
  >
    <option value="" className="bg-slate-100 dark:bg-slate-800 text-black dark:text-white">All Statuses</option>
    {STATUS_LABELS.map((status) => (
      <option key={status} value={status} className="bg-slate-100 dark:bg-slate-800 text-black dark:text-white">{status}</option>
    ))}
  </select>
</div>
</div>
</div>
       <Modal isOpen={isModalOpen} onClose={() => {setModal(false); setEditingApp(null)}} onAddApplication={handleAddApplication} onUpdateApplication={handleUpdateApplication}  editingApp={editingApp}/>
         
      <div className='pt-4 p-4 items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        
        
        {applications.length===0?
        (<p className="text-sky-600 dark:text-gray-400 text-center w-full mt-8">
          No applications found. Click "Add Application" to create your first one.
        </p>)
        :
      (filteredApplications.length===0?
      <p className="text-sky-600 dark:text-gray-400 text-center w-full mt-8">
        No applications found for "{searchQuery}". Try a different search term or add a new application.
      </p>
        
      :filteredApplications.map((app) => (
           <div key={app.id} className='card bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50  transform transition duration-300 ease-in-out rounded-2xl hover:scale-105 p-5 shadow-black/10 dark:shadow-black/30 shadow-lg flex flex-col justify-between'>
            <div>
            <div className="flex justify-between items-start gap-3 mb-4">
        <h3 className=" text-slate-900 dark:text-white text-xl font-bold font-sans tracking-tight">
          {app.company}
        </h3> 
        <span className={` font-semibold text-xs rounded-full ${STATUS_COLORS[app.status]} px-2.5 py-1 shrink-0`}>
          {app.status}
        </span>
        <button className="p-1 rounded-full transition-colors hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-300" onClick={()=>setExpandedId(expandedId===app.id?null:app.id)}>{expandedId===app.id?(<VscChevronUp/>):(<VscChevronDown/>)}</button>
      </div> 
        <p className="text-sky-600 dark:text-gray-300 text-sm font-medium mb-1">{app.role}</p>
      <p className="text-xs text-slate-400">
        Applied on: <span className=" dark:text-sky-300 font-medium">{app.date}</span>
      </p>
      {expandedId === app.id && (
  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/40 text-sm text-slate-600 dark:text-slate-300 space-y-1">
    <p>Location: <span className="text-slate-900 dark:text-slate-100">{app.location || "Not specified"}</span></p>
    <p>Salary: <span className="text-slate-900 dark:text-slate-100">{app.salary || "Not specified"}</span></p>
    <p>Notes: <span className="text-slate-900 dark:text-slate-100">{app.notes || "No notes"}</span></p>
  </div>
)}
    </div>
          
         <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-700/40 flex justify-end gap-2">
          <button className='text-slate-700 dark:text-slate-300 text-xs  font-medium py-1.5 px-3 m-2 bg-white dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600/40 hover:bg-sky-500 dark:hover:bg-sky-500   hover:text-white rounded-xl transition' onClick={() => {
            setEditingApp(app)
            setModal(true)
          }}>
            Edit
          </button>
        <button className='text-white text-xs font-medium dark:text-red-400 py-1.5 px-3 bg-red-700/60 dark:bg-red-950/20 m-2 border border-red-900/30 hover:bg-red-600 hover:text-white rounded-xl transition' onClick={() => {
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