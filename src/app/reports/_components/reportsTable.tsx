"use client"

import { DataTable } from "@/components/_ui/dataTable"

import { Report, Transaction, TransactionCategory } from "@prisma/client"
import { getColumns } from "../_columns"

type ReportsTableProps = {
  transactions: Transaction[]
  categories: TransactionCategory[]
  reports: Report[]
  canAddReport: boolean
}

export const ReportsTable = ({
  // transactions,
  // categories,
  canAddReport,
  reports
}: ReportsTableProps) => {
  const columns = getColumns({ canAddReport })

  return <DataTable columns={columns} data={reports} itemsPerPage={8} />
}
