import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton,SignInButton } from '@clerk/nextjs'

export default function layout({ children }) {
  return (
    <>
    <nav className="w-full py-6 px-8 flex justify-between items-center bg-opacity-80 bg-gray-900 fixed top-0 z-50 shadow-dark-custom">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
          Campus Champ
        </h1>
        <div className="space-x-4">
            <Link href="/home" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Home
            </Link>
            <SignedIn>
                <UserButton />
              </SignedIn>
           
        </div>
      </nav>
      <main className="pt-20"> {/* Add padding to avoid overlap with navbar */}
        {children} {/* This is where the content of page.tsx will be rendered */}
      </main>
     
    </>
  )
}
