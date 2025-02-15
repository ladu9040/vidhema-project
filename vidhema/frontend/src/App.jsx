import React from 'react'
import LoginForm from './Auth/Login'
import Forgot_Password from './Auth/Forgot_Password'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './Auth/Signup'
import Main from './User_Management/Main'
import Home from './User_Management/Home'
import EmailVerification from './Auth/EmailVerification'
import Update_Password from './Auth/Update_Password'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/verify/:token" element={<EmailVerification />} />
        <Route path='/update-password' element={<Update_Password/>}/>
        <Route path='/main' element={<Main/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<Forgot_Password />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
