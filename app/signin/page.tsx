"use client"

import { useUserStore } from "@/stores/userStore";
import { useSession, signIn } from "next-auth/react"
import { redirect } from "next/navigation";
import React from "react";
 
function handleSignIn() {
    signIn("google")
}

export default function Home() {
    const session = useSession();

    const { user } = useUserStore();

    if(session.status == "authenticated") {

        if(session.data.user && (user?.codeforcesHandle == null || user?.username == null)) {
            redirect("/profile");
        }
        else {
            redirect("/");
        }
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-24">
            <div className="p-2">
                <div className="text-8xl font-bold p-4">Brain Buddies</div>
                <div className="flex justify-center p-8">
                    <button className='rounded-lg bg-blue-800 hover:bg-blue-900 py-2 px-4' onClick={handleSignIn}>Sign in with Google</button>
                </div>
            </div>
        </div>
    );
}
