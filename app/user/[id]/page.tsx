"use client"

import type { User } from '@/models/User';
import { useUserStore } from '@/stores/userStore';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading';

export default function User() {
    const session = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { user, fetchStatus } = useUserStore();
    
    useEffect(() => {
        if (session.status === "loading" || fetchStatus == "fetching") {
          setIsLoading(true);
        } 
        else {
          setIsLoading(false);
        }
    }, [session.status, fetchStatus]);

    if (session.status === "authenticated") {
        return (
            <>
                {isLoading
                    ? <Loading/>
                    : <div className='p-4 pt-16 min-h-screen w-full'>
                        {user &&
                            <div className='flex min-h-full'>
                                <div className='w-1/4 my-4 mx-2 px-2 py-4 bg-gray-700 rounded-lg flex flex-col'>
                                    <div className='w-full my-2 flex justify-center'>
                                        <img src={user.picture} className='w-3/4 aspect-square rounded-md' alt={user.username || ""}/>
                                    </div>
        
                                    <div className='w-full my-2 text-center font-semibold text-xl'>
                                        {user.name}
                                    </div>
        
                                    {
                                        session.data.user.id == user.id &&
        
                                        <button className='my-2 mx-2 p-2 text-center bg-green-400 rounded-lg bg-opacity-10 text-green-400' onClick={() => {router.push("/profile"); router.refresh()}}>
                                            Edit profile
                                        </button>
                                    }
                                </div>
                                <div className='w-3/4 my-4 mx-2 px-2 py-6 bg-gray-700 rounded-lg'>
        
                                </div>
                            </div>
                        }
                    </div>
                }
            </>
        )
    } 
}