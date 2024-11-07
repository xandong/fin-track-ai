import { Button } from "@/components/_ui/button"
import { DataTable } from "@/components/_ui/dataTable"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { CategoryType } from "@prisma/client"
import { ArrowDownUpIcon } from "lucide-react"
import { columns } from "./_columns"

const Transactions = async () => {
  const { userId } = await auth()
  console.log({userId})
  const transactions = await prisma.transaction.findMany({
    include: {
      category: {select: {
        name: true
      }}
    }
    // where: {
    //   userId: userId || undefined,
    // }
  })

  const categories = await prisma.transactionCategory.findMany({
    where: {
      OR: [{
        type: CategoryType.PUBLIC
      },{
        userId: userId ?? undefined
      }]
    },
  })
  
  console.log({ transactions, categories })

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="w-full flex-1 p-6 max-w-[90rem] flex flex-col gap-6">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold leading-8">Transactions</h1>

          <Button className="rounded-full">
            Adicionar Transação
            <ArrowDownUpIcon />
          </Button>
        </div>

        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  )
}

export default Transactions