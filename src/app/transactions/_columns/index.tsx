"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@prisma/client"
import { PencilIcon, TrashIcon } from "lucide-react"

import { TRANSACTION_PAYMENT_METHOD_LABELS } from "@/constants/transactions"

import { Button } from "@/components/_ui/button"
import { TransactionTypeBadge } from "./typeBadge"
import { TransactionCategoryDisplay } from "@/components/TransactionCategoryDisplay"

export const columns: ColumnDef<
  {
    category: {
      name: string
    } | null
  } & Transaction
>[] = [
  {
    accessorKey: "name",
    header: "Nome"
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    )
  },
  {
    accessorKey: "categoryId",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) => (
      <TransactionCategoryDisplay category={transaction.category} />
    )
  },
  {
    accessorKey: "paymentMethod",
    header: "Método",
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row: { original: transaction } }) => (
      <span className="text-zinc-500">
        {new Date(transaction.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })}
      </span>
    )
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(Number(transaction.amount))
  },
  {
    accessorKey: "actions",
    header: "",
    cell: () => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon">
          <PencilIcon className="text-zinc-500" />
        </Button>

        <Button variant="ghost" size="icon">
          <TrashIcon className="text-zinc-500" />
        </Button>
      </div>
    )
  }
]
