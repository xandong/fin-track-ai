"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@prisma/client"
import { ArrowUpDown, PencilIcon, TrashIcon } from "lucide-react"

import { TRANSACTION_PAYMENT_METHOD_LABELS } from "@/utils/constants/transactions"

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
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(Number(transaction.amount)),
    sortingFn: (rowA, rowB) =>
      Number(rowA.original.amount) - Number(rowB.original.amount)
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
