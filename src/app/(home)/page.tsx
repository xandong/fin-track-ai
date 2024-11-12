"use server"

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { isMatch } from "date-fns"

import { Navbar } from "@/components/Navbar"
import TransactionsList from "./_components/transactionsList"
import SumaryCards from "./_components/sumaryCards"
import TimeSelect from "./_components/timeSelect"
import { getDashboardPage } from "@/actions/getDashboardPage"
import { getUserCanAdd } from "@/actions/getUserCanAdd"
import { getCurrentSubscription } from "@/actions/getCurrentSubscription"
import { ReportAiDialog } from "@/components/reportsAiDialog"

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

  const [
    { categories, transactions },
    {
      transactions: { canAdd: canAddTransaction },
      categories: { canAdd: canAddCategory }
    },
    currentSubscription
  ] = await Promise.all([
    await getDashboardPage(selectedYear, selectedMonth),

    await getUserCanAdd(),
    await getCurrentSubscription()
  ])

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center">
      <Navbar reportsAccess={currentSubscription !== "free"} />

      <main className="flex w-full max-w-[90rem] flex-1 flex-col flex-nowrap gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold leading-8">Dashboard</h1>
          <div className="flex flex-row gap-2">
            <ReportAiDialog month={selectedMonth} year={selectedYear} />

            <TimeSelect />
          </div>
        </div>

        <div className="grid w-full grid-cols-4 space-x-0 space-y-10 lg:grid-cols-6 lg:space-x-10 lg:space-y-0">
          <div className="col-span-4">
            <SumaryCards
              categories={categories}
              transactions={transactions}
              canAddTransaction={canAddTransaction}
              canAddCategory={canAddCategory}
            />
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
