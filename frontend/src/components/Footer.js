import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-slate-200'>
      <div className='container mx-auto p-4'>
       <p className='text-center font-bold'> copyright &copy; {new Date().getFullYear()}  TechBasket Nepal all right reserved . </p>
      </div>
    </footer>
  )
}

export default Footer