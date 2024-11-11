"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction, TransactionCategory } from "@prisma/client"
import { ArrowUpDown, PencilIcon } from "lucide-react"

import { TRANSACTION_PAYMENT_METHOD_LABELS } from "@/utils/constants/transactions"

import { Button } from "@/components/_ui/button"
import { TransactionTypeBadge } from "../_components/typeBadge"
import { TransactionCategoryDisplay } from "@/components/TransactionCategoryDisplay"
import { UpsertTransactionDialog } from "@/components/UpsertTransactionDialog"
import { TransactionDeleteDialog } from "../_components/transactionDeleteDialog"
import { formatCurrency } from "@/utils/formatter"

type MyColumnProps = {
  categories: TransactionCategory[]
}

export const getColumns = ({
  categories
}: MyColumnProps): ColumnDef<
  {
    category: {
      name: string
    } | null
  } & Transaction
>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,

      sortingFn: (rowA, rowB) => {
        const nameA = rowA.getValue<string>("name").toUpperCase()
        const nameB = rowB.getValue<string>("name").toUpperCase()
        return nameA.localeCompare(nameB)
      }
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tipo
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row: { original: transaction } }) => (
        <TransactionTypeBadge transaction={transaction} />
      )
    },
    {
      accessorKey: "categoryId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Categoria
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row: { original: transaction } }) => (
        <TransactionCategoryDisplay category={transaction.category} />
      ),
      sortingFn: (rowA, rowB) => {
        const categoryA = rowA.original.category?.name.toUpperCase() || ""
        const categoryB = rowB.original.category?.name.toUpperCase() || ""
        return categoryA.localeCompare(categoryB)
      }
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Método
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row: { original: transaction } }) =>
        TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod],
      sortingFn: (rowA, rowB) => {
        const labelA =
          TRANSACTION_PAYMENT_METHOD_LABELS[rowA.original.paymentMethod] || ""
        const labelB =
          TRANSACTION_PAYMENT_METHOD_LABELS[rowB.original.paymentMethod] || ""
        return labelA.localeCompare(labelB)
      }
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row: { original: transaction } }) => (
        <span className="text-zinc-500" suppressHydrationWarning>
          {new Date(transaction.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
        </span>
      ),
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.date).getTime() -
        new Date(rowB.original.date).getTime()
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row: { original: transaction } }) =>
        formatCurrency(transaction.amount),
      sortingFn: (rowA, rowB) =>
        Number(rowA.original.amount) - Number(rowB.original.amount)
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row: { original: transaction } }) => (
        <div className="flex justify-end gap-1">
          <UpsertTransactionDialog
            categories={categories}
            transactionId={transaction.id}
            defaultValues={{
              ...transaction,
              categoryId: transaction.categoryId?.toString() || undefined,
              amount: Number(transaction.amount)
            }}
            UpdateButton={
              <Button variant="ghost" size="icon">
                <PencilIcon className="text-zinc-500" />
              </Button>
            }
          />

          <TransactionDeleteDialog
            transactionId={transaction.id}
            transactionName={transaction.name}
          />
        </div>
      )
    }
  ]
}
