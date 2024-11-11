"use server"

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { isMatch } from "date-fns"

import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/_ui/button"
import TransactionsList from "./_components/transactionsList"
import SumaryCards from "./_components/sumaryCards"
import TimeSelect from "./_components/timeSelect"
import { prisma } from "@/lib/prisma"
import { CategoryType } from "@prisma/client"

interface HomeParams {
  searchParams: {
    month: string | undefined
    year: string | undefined
  }
}

const Home = async ({ searchParams }: HomeParams) => {
  let { month, year } = searchParams
  const { userId } = await auth()

  if (month?.split("").length === 1) month = `0${month}`

  const isValidMonth = month && isMatch(month, "MM")
  if (!isValidMonth) month = undefined

  const isValidYear = year && isMatch(year, "yyyy")
  if (!isValidYear) year = undefined

  if (!userId) {
    redirect("/login")
  }

  const selectedMonth = month ? month : (new Date().getMonth() + 1).toString()
  const selectedYear = year ? year : new Date().getFullYear().toString()

  const where = {
    date: {
      gte: new Date(`${selectedYear}-${selectedMonth}-01`),
      lt: new Date(`${selectedYear}-${selectedMonth}-31`)
    }
  }

  const [transactions, categories] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        ...where
      }
    }),
    prisma.transactionCategory.findMany({
      where: {
        OR: [
          {
            type: CategoryType.PUBLIC
          },
          {
            userId: userId,
            type: CategoryType.PRIVATE
          }
        ]
      }
    })
  ])

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center">
      <Navbar />

      <main className="flex w-full max-w-[90rem] flex-1 flex-col flex-nowrap gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold leading-8">Dashboard</h1>
          <div className="flex flex-row gap-2">
            <Button>Relatorios</Button>

            <TimeSelect />
          </div>
        </div>

        <div className="grid w-full grid-cols-4 space-x-0 space-y-10 lg:grid-cols-6 lg:space-x-10 lg:space-y-0">
          <div className="col-span-4">
            <SumaryCards categories={categories} transactions={transactions} />
          </div>

          <div className="col-span-4 lg:col-span-2">
            <TransactionsList transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
