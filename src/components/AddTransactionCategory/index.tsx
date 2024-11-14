"use client"

import { useCallback, useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { CategoryType, TransactionCategory } from "@prisma/client"

import { Button } from "../_ui/button"
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
import { FormControl, FormItem, FormLabel, FormMessage } from "../_ui/form"
import { Input } from "../_ui/input"
import { addTransactionCategory } from "@/actions/addTransactionCategory"
import { formatTransactionCategory } from "@/utils/formatter"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_TOAST_MESSAGES } from "@/utils/constants/defaults"

interface AddTransactionCategoryProps {
  categories: TransactionCategory[]
  disabled?: boolean
  defaultValue?: string
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  handleNewCategory: (category: TransactionCategory) => void
}

export const AddTransactionCategory = ({
  categories,
  defaultValue,
  disabled,
  handleNewCategory,
  onClose
}: AddTransactionCategoryProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState(
    defaultValue ? defaultValue : ""
  )
  const [newCategoryNameError, setNewCategoryNameError] = useState<
    string | null
  >(null)

  const onSubmit = useCallback(
    async (name: string) => {
      if (!name) return setNewCategoryNameError("O campo é obrigatório")

      const { categoryMatch } = validateNewCategoryName(name, categories)

      if (categoryMatch)
        return setNewCategoryNameError("A Categoria já existente")

      setNewCategoryNameError(null)

      try {
        setIsLoading(true)
        const newCategory = await addTransactionCategory({
          name: name,
          type: CategoryType.PRIVATE
        })

        handleNewCategory(newCategory)
        setIsOpen(false)
        setNewCategoryName("")
      } catch (error) {
        console.error("ERROR", { error })
        toast({
          variant: "destructive",
          title: DEFAULT_TOAST_MESSAGES.error.title,
          description: DEFAULT_TOAST_MESSAGES.error.description
        })
      } finally {
        setIsLoading(false)
      }
    },
    [categories, handleNewCategory, toast]
  )

  useEffect(() => {
    if (defaultValue === newCategoryName) return

    const handler = setTimeout(() => {
      const { categoryMatch } = validateNewCategoryName(
        newCategoryName,
        categories
      )

      if (categoryMatch)
        return setNewCategoryNameError("A Categoria já existente")

      setNewCategoryNameError(null)
    }, 200)

    return () => clearInterval(handler)
  }, [categories, defaultValue, newCategoryName])

  useEffect(() => {
    if (!defaultValue) return

    setNewCategoryName(defaultValue)
  }, [defaultValue])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          if (!defaultValue) setNewCategoryName("")
          setNewCategoryNameError(null)
          onClose()
        }
      }}
    >
      <DialogTrigger asChild className="w-full" disabled={disabled}>
        <Button
          isLoading={isLoading}
          className="w-full rounded-full"
          variant={defaultValue ? "ghost" : "outline"}
        >
          Adicionar nova Categoria
          <PlusIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95%] rounded-2xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
          <DialogDescription>
            Insira uma categoria personalizada
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-8">
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value)
                }}
                type="text"
                placeholder="Digite um nome para o novo gasto..."
              />
            </FormControl>
            <FormMessage>
              {newCategoryNameError && newCategoryNameError}
            </FormMessage>
          </FormItem>

          <DialogFooter className="gap-2">
            <DialogClose asChild disabled={isLoading}>
              <Button className="w-full" type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button
              className="w-full"
              isLoading={isLoading}
              disabled={!!newCategoryNameError || !newCategoryName}
              type="button"
              onClick={() => onSubmit(newCategoryName)}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function normalizeInput(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleUpperCase()
}

function validateNewCategoryName(
  name: string,
  categories: TransactionCategory[]
) {
  const nameNormalized = normalizeInput(name)

  const categoryMatch = categories.find((category) => {
    const normalizedCategoryName = normalizeInput(category.name)
    const normalizedFormattedCategory = normalizeInput(
      formatTransactionCategory(category.name)
    )

    return (
      normalizedCategoryName === nameNormalized ||
      normalizedFormattedCategory === nameNormalized
    )
  })

  return { categoryMatch }
}
