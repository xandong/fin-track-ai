"use client"

import { useCallback } from "react"
import { ArrowDownUpIcon, CalendarIcon } from "lucide-react"
import {
  $Enums,
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
} from "@/constants/transactions"
import { Popover, PopoverContent, PopoverTrigger } from "../_ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "../_ui/calendar"
import { TransactionCategoryDisplay } from "../TransactionCategoryDisplay"

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "o nome é obrigatório"
  }),
  amount: z.string().trim().min(1, {
    message: "O valor é obrigatório"
  }),
  category: z.string().trim(),
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
  categories: {
    id: number
    name: string
    userId: string | null
    type: $Enums.CategoryType
    createdAt: Date
    updateAt: Date
  }[]
}

export const AddTransaction = ({ categories }: AddTransactionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // name: "",
      // amount: 0,
      // category: "OTHER",
      date: new Date()
      // paymentMethod: TransactionPaymentMethod.CASH,
      // type: TransactionType.EXPENSE
    }
  })

  const type = form.watch("type")

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      console.log({ data })
      form.handleSubmit(() => {})
    },
    [form]
  )

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset()
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
                    <MoneyInput placeholder="Digite o valor..." {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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

            {type === "EXPENSE" && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor gasto em</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((option) => (
                            <SelectItem key={option.id} value={option.name}>
                              <TransactionCategoryDisplay category={option} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
