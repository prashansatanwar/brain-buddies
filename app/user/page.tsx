"use client"

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore';
import Loading from '@/components/Loading';

export default function Users() {
  const session = useSession();
  const [fetch, setFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { allUsers, updateUser, user, fetchAllUsers, fetchStatus} = useUserStore()
  
  useEffect(() => {
    if(fetch) {
      fetchAllUsers();
      setFetch(false);
    }
  }, [fetch, fetchAllUsers]);

  useEffect(() => {
    if (session.status === "loading" || fetchStatus == "fetching") {
      setIsLoading(true);
    } 
    else {
      setIsLoading(false);
    }
  }, [session.status,fetchStatus]);

  async function handleConnect(Otherid: string) {
    const userBuddies = user?.buddies;
    if(user && !userBuddies?.includes(Otherid) && Otherid != user.id) {
      const updatedBuddies = userBuddies ? [...userBuddies, Otherid] : [Otherid]
      const updates = {buddies: updatedBuddies}
      updateUser(user.id,updates);
    }

  }

  function handleRefresh() {
    setFetch(true);
  }


  return (
    <>
      {isLoading
        ? <Loading/>
        : <div className='p-4 pt-16'>

            {allUsers && allUsers.length>0 && 
              <>
                <div className='p-2 py-4 my-8 text-5xl font-semibold'>Community</div>
        
                <div className='w-full text-left bg-gray-700 p-4 rounded-lg border-2 border-black flex flex-col'>
        
                  <div className="ml-auto flex text-sm mb-2 p-1 bg-gray-500 rounded-md hover:cursor-pointer hover:shadow-lg" onClick={handleRefresh}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                      </svg>
                      <span className="pl-1">
                          Refresh
                      </span>
                  </div>
        
                  
                  <table className='w-full'>
                    <thead>
                      
                    </thead>
        
                    <tbody className='py-6'>
                      {allUsers.map(u => (
                        <tr key={u.id}>
                          <td><img src={u.picture.toString()} className='h-6 rounded' alt={u.username || ""}/></td>
                          <td className='hover:cursor-pointer'>{u.name}</td>
                          <td>{u.username || " undefined "}</td>
                          <td>
                            {
                              u.id == user!.id 
                                ? <></>
                                : <>
                                  { user?.buddies?.includes(u.id)
                                    ? <button className='bg-blue-800 p-1 px-3 rounded-lg bg-gray-600 cursor-' onClick={() => handleConnect(u.id)} disabled={true}> connect </button>
                                    : <button className='bg-blue-800 p-1 px-3 rounded-lg' onClick={() => handleConnect(u.id)} disabled={false}> connect </button>
        
                                  }
                                  </>
                                
                                
                            }
                          </td>
                          
                        </tr>
                      ))}
        
                    </tbody>
                    
                  </table>
                </div>
              </>
            }
      
      
          </div>
          }
    </>
  )
  
}