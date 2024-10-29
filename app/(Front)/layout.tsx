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
          <Link href="" className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300">
            Sign In
          </Link>
          <Link href="" className="bg-pink-500 px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300">
            Sign Up
          </Link>
        </div>
      </nav>
    {children};
    </>
  )
}
