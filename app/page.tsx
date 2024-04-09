"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUserStore } from '@/stores/userStore';
import { Alert } from "@mui/material";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function Home() {

  const session = useSession();
  const router = useRouter();

  const [fetch, setFetch] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { user, allQuestions, fetchAllQuestions, fetchStatus } = useUserStore()


  useEffect(() => {
    if(fetch && user) {
      fetchAllQuestions({username: user.username||"", codeforcesHandle:user.codeforcesHandle||""}, user.buddies || [])
      setFetch(false);
    }
	}, [fetch, fetchAllQuestions, user]);


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

  if(session.status == "authenticated") {
    return (
      <>
        {isLoading
          ? <Loading/>
          : <div className="p-4 pt-16">
              {(user && (!user.username || !user.codeforcesHandle)) 
                ? <div className=''> 
                    <Alert severity="error" className="absolute bottom-4 left-4"> Update user details to view </Alert> 
                  </div> 
                : <>
                    {user && allQuestions && allQuestions.length > 0 
                      ? <>
                        <div className="p-4 m-4 rounded-lg bg-gray-700 flex flex-col  overflow-x-auto">
    
                          <div className="ml-auto flex text-sm mb-2 p-1 bg-gray-500 rounded-md hover:cursor-pointer hover:shadow-lg" onClick={handleRefresh}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg>
                            <span className="pl-1">
                              Refresh
                            </span>
                          </div>
    
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th> Question </th>
                                <th> Tags </th>
                                <th> Difficulty </th>
                                <th colSpan={(user.buddies?.length||0) + 1}>
                                  Buddies <br/>
                                  <span className="text-sm font-normal grid gap-2" style={{ gridTemplateColumns: `repeat(${(user.buddies?.length || 0) + 1}, 1fr)`}}>
                                    <div className="font-medium text-blue-400">{user.username}</div>
                                    {
                                      user.buddies && user.buddies?.length>0 && (
                                        <>
                                          {allQuestions[0].buddies_verdict.map((b, ind) => (
                                            <div key={ind} className="text-sm font-normal font-medium text-blue-300"> {b.username} </div>
                                            ))}
                                        </>
                                      )
                                    }
                                  </span>
                                </th>
                              </tr>
                            </thead>
    
                            <tbody>
                                  {allQuestions && allQuestions.map((d, idx) => (
                                    <tr key={idx}>
                                      <td>
                                      <a href={d.question_link} target="_blank" rel="noopener noreferrer"
                                        className='underline hover:text-blue-300'>{d.question} </a> 
                                      </td>
                                      <td>{d.tags.join(", ")}</td>
                                      <td>{d.difficulty}</td>
                                      <td colSpan={(user.buddies?.length||0) + 1}>
                                          <span className="text-sm font-normal grid gap-2" style={{ gridTemplateColumns: `repeat(${(user.buddies?.length || 0) + 1}, 1fr)`}}>
                                            <span className="text-sm font-normal flex items-center justify-center">
                                                {d.user_verdict == "OK" 
                                                ? <div className='h-[2em] aspect-square rounded-sm bg-green-600'> </div> 
                                                : d.user_verdict == "Unknown"
                                                  ? <div className='h-[2em] aspect-square rounded-sm bg-yellow-600'>  </div>
                                                  : <div className='h-[2em] aspect-square rounded-sm bg-red-600'> </div>
                                              } 
                                            </span>
                                            {
                                              user.buddies && user.buddies?.length>0 && (
                                                <>
                                                  {allQuestions[idx].buddies_verdict.map((b, ind) => (
                                                    <span key={ind} className="text-sm font-normal"> 
                                                      {b.verdict == "OK" 
                                                      ? <div className='h-[2em] aspect-square rounded-sm bg-green-600'> </div> 
                                                      : b.verdict == "Unknown"
                                                        ? <div className='h-[2em] aspect-square rounded-sm bg-yellow-600'> </div>
                                                        : <div className='h-[2em] aspect-square rounded-sm bg-red-600'> </div>
                                                      } 
                                                    </span>
                                                    ))}
                                                </>
                                              )
                                            }
                                          </span>
                                      </td>
                                    </tr>
                                  ))}
                            </tbody>
                          </table>
    
                          </div>
                        </>
                      : <div></div> 
                    }
                  </>
              }
            </div>
          }      
      </>
    );
  }
  else if (typeof window !== 'undefined') {
    router.push("/signin");
  }

  return null;
}