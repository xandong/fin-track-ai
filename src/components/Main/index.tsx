import { UserButton } from "@clerk/nextjs"

const foo = "bla"

const Main = () => {
  return (
    <main className="flex h-[100vh] items-center justify-center bg-[#0A0A0A]">
      <h1 className="text-5xl font-bold text-white">Main Component</h1>

      <div className="text-white">
        <UserButton showName />
      </div>
    </main>
  )
}

export default Main
