"use server"

import { CategoryType } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

import { UpsertTransactionDialog } from "@/components/UpsertTransactionDialog"
import { TransactionsTable } from "./_components/transactionsTable"
import { Sidebar } from "@/components/Sidebar"
import { redirect } from "next/navigation"
import { getUserCanAdd } from "@/actions/getUserCanAdd"
import { getCurrentSubscription } from "@/actions/getCurrentSubscription"
import { WrapperLayout } from "@/components/WrapperLayout"

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
    <>
      <Sidebar reportsAccess={subscriptionPlan !== "free"} />
      <WrapperLayout>
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
        />
      </WrapperLayout>
    </>
  )
}

export default Transactions
