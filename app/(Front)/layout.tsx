import React from 'react'
import Link from 'next/link'

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
    <nav className="w-full py-6 px-8 flex justify-between items-center bg-opacity-80 bg-black fixed top-0 z-50 shadow-lg">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
          Campus Champ
        </h1>
        <div className="space-x-4">
            <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Home
            </Link>

            <Link href="app/sign-in" className="bg-gray-500 text-black-900 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300">
            Sign In
            </Link>

            <Link href="app/sign-up" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
            Sign Up
            </Link>

        </div>
      </nav>
    {children};
    </>
  )
}
