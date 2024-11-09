"use server"

import { Navbar } from "@/components/Navbar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Subscription = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }
  return (
    <div>
      <Navbar />
      <div>Subscription</div>
    </div>
  )
}

export default Subscription
