"use client"

import { DataTable } from "@/components/_ui/dataTable"

import { Transaction, TransactionCategory } from "@prisma/client"
import { getColumns } from "../_columns"

type TransactionsTableProps = {
  transactions: (Omit<Transaction, "amount"> & {
    amount: number
    category: { name: string } | null
  })[]
  categories: TransactionCategory[]
  itemsPerPage?: number
}

export const TransactionsTable = ({
  transactions,
  categories,
  itemsPerPage = 10
}: TransactionsTableProps) => {
  const columns = getColumns({ categories })

  return (
    <DataTable
      columns={columns}
      data={transactions}
      itemsPerPage={itemsPerPage}
    />
  )
}
