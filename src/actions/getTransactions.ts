"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export const getTransactions = async () => {
  const { userId } = await auth()

  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: "desc"
      },
      where: {
        userId: userId || undefined
      }
    })

    return transactions
  } catch (error) {
    console.error("[getTransactions]: ", { error })
    throw new Error("Error when get transactions")
  }
}
