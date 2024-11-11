"use server"

import { Button } from "@/components/_ui/button"
import { Navbar } from "@/components/Navbar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Subscription = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center">
      <Navbar />

      <main className="flex w-full max-w-[90rem] flex-1 flex-col gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold leading-8">Assinatura</h1>
          <div>
            <Button>Action</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Subscription
