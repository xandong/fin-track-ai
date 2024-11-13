"use client"

import { DataTable } from "@/components/_ui/dataTable"

import { useMemo } from "react"
import Image from "next/image"
import { Transaction, TransactionCategory } from "@prisma/client"
import { useSidebar } from "@/components/_ui/sidebar"

import { TRANSACTION_PAYMENT_METHOD_LABELS } from "@/utils/constants/transactions"
import { formatCurrency } from "@/utils/formatter"

import { UpsertTransactionDialog } from "@/components/UpsertTransactionDialog"
import { TransactionCategoryDisplay } from "@/components/TransactionCategoryDisplay"
import {
  ArrowRightLeftIcon,
  BadgeDollarSignIcon,
  BarcodeIcon,
  CreditCardIcon,
  DollarSignIcon
} from "lucide-react"
import { getColumns } from "../_columns"
import { TransactionTypeBadge } from "./typeBadge"

type TransactionsTableProps = {
  canAddCategory: boolean
  canAddTransaction: boolean
  transactions: (Transaction & {
    category: { name: string } | null
  })[]
  categories: TransactionCategory[]
  itemsPerPage?: number
}

export const TransactionsTable = ({
  transactions,
  categories,
  itemsPerPage = 8,
  canAddCategory,
  canAddTransaction
}: TransactionsTableProps) => {
  const columns = getColumns({ categories, canAddCategory, canAddTransaction })
  const { isMobile } = useSidebar()

  return (
    <>
      {isMobile ? (
        <div className="flex w-full flex-col gap-3">
          {transactions.map((transaction) => (
            <UpsertTransactionDialog
              key={transaction.id}
              categories={categories}
              canAddCategory={canAddCategory}
              canAddTransaction={canAddTransaction}
              transactionId={transaction.id}
              canDelete
              defaultValues={{
                ...transaction,
                categoryId: String(transaction.categoryId) || undefined,
                amount: Number(transaction.amount)
              }}
              UpdateButton={
                <button>
                  <TransactionCard transaction={transaction} />
                </button>
              }
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          itemsPerPage={itemsPerPage}
        />
      )}
    </>
  )
}

interface TransactionCardProps {
  transaction: Transaction & {
    category: { name: string } | null
  }
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const IconComponent = useMemo(() => {
    switch (transaction.paymentMethod) {
      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return <CreditCardIcon size={16} className="text-white" />

      case "BANK_SLIP":
        return <BarcodeIcon size={16} className="text-white" />

      case "BANK_TRANSFER":
        return <ArrowRightLeftIcon size={16} className="text-white" />

      case "CASH":
        return <DollarSignIcon size={16} className="text-white" />

      case "PIX":
        return <Image src={"/pix.svg"} width={16} height={16} alt="Pix icon" />

      default:
        return <BadgeDollarSignIcon size={16} className="text-white" />
    }
  }, [transaction.paymentMethod])

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 px-3 py-2">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col items-start gap-0.5">
          <p className="font-semibold">{transaction.name}</p>

          <span className="text-xs text-zinc-500" suppressHydrationWarning>
            {new Date(transaction.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </span>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <div className="-mr-2">
            <TransactionTypeBadge transaction={transaction} />
          </div>

          {transaction.category?.name && (
            <p className="text-xs text-zinc-500">
              <TransactionCategoryDisplay category={transaction.category} />
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {IconComponent}

          <span className="text-xs">
            {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
          </span>
        </div>

        <span className="text-sm" suppressHydrationWarning>
          {formatCurrency(transaction.amount)}
        </span>
      </div>
    </div>
  )
}
