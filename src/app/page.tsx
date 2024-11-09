"use server"

import { Navbar } from "@/components/Navbar"
import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Home = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <Navbar />

      <main className="flex h-full items-center justify-center">
        <h1 className="text-5xl font-bold text-white">Main Component</h1>

        <div className="text-white">
          <UserButton showName />
        </div>
      </main>
    </div>
  )
}

export default Home
