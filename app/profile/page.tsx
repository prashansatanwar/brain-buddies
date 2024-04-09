"use client"

import type { User } from '../../models/User';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore';
import { Alert } from "@mui/material";
import Loading from '@/components/Loading';

export default function Profile() {
    const session = useSession();

    const { user, updateUser, fetchStatus } = useUserStore();

    const [currUser, setCurrUser] = useState(user);

    const [isEditing, setIsEditing] = useState(false);
    const [editField, setEditField] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    function edit(param: string) {
        setIsEditing(true);
        setEditField(param);
    }

    function handleCancel() {
        setIsEditing(false);
        setCurrUser(user);
        setEditField("");
        
    }

    async function handleSave(param: string) {
        setIsEditing(false);

        if(currUser) {
            const value = currUser.hasOwnProperty(param) ? currUser[param as keyof User] : null;
            const updates = value ? { [param]: value } : {};
            updateUser(currUser.id, updates);
        }
    }
    
    
    useEffect(() => {
        if (session.status === "loading" || fetchStatus == "fetching") {
          setIsLoading(true);
        } 
        else {
          setIsLoading(false);
        }

        setCurrUser(user);
    }, [session.status, fetchStatus, user]);

    return (

        <>
            {isLoading
                ? <Loading/>
                : <div className='p-4 pt-16 h-screen w-full flex items-center justify-center'>
                    {(currUser && (!currUser.username || !currUser.codeforcesHandle)) &&
                        <div className=''> 
                            <Alert severity="error" className="absolute bottom-4 left-4"> Create a username and add your codeforces handle to continue </Alert> 
                        </div> 
                    }
                    {currUser &&
                        <div className='bg-gray-700 w-4/5 h-2/3 flex flex-col p-4 rounded-lg'>
        
                            <div className='w-52 md:w-1/4 xl:w-1/5 md:ml-8 mt-4 absolute z-10 flex items-center'>
                                <img src={currUser.picture} className='w-4/5 aspect-square rounded-lg border-2 ' alt={currUser.username || ""}/>
                            </div>
        
                            <div className='h-1/3'></div>
        
                            <div className='h-2/3 w-full bg-gray-300 text-left flex rounded-lg'>
        
                                <form className='md:w-2/3 md:ml-auto m-4 h-[90%] p-4 grid bg-gray-700 rounded-lg'>
        
                                    <div className='grid grid-cols-8 gap-2'>
                                        <span className='col-span-2 p-2'>Name</span>
                                        <span className='col-span-5 p-2'> 
                                            {isEditing && editField == "name" ? (
                                                <div className=''>
                                                    <input className='p-2 border-2 rounded' type='text' value={currUser.name} 
                                                            onChange={(e) => setCurrUser({ ...currUser, name: e.target.value })}/>
                                                    
                                                    <div className='p-2'>
                                                        <span className='bg-green-700 hover:cursor-pointer rounded px-2 py-1 mr-2' onClick={() => handleSave("name")}>Save</span>
                                                        <span className='bg-gray-600 hover:cursor-pointer rounded px-2 py-1' onClick={handleCancel}>Cancel</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className='flex-grow'>{currUser.name}</span>
                                            )}
                                        </span>
                                        {/* <span onClick={() => edit("name")} className='text-blue-500 p-2 hover:cursor-pointer'>Edit</span> */}
                                    </div>
        
                                    <div className='grid grid-cols-8 gap-2'>
                                        <span className='col-span-2 p-2'>Email</span>
                                        <span className='col-span-5 p-2'> 
                                            {isEditing && editField == "email" ? (
                                                <div className=''>
                                                    <input className='p-2 border-2 rounded' type='text' value={currUser.email} 
                                                            onChange={(e) => setCurrUser({ ...currUser, email: e.target.value })}/>
                                                    
                                                    <div className='p-2'>
                                                        <span className='bg-green-700 hover:cursor-pointer rounded px-2 py-1 mr-2' onClick={() => handleSave("email")}>Save</span>
                                                        <span className='bg-gray-600 hover:cursor-pointer rounded px-2 py-1' onClick={handleCancel}>Cancel</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className='flex-grow'>{currUser.email}</span>
                                            )}
                                        </span>
                                        {/* <span onClick={() => edit("email")} className='text-blue-500 p-2 hover:cursor-pointer'>Edit</span> */}
                                    </div>
        
        
                                    <div className='grid grid-cols-8 gap-2'>
                                        <span className='col-span-2 p-2'>Username {!currUser.username && <span className='font-bold text-red-400'> * </span>}</span>
                                        <span className='col-span-5 p-2'> 
                                            {isEditing && editField == "username" ? (
                                                <div className=''>
                                                    <input className='p-2 border-2 rounded' type='text' value={currUser.username || ""} 
                                                            onChange={(e) => setCurrUser({ ...currUser, username: e.target.value })}/>
                                                    
                                                    <div className='p-2'>
                                                        <span className='bg-green-700 hover:cursor-pointer rounded px-2 py-1 mr-2' onClick={() => handleSave("username")}>Save</span>
                                                        <span className='bg-gray-600 hover:cursor-pointer rounded px-2 py-1' onClick={handleCancel}>Cancel</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className='flex-grow'>{currUser.username}</span>
                                            )}
                                        </span>
                                        <span onClick={() => edit("username")} className='text-blue-500 p-2 hover:cursor-pointer'>Edit</span>
                                    </div>
        
        
                                    <div className='grid grid-cols-8 gap-2'>
                                        <span className='col-span-2 p-2'>Codeforces handle  {!currUser.codeforcesHandle && <span className='font-bold text-red-400'> * </span>}  </span>
                                        <span className='col-span-5 p-2'> 
                                            {isEditing && editField == "codeforcesHandle" ? (
                                                <div className=''>
                                                    <input className='p-2 border-2 rounded' type='text' value={currUser.codeforcesHandle || ""} 
                                                            onChange={(e) => setCurrUser({ ...currUser, codeforcesHandle: e.target.value })}/>
                                                    
                                                    <div className='p-2'>
                                                        <span className='bg-green-700 hover:cursor-pointer rounded px-2 py-1 mr-2' onClick={() => handleSave("codeforcesHandle")}>Save</span>
                                                        <span className='bg-gray-600 hover:cursor-pointer rounded px-2 py-1' onClick={handleCancel}>Cancel</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className='flex-grow'>{currUser.codeforcesHandle}</span>
                                            )}
                                        </span>
                                        <span onClick={() => edit("codeforcesHandle")} className='text-blue-500 p-2 hover:cursor-pointer'>Edit</span>
                                    </div>
        
                                </form>
                            </div>
                        </div>
                    }
        
                </div>
            }
        </>
    )
}
