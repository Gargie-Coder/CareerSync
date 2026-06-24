import React, { useState } from 'react'

const Modal = ({isOpen,onClose}) => {
  return (<>
    {!isOpen?(null):(
    <div className='fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center' onClick={onClose}>
     
      <div className='bg-amber-100 w-[600px] text-black p-2 flex flex-col justify-center items-center' onClick={(e)=>e.stopPropagation()}>//this is used to stop the bubbling effect caused by the onclose on the outer div and prevent the form to close while click inside the form
         <button className='text-bold text-red-500 text-2xl place-self-end' onClick={()=>{
          onClose()
         }}>X</button>
        <h1 className='text-center'>Modal</h1>
      <p>Modal form will appear here and user will fill the information reagerding there application</p>  
        </div>
    </div>)
    }
    </>
  )
}

export default Modal