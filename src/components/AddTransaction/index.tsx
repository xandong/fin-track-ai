"use client"

import { useCallback, useEffect, useState } from "react"
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

import { addTransaction } from "@/actions/addTransaction"
import { AddTransactionCategory } from "../AddTransactionCategory"

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

interface AddTransactionProps {
  categories: TransactionCategory[]
}

export const AddTransaction = ({ categories }: AddTransactionProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const otherCategory = categories.find((category) => category.name == "OTHER")
  const [categoryId, setCategoryId] = useState<string>(
    otherCategory ? otherCategory.id.toString() : ""
  )
  const [newCategoryId, setNewCategoryId] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: new Date()
    }
  })

  const type = form.watch("type")

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      try {
        await addTransaction({
          ...data,
          categoryId:
            data.type === "EXPENSE" && categoryId
              ? Number(categoryId)
              : undefined
        })
        setIsOpen(false)
        form.reset()
      } catch (error) {
        console.error("ERROR", { error })
      }
    },
    [categoryId, form]
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
          form.reset({
            name: "",
            date: new Date()
          })
          setCategoryId(otherCategory ? otherCategory.id.toString() : "")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-full">
          Adicionar Transação
          <ArrowDownUpIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95%] rounded-2xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Adicionar transação</DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
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

            {type === "EXPENSE" && (
              <FormItem>
                <FormLabel>Valor gasto em</FormLabel>
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
                          <TransactionCategoryDisplay
                            category={otherCategory}
                          />
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
            )}

            {type === "EXPENSE" &&
              otherCategory?.id.toString() === categoryId && (
                <AddTransactionCategory
                  categories={categories}
                  handleNewCategory={handleAddNewCategory}
                />
              )}

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
                  <FormLabel>Método de pagamento</FormLabel>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
