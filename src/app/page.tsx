import Main from "@/components/Main"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Home = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  return <Main />
}

export default Home
