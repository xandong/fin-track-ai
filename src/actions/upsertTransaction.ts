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

const upsertTransactionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  categoryId: z.number().optional(),
  type: z.nativeEnum(TransactionType),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  date: z.date()
})

type upsertTransactionParams = Omit<Prisma.TransactionCreateInput, "userId"> & {
  categoryId?: number | undefined | null
  id?: string
}

export const upsertTransaction = async (params: upsertTransactionParams) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthenticated")
    upsertTransactionSchema.parse(params)

    const data: Prisma.TransactionUncheckedCreateInput = {
      userId,
      amount: params.amount,
      date: params.date,
      name: params.name,
      paymentMethod: params.paymentMethod,
      type: params.type,
      categoryId: params.categoryId ?? null
    }

    await prisma.transaction.upsert({
      where: {
        id: params.id || ""
      },
      update: { ...data, userId },
      create: { ...data, userId }
    })
    revalidatePath("/transactions")
  } catch (error) {
    console.error("[upsertTransaction]:", { error })
    throw new Error("Error when create new transaction")
  }
}
