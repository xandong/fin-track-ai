"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import {
  Prisma,
  TransactionPaymentMethod,
  TransactionType
} from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const addTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  categoryId: z.number().optional(),
  type: z.nativeEnum(TransactionType),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  date: z.date()
})

type addTransactionParams = Omit<Prisma.TransactionCreateInput, "userId"> & {
  categoryId?: number | undefined | null
}

export const addTransaction = async (params: addTransactionParams) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")
    addTransactionSchema.parse(params)

    const data: Prisma.TransactionUncheckedCreateInput = {
      userId,
      amount: params.amount,
      date: params.date,
      name: params.name,
      paymentMethod: params.paymentMethod,
      type: params.type,
      categoryId: params.categoryId ?? null
    }

    await prisma.transaction.create({ data })
    revalidatePath("/transactions")
  } catch (error) {
    console.error("[addTransaction]:", { error })
    throw new Error("Error when create new transaction")
  }
}
