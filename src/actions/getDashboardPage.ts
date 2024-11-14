import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { CategoryType } from "@prisma/client"

export const getDashboardPage = async (year: string, month: string) => {
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
        ...where,
        userId: userId || ""
      },
      include: {
        category: { select: { name: true } }
      },
      orderBy: {
        date: "desc"
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
      },
      orderBy: { name: "asc" }
    })
  ])

  return {
    transactions: JSON.parse(
      JSON.stringify(transactions)
    ) as typeof transactions,
    categories: JSON.parse(JSON.stringify(categories)) as typeof categories
  }
}
