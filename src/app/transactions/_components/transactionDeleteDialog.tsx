"use client"

import { deleteTransaction } from "@/actions/deleteTransaction"
import { Button } from "@/components/_ui/button"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { TrashIcon } from "lucide-react"
import { useCallback } from "react"

interface TransacTransactionDeleteDialogProps {
  transactionId: string
  transactionName: string
}

export const TransactionDeleteDialog = ({
  transactionId,
  transactionName
}: TransacTransactionDeleteDialogProps) => {
  const handleConfirmTransactionDeletion = useCallback(async () => {
    try {
      await deleteTransaction({ id: transactionId })
    } catch (error) {
      console.error("[handleConfirmTransactionDeletion]", { error })
    }
  }, [transactionId])

  return (
    <ConfirmationDialog
      title={`Confirmar exclusão de '${transactionName}'`}
      description="Tem certeza que deseja excluir? Essa ação é irreversível. Você excluirá para sempre essa transação."
      handleConfirm={handleConfirmTransactionDeletion}
      TriggerButton={
        <Button variant="ghost" size="icon">
          <TrashIcon className="text-zinc-500" />
        </Button>
      }
    />
  )
}
