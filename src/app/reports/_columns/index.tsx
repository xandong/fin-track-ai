"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Report } from "@prisma/client"
import { ArrowUpDown, BotIcon } from "lucide-react"

import { Button } from "@/components/_ui/button"
import Markdown from "react-markdown"
import { ReportAiDialog } from "@/components/reportsAiDialog"

type MyColumnProps = {
  canAddReport: boolean
}

export const getColumns = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  canAddReport
}: MyColumnProps): ColumnDef<Report>[] => {
  return [
    {
      accessorKey: "id",
      header: "",
      cell: () => (
        <div className="flex items-center justify-center">
          <BotIcon size={20} />
        </div>
      )
    },
    {
      accessorKey: "report",
      header: "Relatório",
      cell: ({ row: { original: report } }) => (
        <ReportAiDialog
          month=""
          year=""
          initialReport={report.report}
          trigger={
            <div className="line-clamp-1">
              <Markdown>{report.report}</Markdown>
            </div>
          }
        />
      )
    },
    {
      accessorKey: "transactionsId",
      header: "Transações",
      cell: ({ row: { original: transaction } }) => (
        <div>{transaction.transactionsId.length}</div>
      ),
      sortingFn: (rowA, rowB) =>
        rowA.original.transactionsId.length -
        rowB.original.transactionsId.length
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
          {new Date(transaction.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
        </span>
      ),
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.createdAt).getTime() -
        new Date(rowB.original.createdAt).getTime()
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => (
        // { row: { original: report } }
        <div className="flex justify-end gap-1">
          {/* <UpsertTransactionDialog
            canAddCategory={canAddCategory}
            canAddTransaction={canAddTransaction}
            categories={reports}
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
          /> */}

          {/* <TransactionDeleteDialog
            transactionId={transaction.id}
            transactionName={transaction.name}
          /> */}
        </div>
      )
    }
  ]
}
