import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Header from './_components/header'

function Dashboard() {
  return (
    <div className='flex justify-between items-center p-1 shadow-sm'>
      <Header/>

      <UserButton/>
    </div>
  )
}

export default Dashboard