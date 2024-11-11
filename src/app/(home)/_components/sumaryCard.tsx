import { ReactNode } from "react"
import { $Enums } from "@prisma/client"

import { UpsertTransactionDialog } from "@/components/UpsertTransactionDialog"
import { Card, CardContent, CardHeader } from "@/components/_ui/card"

interface SumaryCardProps {
  icon: ReactNode
  title: string
  amount: number
  highlighted?: boolean
  size?: "small" | "large"
  categories?: {
    userId: string | null
    id: number
    name: string
    type: $Enums.CategoryType
    createdAt: Date
    updateAt: Date
  }[]
}

const SumaryCard = ({
  amount,
  icon,
  title,
  highlighted,
  size = "small",
  categories
}: SumaryCardProps) => {
  return (
    <Card className={`h-full ${highlighted ? "bg-zinc-900/70" : ""}`}>
      <CardHeader className="flex-row items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p
          className={`font-bold ${size === "large" ? "text-4xl" : "text-2xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          }).format(Number(amount))}
        </p>

        <div>
          {size === "large" && categories && (
            <UpsertTransactionDialog categories={categories} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SumaryCard
