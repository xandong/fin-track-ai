import { Transaction } from "@prisma/client"

import { Button } from "@/components/_ui/button"
import { Card, CardContent, CardHeader } from "@/components/_ui/card"

import {
  ArrowRightLeftIcon,
  BadgeDollarSignIcon,
  BarcodeIcon,
  CreditCardIcon,
  DollarSignIcon
} from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import Image from "next/image"
import { formatCurrency } from "@/utils/formatter"
import { TransactionCategoryDisplay } from "@/components/TransactionCategoryDisplay"
import { Badge } from "@/components/_ui/badge"

interface TransactionsListProps {
  transactions: (Transaction & {
    category: {
      name: string
    } | null
  })[]
}

const TransactionsList = async ({ transactions }: TransactionsListProps) => {
  return (
    <Card className="flex flex-col items-center gap-6">
      <CardHeader className="flex w-full flex-row items-center justify-between pb-0">
        <span className="text-lg font-bold">Transações</span>
        <Link href={"/transactions"}>
          <Button variant="outline" className="text-xs font-bold">
            Ver mais
          </Button>
        </Link>
      </CardHeader>
      <div className="h-[1px] w-[calc(100%-48px)] bg-white/10" />
      <CardContent className="flex w-full flex-col gap-6">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </CardContent>
    </Card>
  )
}

export default TransactionsList

interface TransactionCardProps {
  transaction: Transaction & {
    category: {
      name: string
    } | null
  }
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const IconComponent = useMemo(() => {
    switch (transaction.paymentMethod) {
      case "PIX":
        return <Image src={"/pix.svg"} width={20} height={20} alt="Pix icon" />

      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return <CreditCardIcon size={18} className="text-white" />

      case "BANK_SLIP":
        return <BarcodeIcon size={18} className="text-white" />

      case "BANK_TRANSFER":
        return <ArrowRightLeftIcon size={18} className="text-white" />

      case "CASH":
        return <DollarSignIcon size={18} className="text-white" />

      default:
        return <BadgeDollarSignIcon size={18} className="text-white" />
    }
  }, [transaction.paymentMethod])

  const amount = useMemo(() => {
    return formatCurrency(transaction.amount)
  }, [transaction.amount])

  return (
    <div className="flex w-full items-center gap-3">
      <div className="rounded-xl bg-white/5 p-[.625rem]">{IconComponent}</div>

      <div className="flex w-full flex-col">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-bold">{transaction.name}</span>
          {transaction.category && (
            <Badge variant="outline">
              <span className="text-xs font-semibold text-zinc-500">
                {TransactionCategoryDisplay({
                  category: {
                    name: transaction.category.name
                  }
                })}
              </span>
            </Badge>
          )}
        </div>

        <div className="flex w-full items-end justify-between">
          <span className="text-sm text-zinc-500">
            {new Date(transaction.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </span>

          <span
            className={`text-sm font-bold ${
              transaction.type === "DEPOSIT"
                ? "text-tertiary"
                : transaction.type === "EXPENSE"
                  ? "text-danger"
                  : transaction.type === "INVESTMENT"
                    ? "text-secondary"
                    : "text-white"
            }`}
          >
            {amount}
          </span>
        </div>
      </div>
    </div>
  )
}
