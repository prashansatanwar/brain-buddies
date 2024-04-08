import { DateTime } from "next-auth/providers/kakao"

export interface User {
    id: string 
    email: string 
    username: string | null
    name: string
    picture: string
    codeforcesHandle: string | null
    buddies: string[] | null
    createdAt: DateTime
    updatedAt: DateTime 
}