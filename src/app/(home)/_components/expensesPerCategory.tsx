"use client"

import { useEffect, useMemo, useState } from "react"
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
  const expensesPerCategory = useMemo(() => {
    return categories
      .map((category) => {
        const totalPerCategory = transactions
          .filter(
            (transaction) =>
              transaction.type === "EXPENSE" &&
              transaction.categoryId === category.id
          )
          .reduce(
            (sum, transaction) => Number(sum) + Number(transaction.amount),
            0
          )

        if (totalPerCategory === 0) return

        return {
          category,
          total: totalPerCategory
        }
      })
      .filter((item) => !!item)
  }, [categories, transactions])

  return (
    <Card className="flex flex-col items-center gap-6">
      <CardHeader className="flex w-full flex-row items-center justify-between pb-0">
        <span className="text-lg font-bold">Gastos por categoria</span>
        <div />
      </CardHeader>

      <div className="h-[1px] w-[calc(100%-48px)] bg-white/10" />

      <ScrollArea className="w-full flex-1">
        <CardContent className="flex h-full max-h-[350px] w-full flex-col gap-2 pb-4 pt-0">
          {expensesPerCategory.map(({ category, total }) => {
            return (
              <ExpensesRow
                key={category.id}
                category={category}
                percent={(total * 100) / expensesTotal}
                total={total}
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
  total: number
  percent: number
}

const ExpensesRow = ({ category, percent, total }: ExpensesRowProps) => {
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
        {formatCurrency(total)}
      </div>
    </div>
  )
}
