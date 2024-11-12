"use client"

import { useEffect, useState } from "react"
import { Transaction, TransactionCategory } from "@prisma/client"

import { Card, CardContent, CardHeader } from "@/components/_ui/card"
import { formatCurrency, formatTransactionCategory } from "@/utils/formatter"
import { Progress } from "@/components/_ui/progress"
import { ScrollArea } from "@/components/_ui/scroll-area"

interface ExpensesPerCategoryProps {
  categories: TransactionCategory[]
  transactions: Transaction[]
  expensesTotal: number
}

export const ExpensesPerCategory = ({
  categories,
  transactions,
  expensesTotal
}: ExpensesPerCategoryProps) => {
  return (
    <Card className="flex flex-col items-center gap-6">
      <CardHeader className="flex w-full flex-row items-center justify-between pb-0">
        <span className="text-lg font-bold">Gastos por categoria</span>
        <div />
      </CardHeader>

      <div className="h-[1px] w-[calc(100%-48px)] bg-white/10" />

      <ScrollArea className="w-full flex-1">
        <CardContent className="flex h-full max-h-[350px] w-full flex-col gap-2 pb-4 pt-0">
          {transactions.map((transaction) => {
            if (transaction.type !== "EXPENSE")
              return <div key={transaction.id} />

            const category = categories.find(
              (category) => category.id === transaction.categoryId
            )
            return (
              <ExpensesRow
                key={transaction.id}
                category={category}
                percent={(Number(transaction.amount) * 100) / expensesTotal}
                transaction={transaction}
              />
            )
          })}
        </CardContent>
      </ScrollArea>
    </Card>
  )
}

interface ExpensesRowProps {
  category: TransactionCategory | undefined
  transaction: Transaction
  percent: number
}

const ExpensesRow = ({ category, percent, transaction }: ExpensesRowProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percent), 1000)
    return () => clearTimeout(timer)
  }, [percent])

  return (
    <div className="flex flex-col gap-[.625rem]">
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-bold">
          {formatTransactionCategory(category?.name ? category.name : "Outro")}
        </div>
        <div className="text-sm font-bold">{percent.toFixed(2)}%</div>
      </div>

      <Progress
        value={progress}
        className="bg-zinc-900"
        indicatorColor="bg-zinc-500"
      />

      <div className="text-sm font-semibold text-zinc-500">
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  )
}
