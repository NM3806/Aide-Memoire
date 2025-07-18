import Image from 'next/image'
import React from 'react'

function Logo() {
  return (
    <div>
        <Image src={'/logo.png'} alt='logo'
        width={150} height={150}/>
    </div>
  )
}

export default Logo