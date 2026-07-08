// src/App.jsx
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import Notfound from './pages/Notfound'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { Home } from './pages/Home'
import Analytics from './pages/Analytics'
import { ApplicationsProvider } from './context/ApplicationContext'

function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
    <ApplicationsProvider>
      <Layout>
      <Routes>
        <Route path="/" element={
         <Home />} />
        <Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/analytics" element={
  <ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/login" element=
        {<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={
          <PublicRoute><Signup /></PublicRoute>} />
         <Route path="*" element={<Notfound />} />
      </Routes>
     
    </Layout>
    </ApplicationsProvider>
    </AuthProvider>
    
    </BrowserRouter>
  )
}

export default App