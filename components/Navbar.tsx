"use client"

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react'


function Navbar() {
  const session = useSession();
  const [open, setOpen] = useState(false);

  function toggleMenu() {
    setOpen(!open);
  }

  if(session.status == "authenticated") {
    return (
      <div className='z-20 fixed h-14 w-full flex items-center bg-[#161A1E] p-4 text-sm'>
        <Link href={'/'} className='pr-4 font-semibold border-r-2'>Brain Buddies</Link>
        {/* <span className='ml-auto'> */}
          <Link href={'/'} className='px-2 pl-4'> Home </Link>
          {/* <Link href={''} className='px-2'> Buddies </Link> */}
          <Link href={'/myquestions'} className='px-2'> My questions </Link>
          <Link href={'/user'} className='px-2'> Connect </Link>
        {/* </span> */}
        <span className='ml-auto pl-4'>
          <img src={session?.data?.user?.image?.toString()} referrerPolicy="no-referrer" alt=''
                className='h-9 rounded-[100%] border-2 border-gray-500 hover:border-gray-300 hover:cursor-pointer hover:shadow-sm'
                onClick={toggleMenu}/> 
          {open &&
            <div className='absolute z-10 right-0 mt-3 mx-4 text-center shadow-lg'> 
              <div className='h-0 w-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 ml-auto mr-2 border-[#161A1E]'></div>
              <div className='bg-[#161A1E] py-4 shadow-xl rounded-lg'>
                <div className='font-semibold m-2 px-1 border-b-[1px]  '> {session?.data?.user?.name} </div>
                <div className='mt-2 px-2 hover:cursor-pointer hover:bg-gray-600' onClick={() => setOpen(false)}> <Link href={`/user/${session.data.user.id}`}> My profile </Link> </div>
                <div className='px-2 hover:cursor-pointer hover:bg-gray-600' onClick={() => {signOut(); setOpen(false)}}> Sign out </div>
              </div>
            </div>
          }
        </span>
      </div>
    )
  }
}

export default Navbar