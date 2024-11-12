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

interface TransactionsListProps {
  transactions: Transaction[]
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
  transaction: Transaction
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const IconComponent = useMemo(() => {
    switch (transaction.paymentMethod) {
      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return <CreditCardIcon size={20} className="text-white" />

      case "BANK_SLIP":
        return <BarcodeIcon size={20} className="text-white" />

      case "BANK_TRANSFER":
        return <ArrowRightLeftIcon size={20} className="text-white" />

      case "CASH":
        return <DollarSignIcon size={20} className="text-white" />

      case "PIX":
        return <Image src={"/pix.svg"} width={20} height={20} alt="Pix icon" />

      default:
        return <BadgeDollarSignIcon size={20} className="text-white" />
    }
  }, [transaction.paymentMethod])

  const amount = useMemo(() => {
    return formatCurrency(transaction.amount)
  }, [transaction.amount])

  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/5 p-[.625rem]">{IconComponent}</div>

        <div className="flex flex-col">
          <span className="text-sm font-bold">{transaction.name}</span>
          <span className="text-sm text-zinc-500">
            {new Date(transaction.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })}
          </span>
        </div>
      </div>
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
  )
}
