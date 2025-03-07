
import React, { useContext, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Login } from './components/createAccount/Login'
import  Navbar  from './components/Navbar'
import Register from './components/createAccount/Register'
import { Dashboard } from './components/Dashboard'
import { DContext } from './context/Datacontext'
import { Createdevice } from './components/Admin/Createdevice'
import { Updatedata } from './components/Admin/Updatedata'
import { Chartdevice } from './components/Admin/Chartdevice'
import Loading from './components/Loading'
import { UserInfo } from './components/Admin/UserInfo'
import UserDetails from './components/Admin/UserDetails'



export const App = () => {

  const {Auth}=useContext(DContext)

   console.log("Auth",Auth)



  if(Auth===null){
    return <Loading/>
  }


  return (
    <div>

     <Navbar/>

   
    <Routes>
      <Route path='/' element={Auth!==false ? <Dashboard/> : <Login/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/create-account' element={<Register/>}></Route>
      <Route path='/create-device' element={<Createdevice/>}></Route>
      <Route path='/device/:rangeid' element={<Updatedata/>}></Route>
      <Route path='/Chart-data/:chartid' element={<Chartdevice/>}></Route>
      {/* <Route path='/VoltagePredictor' element={<VoltagePredictor/>}></Route> */}
      <Route path='/UserInfo' element={<UserInfo/>}></Route>
      <Route path='/user/:id' element={<UserDetails/>}></Route>
    
    </Routes>

    

    </div>
  )
}
