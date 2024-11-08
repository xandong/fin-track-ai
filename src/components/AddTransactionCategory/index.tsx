"use client"

import { useCallback, useEffect, useState } from "react"
import { DollarSign } from "lucide-react"
import { $Enums, CategoryType, TransactionCategory } from "@prisma/client"

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

interface AddTransactionCategoryProps {
  categories: TransactionCategory[]
  // eslint-disable-next-line no-unused-vars
  handleNewCategory: (category: {
    name: string
    id: number
    userId: string | null
    type: $Enums.CategoryType
    createdAt: Date
    updateAt: Date
  }) => void
}

export const AddTransactionCategory = ({
  categories,
  handleNewCategory
}: AddTransactionCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
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
        const newCategory = await addTransactionCategory({
          name: name,
          type: CategoryType.PRIVATE
        })

        handleNewCategory(newCategory)
        setIsOpen(false)
        setNewCategoryName("")
      } catch (error) {
        console.error("ERROR", { error })
      }
    },
    [categories, handleNewCategory]
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      const { categoryMatch } = validateNewCategoryName(
        newCategoryName,
        categories
      )

      if (categoryMatch)
        return setNewCategoryNameError("A Categoria já existente")

      setNewCategoryNameError(null)
    }, 300)

    return () => clearInterval(handler)
  }, [categories, newCategoryName])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setNewCategoryName("")
          setNewCategoryNameError(null)
        }
      }}
    >
      <DialogTrigger asChild className="w-full">
        <Button className="w-full rounded-full" variant="outline">
          Adicionar novo Gasto
          <DollarSign />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95%] rounded-2xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
          <DialogDescription>
            Insira uma categoria de gasto personalizada
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-8">
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input
                value={newCategoryName}
                onChange={(e) => {
                  e.preventDefault()
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

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button
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
