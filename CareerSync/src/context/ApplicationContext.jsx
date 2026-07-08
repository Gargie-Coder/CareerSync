import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { subscribeToApplications } from '../services/addApplications'
const ApplicationsContext = createContext()

export const useApplications = () => {//a shortcut function to directly use the context without having to import useContext and ApplicationsContext every time,
  //We're wrapping that inside our own function, called useApplications, purely so that anywhere else in your app, instead of writing useContext(ApplicationsContext) every single time (which requires remembering to import ApplicationsContext itself everywhere), you just write useApplications().
  return useContext(ApplicationsContext)
}
  export const ApplicationsProvider = ({ children }) => {
  const { user } = useAuth()  // ✅ now correctly inside a component
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return
    const unsubscribe = subscribeToApplications(user.uid, (data) => {
      setApplications(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user?.uid])

  const value = { applications, loading }

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  )
}
