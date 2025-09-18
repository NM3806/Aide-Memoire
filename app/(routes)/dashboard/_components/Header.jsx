"use client"
import Logo from '@/app/_components/Logo'
import { db } from '@/config/firebaseConfig';
import { OrganizationSwitcher, useAuth, UserButton, useUser } from '@clerk/nextjs'
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect } from 'react'

function Header() {
  const { orgId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    user && saveUserData();
  }, [user])

  const saveUserData = async () => {
    const docId = user?.primaryEmailAddress?.emailAddress;
    try {
      await setDoc(doc(db, 'AMUser', docId), {
        name: user?.fullName,
        avatar: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
      })
    }
    catch (e) {

    }
  }

  return (
    <div className='flex justify-between items-center p-1 shadow-sm'>
      <Link href="/dashboard" className='cursor-pointer'>
        <Logo />
      </Link>
      <OrganizationSwitcher
        afterCreateOrganizationUrl={'/dashboard'}
        afterLeaveOrganizationUrl={'/dashboard'}
      />
      <UserButton />
    </div>
  )
}

export default Header