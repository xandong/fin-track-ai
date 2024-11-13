"use client"

import React, { useCallback, useEffect, useState } from "react"
import { ArrowDownUpIcon, CalendarIcon } from "lucide-react"
import {
  $Enums,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType
} from "@prisma/client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../_ui/form"
import { Input } from "../_ui/input"
import { MoneyInput } from "../MoneyInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../_ui/select"
import {
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS
} from "@/utils/constants/transactions"
import { Popover, PopoverContent, PopoverTrigger } from "../_ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "../_ui/calendar"
import { TransactionCategoryDisplay } from "../TransactionCategoryDisplay"
import { upsertTransaction } from "@/actions/upsertTransaction"
import { AddTransactionCategory } from "../AddTransactionCategory"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../_ui/tooltip"

const formSchema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório"
    })
    .trim()
    .min(1, "O nome é obrigatório"),
  amount: z
    .number({
      required_error: "O valor é obrigatório"
    })
    .positive({
      message: "O valor deve ser positivo"
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: "O tipo é obrigatório"
  }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: "O tipo é obrigatório"
  }),
  date: z.date({
    required_error: "A data é obrigatória"
  })
})

interface DefaultValues extends z.infer<typeof formSchema> {
  categoryId?: string
}

interface UpsertTransactionDialogProps {
  transactionId?: string
  categories: TransactionCategory[]
  defaultValues?: DefaultValues
  CreateButton?: React.ReactNode
  UpdateButton?: React.ReactNode
  canAddCategory?: boolean
  canAddTransaction?: boolean
}

export const UpsertTransactionDialog = ({
  categories,
  defaultValues,
  CreateButton,
  UpdateButton,
  transactionId,
  canAddCategory,
  canAddTransaction
}: UpsertTransactionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const otherCategory = categories.find((category) => category.name == "OTHER")
  const [categoryId, setCategoryId] = useState<string>(
    defaultValues?.categoryId
      ? defaultValues?.categoryId
      : otherCategory
        ? otherCategory.id.toString()
        : ""
  )
  const [newCategoryId, setNewCategoryId] = useState("")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? { ...defaultValues, date: new Date(defaultValues?.date) }
      : {
          name: "",
          date: new Date()
        }
  })

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      if (
        defaultValues &&
        defaultValues.amount === data.amount &&
        new Date(defaultValues.date).getTime() ===
          new Date(data.date).getTime() &&
        defaultValues.name === data.name &&
        defaultValues.paymentMethod === data.paymentMethod &&
        defaultValues.type === data.type &&
        defaultValues.categoryId === categoryId
      )
        return

      try {
        await upsertTransaction({
          ...data,
          id: transactionId,
          categoryId:
            data.type === "EXPENSE" && categoryId
              ? Number(categoryId)
              : undefined
        })
        setIsOpen(false)
        setCategoryId("")
        form.reset(
          defaultValues
            ? { ...defaultValues, date: new Date(defaultValues?.date) }
            : {
                name: "",
                date: new Date()
              }
        )
      } catch (error) {
        console.error("ERROR", { error })
      }
    },
    [categoryId, defaultValues, form, transactionId]
  )

  const handleAddNewCategory = useCallback(
    (newCategory: {
      name: string
      id: number
      userId: string | null
      type: $Enums.CategoryType
      createdAt: Date
      updateAt: Date
    }) => {
      if (!newCategory) return
      if (newCategory.id.toString() === categoryId) return

      categories.push(newCategory)
      setNewCategoryId(newCategory.id.toString())
    },
    [categories, categoryId]
  )

  useEffect(() => {
    if (!newCategoryId || newCategoryId === categoryId) return

    setCategoryId(newCategoryId)
    setNewCategoryId("")
  }, [categoryId, newCategoryId])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setCategoryId("")
          form.reset(
            defaultValues
              ? { ...defaultValues, date: new Date(defaultValues?.date) }
              : {
                  name: "",
                  date: new Date()
                }
          )
          setCategoryId(otherCategory ? otherCategory.id.toString() : "")
        }
      }}
    >
      <DialogTrigger asChild>
        {defaultValues ? (
          UpdateButton ? (
            UpdateButton
          ) : (
            <Button className="rounded-full">
              <span className="hidden sm:block">Editar Transação</span>
              <ArrowDownUpIcon />
            </Button>
          )
        ) : CreateButton ? (
          CreateButton
        ) : (
          <Button className="rounded-full">
            <span className="hidden sm:block">Adicionar Transação</span>
            <ArrowDownUpIcon />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[95%] rounded-2xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Editar" : "Adicionar"} transação
          </DialogTitle>
          <DialogDescription>
            {defaultValues ? "Altere" : "Insira"} as informações abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Digite o título da transação..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Digite o valor..."
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo da transação</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo da transação" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Select
                  value={categoryId}
                  onValueChange={(e) => {
                    if (e === categoryId) return
                    setCategoryId(e)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherCategory && (
                      <SelectItem
                        key={otherCategory.id}
                        value={otherCategory.id.toString()}
                      >
                        <TransactionCategoryDisplay category={otherCategory} />
                      </SelectItem>
                    )}

                    {categories.map((option) => {
                      if (option.name === "OTHER") return null

                      return (
                        <SelectItem
                          key={option.id}
                          value={option.id.toString()}
                        >
                          <TransactionCategoryDisplay category={option} />
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <TooltipProvider disableHoverableContent={false}>
              <Tooltip disableHoverableContent={false}>
                <TooltipTrigger asChild>
                  <AddTransactionCategory
                    categories={categories}
                    disabled={!canAddCategory}
                    handleNewCategory={handleAddNewCategory}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {!canAddCategory &&
                    "Você atingiu o limite de Categorias Personalizadas. Um upgrade de plano permitirá criar mais."}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pagamento</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da transação</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", {
                              locale: ptBR
                            })
                          ) : (
                            <span>Data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          locale={ptBR}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-3 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!defaultValues && !canAddTransaction}
              >
                {defaultValues ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
