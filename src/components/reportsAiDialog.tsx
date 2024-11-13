"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/_ui/dialog"
import Markdown from "react-markdown"
import { Button } from "@/components/_ui/button"
import { BotIcon, Loader2Icon } from "lucide-react"
import { ScrollArea } from "@/components/_ui/scroll-area"
import jsPDF from "jspdf"
import { generateAiReport } from "@/app/(home)/_actons/genereteAiReport"
import { marked } from "marked"
import Link from "next/link"
import { useSidebar } from "./_ui/sidebar"

interface ReportAiDialogProps {
  year: string
  month: string
  initialReport?: string | null
  trigger?: React.ReactNode
  free?: boolean
}

export const ReportAiDialog = ({
  month,
  year,
  trigger,
  initialReport = null,
  free
}: ReportAiDialogProps) => {
  const { isMobile } = useSidebar()
  const [report, setReport] = useState<string | null>(initialReport)
  const [isLoading, setIsloading] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const handleGenerateReport = async () => {
    try {
      setIsloading(true)
      const response = await generateAiReport({ month, year })
      setReport(response)
    } catch (error) {
      console.error({ error })
    } finally {
      setIsloading(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return

    try {
      // const canvas = await html2canvas(contentRef.current)
      // const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      })

      pdf.setTextColor("#000")
      const contentText = contentRef.current.innerHTML

      pdf.text(contentText, 10, 10)

      // const width = pdf.internal.pageSize.getWidth()
      // const height = (canvas.height * width) / canvas.width

      // pdf.addImage(imgData, "PNG", 0, 0, width, height)
      pdf.save("relatorio.pdf")
    } catch (error) {
      console.error({ error })
    }
  }

  useEffect(() => {
    if (!initialReport) return
    const handler = async () => {
      if (contentRef.current) {
        contentRef.current.innerHTML = await marked(initialReport)
      }
    }

    handler()
  }, [initialReport])

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // setReport(null)
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant={"outline"}>
            {!isMobile && "Relatório IA"}
            <BotIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-max max-w-[95%]">
        <DialogHeader>
          <DialogTitle>Relatório IA</DialogTitle>
          {!initialReport && (
            <DialogDescription>
              {free
                ? "Você não tem acesso a este recurso de Inteligência Artificial. Assine um plano agora para desbloquear."
                : "Use Inteligência Artificial para gerar um relatório com insights sobre suas finanças."}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea
          className="prose max-h-[550px] w-full text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white"
          ref={contentRef}
        >
          <Markdown className={"w-full"}>{report}</Markdown>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancelar</Button>
          </DialogClose>

          {free && (
            <Button asChild>
              <Link href={"/subscription"}>Ir para planos</Link>
            </Button>
          )}

          {!free && !initialReport && (
            <Button
              className="w-[132px]"
              disabled={isLoading}
              onClick={
                initialReport
                  ? () => handleDownloadPdf()
                  : () => handleGenerateReport()
              }
            >
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : initialReport ? (
                "Baixar PDF"
              ) : (
                "Gerar Relatório"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
