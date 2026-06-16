// src/App.jsx
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import Notfound from './pages/Notfound'

function App() {
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="*" element={<Notfound />} />
      </Routes>
     
    </Layout>
    </BrowserRouter>
  )
}

export default App