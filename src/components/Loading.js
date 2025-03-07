import React from 'react'
import LoadingGif from '../assets/Logo.png'

function Loading() {
  return (
    <div className='py-3 d-flex justify-content-center align-items-center bg-light' style={{minHeight: '80vh'}}>
      <span className='fw-bolder text-bg-primary p-5 rounded-circle display-1'>EMS</span>
    </div>
  )
}

export default Loading