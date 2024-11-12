"use client"

import { DataTable } from "@/components/_ui/dataTable"

import { Transaction, TransactionCategory } from "@prisma/client"
import { getColumns } from "../_columns"

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
  itemsPerPage = 10,
  canAddCategory,
  canAddTransaction
}: TransactionsTableProps) => {
  const columns = getColumns({ categories, canAddCategory, canAddTransaction })

  return (
    <DataTable
      columns={columns}
      data={transactions}
      itemsPerPage={itemsPerPage}
    />
  )
}
