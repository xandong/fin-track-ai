"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Prisma, CategoryType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const addTransactionCategorySchema = z.object({
  name: z.string().trim().min(1),
  type: z.nativeEnum(CategoryType)
})

type addTransactionCategoryParams = Omit<
  Prisma.TransactionCategoryCreateInput,
  "userId"
> & {
  categoryId?: number | undefined | null
}

export const addTransactionCategory = async (
  params: addTransactionCategoryParams
) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")
    addTransactionCategorySchema.parse(params)

    const data: Prisma.TransactionCategoryUncheckedCreateInput = {
      userId,
      name: params.name,
      type: params.type
    }

    const response = await prisma.transactionCategory.create({ data })
    revalidatePath("/transactions")

    return response
  } catch (error) {
    console.error("[addTransactionCategory]:", { error })
    throw new Error("Error when create new transaction category")
  }
}
