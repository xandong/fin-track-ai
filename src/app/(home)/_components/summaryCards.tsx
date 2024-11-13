import { Transaction, TransactionCategory } from "@prisma/client"
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon
} from "lucide-react"

import SummaryCard from "./summaryCard"

import { ExpensesPerCategory } from "./expensesPerCategory"
import { TransactionsPieChart } from "./transactionsPieChart"

interface SummaryCardsProps {
  transactions: Transaction[]
  categories: TransactionCategory[]
  canAddTransaction?: boolean
  canAddCategory?: boolean
}

const SummaryCards = async ({
  categories,
  transactions,
  canAddTransaction,
  canAddCategory
}: SummaryCardsProps) => {
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
    <div className="grid h-full grid-cols-10 grid-rows-4 gap-x-4 gap-y-4 sm:grid-rows-5">
      <div className="col-span-10 row-span-1">
        <SummaryCard
          title="Saldo"
          size="large"
          amount={balance}
          categories={categories}
          canAddTransaction={canAddTransaction}
          canAddCategory={canAddCategory}
          highlighted
          icon={
            <div className="rounded-xl bg-black p-[.625rem]">
              <WalletIcon size={16} />
            </div>
          }
        />
      </div>
      <div className="col-span-10 row-span-1 sm:col-span-4">
        <SummaryCard
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
        <SummaryCard
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
        <SummaryCard
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

export default SummaryCards
