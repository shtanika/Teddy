import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.BACKEND_URL,
    fetchOptions: {
        credentials: 'include'
    }
})

export const { signIn, signUp, signOut, useSession } = authClient;
