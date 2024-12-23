import React from 'react'
import AddnewInterview from './_components/AddnewInterview'
function DashboardLayout() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-500'>Create and Start your AI mockup Interview</h2>
    <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
    <AddnewInterview/>
      </div>
    </div>
    
  )
}

export default DashboardLayout