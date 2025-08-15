import Image from 'next/image'
import React from 'react'

function Logo() {
  return (
    <div>
        <Image src={'/logo.png'} alt='logo' unoptimized
        width={100} height={100} className='rounded-sm'/>
    </div>
  )
}

export default Logo