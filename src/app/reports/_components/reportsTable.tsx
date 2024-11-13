"use client"

import { DataTable } from "@/components/_ui/dataTable"

import { Report, Transaction, TransactionCategory } from "@prisma/client"
import { getColumns } from "../_columns"
import { useSidebar } from "@/components/_ui/sidebar"
import Markdown from "react-markdown"
import { BotIcon } from "lucide-react"
import { ReportAiDialog } from "@/components/reportsAiDialog"

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
  const { isMobile } = useSidebar()

  return (
    <>
      {isMobile ? (
        <div className="flex w-full flex-col gap-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={reports} itemsPerPage={8} />
      )}
    </>
  )
}

interface ReportCardProps {
  report: Report
}

const ReportCard = ({ report }: ReportCardProps) => {
  return (
    <ReportAiDialog
      month=""
      year=""
      initialReport={report.report}
      trigger={
        <div className="flex flex-nowrap gap-4 rounded-2xl border border-zinc-800 px-4 py-2">
          <div className="flex items-center justify-center">
            <BotIcon size={20} />
          </div>

          <div className="line-clamp-3 flex-1">
            <Markdown className="ml-2 rounded-none text-xs">
              {report.report}
            </Markdown>
          </div>

          <div className="flex flex-col items-end justify-center gap-0.5">
            <span className="text-xs text-zinc-500">
              {new Date(report.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit"
              })}
            </span>
            <span className="text-xs text-zinc-500">
              {new Date(report.createdAt).toLocaleDateString("pt-BR", {
                year: "numeric"
              })}
            </span>
            {/* <Button variant="outline">
                <Trash2Icon size={18} />
              </Button>
              <Button variant="outline">
                <Trash2Icon size={18} />
              </Button> */}
          </div>
        </div>
      }
    />
  )
}
