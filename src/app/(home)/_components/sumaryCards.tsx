import { Transaction, TransactionCategory } from "@prisma/client"
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon
} from "lucide-react"

import SumaryCard from "./sumaryCard"
import { TransactionsPieChart } from "./transactiosPieChart"
import { ExpensesPerCategory } from "./expensesPerCategory"

interface SumaryCardsProps {
  transactions: Transaction[]
  categories: TransactionCategory[]
}

const SumaryCards = async ({ categories, transactions }: SumaryCardsProps) => {
  const { depositsTotal, investmentsTotal, expensesTotal } =
    transactions.reduce(
      (totals, transaction) => {
        switch (transaction.type) {
          case "DEPOSIT":
            totals.depositsTotal += Number(transaction.amount)
            break
          case "INVESTMENT":
            totals.investmentsTotal += Number(transaction.amount)
            break
          case "EXPENSE":
            totals.expensesTotal += Number(transaction.amount)
            break
        }
        return totals
      },
      { depositsTotal: 0, investmentsTotal: 0, expensesTotal: 0 }
    )

  const balance = depositsTotal - investmentsTotal - expensesTotal

  return (
    <div className="grid h-full grid-cols-10 grid-rows-4 gap-x-4 gap-y-5 sm:grid-rows-5">
      <div className="col-span-10 row-span-1">
        <SumaryCard
          title="Saldo"
          size="large"
          amount={balance}
          categories={categories}
          highlighted
          icon={
            <div className="rounded-xl bg-black p-[.625rem]">
              <WalletIcon size={16} />
            </div>
          }
        />
      </div>
      <div className="col-span-10 row-span-1 sm:col-span-4">
        <SumaryCard
          title="Investimentos"
          amount={investmentsTotal}
          highlighted
          icon={
            <div className="rounded-xl bg-secondary/10 p-[.625rem] text-secondary">
              <PiggyBankIcon size={16} />
            </div>
          }
        />
      </div>

      <div className="col-span-10 row-span-1 sm:col-span-3">
        <SumaryCard
          title="Receita"
          amount={depositsTotal}
          icon={
            <div className="rounded-xl bg-tertiary/10 p-[.625rem] text-tertiary">
              <TrendingUpIcon size={16} />
            </div>
          }
        />
      </div>

      <div className="col-span-10 row-span-1 sm:col-span-3">
        <SumaryCard
          title="Despesas"
          amount={expensesTotal}
          icon={
            <div className="rounded-xl bg-danger/10 p-[.625rem] text-danger">
              <TrendingDownIcon size={16} />
            </div>
          }
        />
      </div>

      <div className="col-span-10 row-span-3 sm:col-span-4">
        <TransactionsPieChart
          depositsTotal={depositsTotal}
          investmentsTotal={investmentsTotal}
          expensesTotal={expensesTotal}
        />
      </div>

      <div className="col-span-10 row-span-3 sm:col-span-6">
        <ExpensesPerCategory
          expensesTotal={expensesTotal}
          categories={categories}
          transactions={transactions}
        />
      </div>
    </div>
  )
}

export default SumaryCards
