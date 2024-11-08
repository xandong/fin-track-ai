import { Badge } from "@/components/_ui/badge"
import { Transaction } from "@prisma/client"
import { CircleIcon } from "lucide-react"

interface TransactionTypeBadgeProps {
  transaction: {
    category: {
      name: string
    } | null
  } & Omit<Transaction, "amount">
}

export const TransactionTypeBadge = ({
  transaction
}: TransactionTypeBadgeProps) => {
  switch (transaction.type) {
    case "DEPOSIT":
      return (
        <Badge className="bg-muted font-bold text-primary hover:bg-muted">
          <CircleIcon className="mr-1 fill-primary" size={8} />
          Depósito
        </Badge>
      )
    case "EXPENSE":
      return (
        <Badge className="bg-danger/10 font-bold text-danger hover:bg-danger/15">
          <CircleIcon className="mr-2 fill-danger" size={8} />
          Despesa
        </Badge>
      )
    case "INVESTMENT":
      return (
        <Badge className="bg-muted font-bold text-zinc-50 hover:bg-muted">
          <CircleIcon className="mr-2 fill-zinc-50" size={8} />
          Investimento
        </Badge>
      )

    default:
      return "-"
  }
}
