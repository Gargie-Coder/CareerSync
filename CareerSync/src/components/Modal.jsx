import React, { useState,useEffect } from 'react'
import {STATUS_LABELS} from '../constants/status'
const Modal = ({ isOpen, onClose,onAddApplication,
  editingApp,onUpdateApplication
 }) => {
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    date: "",
    notes: "",
    status:""
  })
 
  useEffect(() => {
  if (editingApp) {
    setFormData({
      company: editingApp.company,
      role: editingApp.role,
      location: editingApp.location,
      salary: editingApp.salary,
      date: editingApp.date,
      notes: editingApp.notes,
      status: editingApp.status,
    })
  } else {
    setFormData({
      company: "",
      role: "",
      location: "",
      salary: "",
      date: "",
      notes: "",
      status: "",
    })
  }
}, [editingApp])
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
   
  }

  const handleSubmit = async (e) => {
    e.preventDefault()// Prevent the default form submission behavio
   const newErrors = validateForm()
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }
  setErrors({})
   if (editingApp) {
     await onUpdateApplication(editingApp.id, formData)
   } else {
     await onAddApplication(formData)
   } 
   setFormData({
     company: "",
     role: "",
     location: "",
     salary: "",
     date: "",
     notes: "",
     status: "",
   })// Reset form data after submission
   onClose()
 }


 const validateForm = () => {
  const requiredFields = ["company", "role", "status", "date"]
  const newErrors = {}

  requiredFields.forEach((field) => {
    if (formData[field] === "") {
      newErrors[field] = `${field} is required`
    }
  })

  return newErrors
}
  
  return (
    <>
      {!isOpen ? null : (
        <div className='fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50' onClick={onClose}>
          <div className=' bg-amber-50 w-[600px]  text-black p-6 flex flex-col justify-center items-center rounded-xl' onClick={(e) => e.stopPropagation()}>
            
            <button className='font-bold text-red-500 text-2xl place-self-end mb-2' onClick={() => {
              onClose()
            }}>X</button>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
              <h1 className='text-3xl font-bold text-blue-800 pb-4 text-start'>Apply Now and Track later</h1>
              
              {/* Row 1: Company Name & Role Title */}
              <div className="flex gap-4 w-full">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    name="company" 
                    value={formData.company} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2" 
                    placeholder="e.g. Google" 
                  />
                   {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2" 
                    placeholder="e.g. Software Engineer" 
                  />
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>
              </div>

              {/* Row 2: Location & Salary-Range */}
              <div className="flex gap-4 w-full">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2" 
                    placeholder="e.g. San Francisco" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary-Range</label>
                  <input 
                    type="text" 
                    name="salary" 
                    value={formData.salary} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg p-2" 
                    placeholder="e.g. Rs.50000-Rs.100000" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select status</option>
                  {STATUS_LABELS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>

              {/* Row 3: Applied Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-2" 
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              {/* Row 4: Notes / Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange}
                  rows="4" 
                  className="w-full p-2 border border-gray-300 rounded-lg" 
                  placeholder="Type your long message here... (Enter creates a new line)">
                </textarea>
              </div>

              <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg mt-2 font-medium hover:bg-blue-700 transition-colors">
                Save Application
              </button>
            </form>
           
          </div>
        </div>
      )}
    </>
  )
}

export default Modal