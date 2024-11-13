import { ReactNode } from "react"
import { TransactionCategory } from "@prisma/client"

import { UpsertTransactionDialog } from "@/components/UpsertTransactionDialog"
import { Card, CardContent, CardHeader } from "@/components/_ui/card"
import { formatCurrency } from "@/utils/formatter"

interface SummaryCardProps {
  canAddTransaction?: boolean
  canAddCategory?: boolean
  icon: ReactNode
  title: string
  amount: number
  highlighted?: boolean
  size?: "small" | "large"
  categories?: TransactionCategory[]
}

const SummaryCard = ({
  amount,
  icon,
  title,
  highlighted,
  size = "small",
  categories,
  canAddTransaction,
  canAddCategory
}: SummaryCardProps) => {
  return (
    <Card className={`h-full ${highlighted ? "bg-zinc-900/70" : ""}`}>
      <CardHeader className="pt-4">
        <div className="m-0 flex flex-row items-center gap-2">
          <div>{icon}</div>
          <p className="m-0 text-sm font-semibold text-zinc-500">{title}</p>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between pb-4">
        <p
          className={`font-bold ${size === "large" ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl"} max-w-full`}
        >
          {formatCurrency(amount)}
        </p>

        <div>
          {size === "large" && categories && (
            <UpsertTransactionDialog
              categories={categories}
              canAddTransaction={canAddTransaction}
              canAddCategory={canAddCategory}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SummaryCard
