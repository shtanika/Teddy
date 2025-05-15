import { createAuthClient } from "better-auth/react"

// Add debug logging
console.log("Creating auth client with baseURL:", process.env.BACKEND_URL);

export const authClient = createAuthClient({
    baseURL: process.env.BACKEND_URL,
    fetchOptions: {
        credentials: 'include'
    },
})

export const { signIn, signUp, signOut, useSession } = authClient;
