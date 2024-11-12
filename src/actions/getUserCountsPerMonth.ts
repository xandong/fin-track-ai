"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { CategoryType } from "@prisma/client"

export const getUserCountsPerMonth = async () => {
  const { userId } = await auth()

  const startOfMonth = new Date()
  startOfMonth.setUTCDate(1) // Primeiro dia do mês
  startOfMonth.setUTCHours(0, 0, 0, 0) // Início do dia

  const endOfMonth = new Date()
  endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1) // Próximo mês
  endOfMonth.setUTCDate(0) // Último dia do mês atual
  endOfMonth.setUTCHours(23, 59, 59, 999) // Fim do dia

  const [transactions, categories, reports] = await Promise.all([
    (
      await prisma.transaction.aggregate({
        _count: { id: true },
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          userId: userId || ""
        }
      })
    )._count.id,
    await prisma.transactionCategory.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        userId: userId,
        type: CategoryType.PRIVATE
      }
    }),
    await prisma.report.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        userId: userId || ""
      }
    })
  ])

  return {
    transactionsCount: transactions,
    categoriesCount: categories,
    reportsCount: reports
  }
}
