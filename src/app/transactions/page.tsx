"use server"

import { CategoryType } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

import { UpsertTransactionDialog } from "@/components/UpsertTransactionDialog"
import { TransactionsTable } from "./_components/transactionsTable"
import { Navbar } from "@/components/Navbar"
import { redirect } from "next/navigation"
import { getUserCanAdd } from "@/actions/getUserCanAdd"
import { getCurrentSubscription } from "@/actions/getCurrentSubscription"

const Transactions = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  const [transactions, categories, subscriptionPlan] = await Promise.all([
    await prisma.transaction.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      where: {
        userId: userId
      }
    }),
    await prisma.transactionCategory.findMany({
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
    }),
    await getCurrentSubscription()
  ])

  const {
    categories: { canAdd: canAddCategory },
    transactions: { canAdd: canAddTransaction }
  } = await getUserCanAdd()

  return (
    <div className="flex h-full w-full flex-col items-center">
      <Navbar reportsAccess={subscriptionPlan !== "free"} />

      <div className="flex w-full max-w-[90rem] flex-1 flex-col gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold leading-8">Transactions</h1>

          <div>
            <UpsertTransactionDialog
              categories={categories}
              canAddTransaction={canAddTransaction}
              canAddCategory={canAddCategory}
            />
          </div>
        </div>

        <TransactionsTable
          canAddTransaction={canAddTransaction}
          canAddCategory={canAddCategory}
          categories={categories}
          transactions={JSON.parse(JSON.stringify(transactions))}
          itemsPerPage={8}
        />
      </div>
    </div>
  )
}

export default Transactions
