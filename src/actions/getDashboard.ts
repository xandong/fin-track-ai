import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { CategoryType } from "@prisma/client"

export const getDashboard = async (year: string, month: string) => {
  const { userId } = await auth()

  const where = {
    date: {
      gte: new Date(`${year}-${month}-01`),
      lt: new Date(`${year}-${month}-31`)
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

  return {
    transactions,
    categories
  }
}
