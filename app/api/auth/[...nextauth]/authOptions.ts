
import { NextAuthOptions, getServerSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import jwt from "jsonwebtoken" 
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/app/prismaClient'

const MAX_AGE = 1 * 24 * 60 * 60

export const authOptions: NextAuthOptions = {
providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
],
// debug: true,
secret: process.env.NEXTAUTH_SECRET,
session: {
    strategy: 'jwt',
    maxAge: MAX_AGE,
},
jwt: {
    maxAge: MAX_AGE,
    async encode({ token, secret }): Promise<string> {
      if (!token) {
        throw new Error('Token is undefined')
      }
      const { sub, ...tokenProps } = token
      // Get the current date in seconds since the epoch
      const nowInSeconds = Math.floor(Date.now() / 1000)

      // Calculate the expiration timestamp
      const expirationTimestamp = nowInSeconds + MAX_AGE
      const jwtToken = jwt.sign(
        { uid: sub, ...tokenProps, exp: expirationTimestamp },
        secret,
        {
          algorithm: 'HS256',
        },
      )
      return jwtToken
    },
    async decode({ token, secret }): Promise<JWT | null> {
      if (!token) {
        throw new Error('Token is undefined')
      }
      try {
        const decodedToken = jwt.verify(token, secret, {
          algorithms: ['HS256'],
        })
        return decodedToken as JWT
      } catch (error) {
        console.error('JWT decode error', error)
        return null
      }
    },
  },
callbacks: {
    async signIn({ user, account }) {
    if (account?.provider === 'google') {
        console.log("USERRRRRR",user);
        const existingUser = await prisma.user.findUnique({
            where: {id: user.id!}
        })
        // console.log(existingUser)
        if (!existingUser) {
          const newUser = await prisma.user.create({
              data: {
                  id: user.id!,
                  email: user.email!,
                  username: "",
                  name: user.name!,
                  picture: user.image!,
                  codeforcesHandle: "",
                  buddies: [],

              }

          })
        }
    }

    return true
    },

    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = user?.id
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          image: token.picture,
          email: token.email,
          name: token.name,
        }
        
        session.user.id = token.id
        // session.user.codeforcesHandle = user.codeforcesHandle;
    }
    return session
    },
},

pages: {
    signIn: '/signin',
},
}

export const getAuth = () => getServerSession(authOptions)