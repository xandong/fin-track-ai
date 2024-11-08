"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteTransaction = async ({ id }: { id: string }) => {
  try {
    if (!id || typeof id !== "string") throw new Error("Transaction id invalid")

    await prisma.transaction.delete({
      where: {
        id
      }
    })

    revalidatePath("transactions")
  } catch (error) {
    console.error("[deleteTransaction]: ", { error })
    throw new Error("Error when deleting transaction")
  }
}
