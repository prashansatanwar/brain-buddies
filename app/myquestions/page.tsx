"use client"

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore';
import { Alert } from "@mui/material";
import Loading from '@/components/Loading';

export default function MyQuestions() {
    const session = useSession();
    const [fetch, setFetch] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { myQuestions, user, fetchMyQuestions, fetchStatus} = useUserStore();

    useEffect(() => {
        if(fetch && user) {
            fetchMyQuestions(user.codeforcesHandle||"");
            setFetch(false);
        }
    }, [fetch, user, fetchMyQuestions]);

    useEffect(() => {
        if (session.status === "loading" || fetchStatus == "fetching") {
          setIsLoading(true);
        } 
        else {
          setIsLoading(false);
        }
      }, [session.status, fetchStatus]);
    
    function handleRefresh() {
        setFetch(true);
    }

    if(session.status === "authenticated") {

        return (
            <>
                {isLoading
                    ? <Loading/>
                    : <div className='p-4 pt-16'>

                        {(!user || !user.username || !user.codeforcesHandle) 
                            ? <div className=''> 
                                <Alert severity="error" className="absolute bottom-4 left-4"> Update user details to view </Alert> 
                            </div> 
                            : <>
                                {myQuestions && myQuestions.length > 0 
                                ? <div className='bg-gray-700 rounded-lg p-4 m-4 flex flex-col '>
        
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
                                                <tr>
                                                    <th>Question</th>
                                                    <th>Tags</th>
                                                    <th>Language Submitted</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myQuestions.map((d,ind) => ( 
                                                    <tr key={ind}>
                                                        <td> 
                                                            <a href={`http://codeforces.com/problemset/problem/${d.problem.contestId}/${d.problem.index}`} target="_blank" rel="noopener noreferrer"
                                                                className='underline hover:text-blue-300'>{d.problem.contestId}{d.problem.index} {d.problem.name} </a> 
                                                        </td>
                                                        <td> {d.problem.tags.join(", ")} </td>
                                                        <td> {d.programmingLanguage} </td>
                                                        <td> 
                                                            {d.verdict == "OK" 
                                                            ? <span className='font-bold text-green-600'> ACCEPTED </span> 
                                                            : <span className='font-bold text-red-600'> {d.verdict} </span> } 
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                </div>
                                : <div>
                                    
                                </div> 
                                }
                            </>
                            }
                        </div>
                        }
            </>






            
        )
    }

}