"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { CategoryType } from "@prisma/client"

export const getSubscriptionPage = async () => {
  const { userId } = await auth()

  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setUTCHours(23, 59, 59, 999)

  const [transactions, categories] = await Promise.all([
    (
      await prisma.transaction.aggregate({
        _count: { id: true },
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })
    )._count.id,
    await prisma.transactionCategory.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        userId: userId,
        type: CategoryType.PRIVATE
      }
    })
  ])

  return {
    transactions,
    categories
  }
}
