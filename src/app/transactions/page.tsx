import { CategoryType } from "@prisma/client"

import { AddTransaction } from "@/components/AddTransaction"
import { DataTable } from "@/components/_ui/dataTable"
import { columns } from "./_columns"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

const Transactions = async () => {
  const { userId } = await auth()

  const transactions = await prisma.transaction.findMany({
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    where: {
      userId: userId || undefined
    }
  })

  const categories = await prisma.transactionCategory.findMany({
    where: {
      OR: [
        {
          type: CategoryType.PUBLIC
        },
        {
          userId: userId ?? undefined
        }
      ]
    }
  })

  console.log({ transactions, categories })

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex w-full max-w-[90rem] flex-1 flex-col gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold leading-8">Transactions</h1>

          <div>
            <AddTransaction categories={categories} />
          </div>
        </div>

        <DataTable columns={columns} data={transactions} itemsPerPage={8} />
      </div>
    </div>
  )
}

export default Transactions
