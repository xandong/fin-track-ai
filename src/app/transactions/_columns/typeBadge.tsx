import { Badge } from "@/components/_ui/badge";
import { Transaction } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction:{
    category: {
        name: string;
    } | null;
  } & Transaction
}

export const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  switch (transaction.type) {
    case "DEPOSIT":
      return (
        <Badge className="bg-muted text-primary hover:bg-muted font-bold">
          <CircleIcon className="mr-1 fill-primary" size={8} />
          Depósito
        </Badge>
      )
    case "EXPENSE":
      return (
        <Badge className="bg-danger/10 text-danger hover:bg-danger/15 font-bold">
          <CircleIcon className="mr-2 fill-danger" size={8} />
          Despesa
        </Badge>
      )
    case "INVESTMENT":
      return (
        <Badge className="bg-muted text-zinc-50 hover:bg-muted font-bold">
          <CircleIcon className="mr-2 fill-zinc-50" size={8} />
          Investimento
        </Badge>
      )
  
    default:
      return "-"
  }
}