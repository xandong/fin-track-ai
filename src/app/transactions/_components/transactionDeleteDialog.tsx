"use client"

import { deleteTransaction } from "@/actions/deleteTransaction"
import { Button } from "@/components/_ui/button"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TOAST_MESSAGES } from "@/utils/constants/defaults"
import { TrashIcon } from "lucide-react"
import { ReactNode, useCallback, useState } from "react"

interface TransactionDeleteDialogProps {
  transactionId: string
  transactionName: string
  TriggerButton?: ReactNode
}

export const TransactionDeleteDialog = ({
  transactionId,
  transactionName,
  TriggerButton
}: TransactionDeleteDialogProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmTransactionDeletion = useCallback(async () => {
    try {
      setIsLoading(true)
      await deleteTransaction({ id: transactionId })
      toast({
        title: "Transação excluída com sucesso!"
      })
    } catch (error) {
      console.error("[handleConfirmTransactionDeletion]", { error })
      toast({
        variant: "destructive",
        title: DEFAULT_TOAST_MESSAGES.error.title,
        description: DEFAULT_TOAST_MESSAGES.error.description
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, transactionId])

  return (
    <ConfirmationDialog
      title={`Confirmar exclusão de '${transactionName}'`}
      description="Tem certeza que deseja excluir? Essa ação é irreversível. Você excluirá para sempre essa transação."
      confirmText="Sim, quero excluir"
      handleConfirm={handleConfirmTransactionDeletion}
      TriggerButton={
        TriggerButton ? (
          TriggerButton
        ) : (
          <Button isLoading={isLoading} variant="ghost" size="icon">
            <TrashIcon className="text-zinc-500" />
          </Button>
        )
      }
    />
  )
}
