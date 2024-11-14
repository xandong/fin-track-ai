import React, { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../_ui/dialog"
import { Button } from "../_ui/button"

interface ConfirmationDialogProps {
  TriggerButton?: React.ReactNode
  actionText?: string
  title?: string
  description?: string
  confirmText?: string
  handleConfirm: () => Promise<void>
  isLoading?: boolean
}

export const ConfirmationDialog = ({
  TriggerButton,
  actionText,
  title,
  description,
  confirmText,
  handleConfirm,
  isLoading = false
}: ConfirmationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        {TriggerButton ? (
          TriggerButton
        ) : (
          <Button>{actionText ?? "Confirmar"}</Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-96">
        <DialogHeader className="mb-4 space-y-4 pr-2">
          <DialogTitle>{title ? title : "Confirmar ação"}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogClose asChild disabled={isLoading}>
            <Button className="flex-1" type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            isLoading={isLoading}
            className="flex-1"
            type="button"
            onClick={async () => {
              await handleConfirm()
              setIsOpen(false)
            }}
          >
            {confirmText ? confirmText : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
