"use server"

import { CategoryType } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

import { UpsertTransactionDialog } from "@/components/UpsertTransactionDialog"
import { TransactionsTable } from "./_components/transactionsTable"
import { Sidebar } from "@/components/Sidebar"
import { redirect } from "next/navigation"
import { getUserCanAdd } from "@/actions/getUserCanAdd"
import { WrapperLayout } from "@/components/WrapperLayout"

const Transactions = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  const [
    transactions,
    categories,
    {
      currentSubscriptionPlan,
      categories: { canAdd: canAddCategory },
      transactions: { canAdd: canAddTransaction }
    }
  ] = await Promise.all([
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
      },
      orderBy: {
        date: "desc"
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
    await getUserCanAdd()
  ])

  return (
    <>
      <Sidebar reportsAccess={currentSubscriptionPlan !== "free"} />
      <WrapperLayout
        title="Transações"
        actions={
          <div>
            <UpsertTransactionDialog
              responsive={false}
              categories={categories}
              canAddTransaction={canAddTransaction}
              canAddCategory={canAddCategory}
            />
          </div>
        }
      >
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
