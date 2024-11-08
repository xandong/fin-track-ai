import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { CategoryType } from "@prisma/client"

export const getTransactionCategories = async () => {
  const { userId } = await auth()

  try {
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

    return categories
  } catch (error) {
    console.error("[getTransactionCategories]: ", { error })
    throw new Error("Error when get transaction categories")
  }
}
