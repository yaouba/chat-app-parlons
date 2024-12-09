import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore'

import { Toaster } from 'react-hot-toast'

import { Loader } from 'lucide-react'
import { use } from 'react'

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  
  return (
    <div>
        <Navbar />

        <Routes>
          <Route path='/' element={ user ? <HomePage /> : <Navigate to='/login' />} />
          <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to='/login' />} />
          <Route path='/settings' element={<SettingsPage />} />

        </Routes>

        <Toaster />
    </div>
  )
}

export default App