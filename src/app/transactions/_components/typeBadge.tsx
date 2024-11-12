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
        <Badge className="bg-tertiary/10 text-tertiary hover:bg-tertiary/15 font-bold">
          <CircleIcon className="fill-tertiary mr-1" size={8} />
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
        <Badge className="bg-secondary/10 font-bold text-secondary hover:bg-secondary/15">
          <CircleIcon className="mr-2 fill-secondary" size={8} />
          Investimento
        </Badge>
      )

    default:
      return "-"
  }
}
