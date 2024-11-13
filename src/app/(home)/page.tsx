"use server"

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { isMatch } from "date-fns"

import { Sidebar } from "@/components/Sidebar"
import TransactionsList from "./_components/transactionsList"
import SumaryCards from "./_components/sumaryCards"
import TimeSelect from "./_components/timeSelect"
import { getDashboardPage } from "@/actions/getDashboardPage"
import { getUserCanAdd } from "@/actions/getUserCanAdd"
import { getCurrentSubscription } from "@/actions/getCurrentSubscription"
import { ReportAiDialog } from "@/components/reportsAiDialog"
import { WrapperLayout } from "@/components/WrapperLayout"

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
    <>
      <Sidebar reportsAccess={currentSubscription !== "free"} />

      <WrapperLayout>
        <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
          <h1 className="text-2xl font-bold leading-8">Dashboard</h1>
          <div className="flex flex-row gap-2">
            <ReportAiDialog
              month={selectedMonth}
              year={selectedYear}
              free={currentSubscription === "free"}
            />

            <TimeSelect />
          </div>
        </div>

        <div className="grid w-full grid-cols-4 space-x-0 space-y-10 xl:grid-cols-6 xl:space-x-10 xl:space-y-0">
          <div className="col-span-4">
            <SumaryCards
              categories={categories}
              transactions={transactions}
              canAddTransaction={canAddTransaction}
              canAddCategory={canAddCategory}
            />
          </div>

          <div className="col-span-4 xl:col-span-2">
            <TransactionsList transactions={transactions} />
          </div>
        </div>
      </WrapperLayout>
    </>
  )
}

export default Home
