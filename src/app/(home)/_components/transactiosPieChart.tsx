"use client"

import * as React from "react"
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/_ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/_ui/chart"
import { TransactionType } from "@prisma/client"

interface TransactionsPieChartProps {
  depositsTotal: number
  investmentsTotal: number
  expensesTotal: number
}

export function TransactionsPieChart({
  depositsTotal,
  expensesTotal,
  investmentsTotal
}: TransactionsPieChartProps) {
  const chartConfig = {
    [TransactionType.DEPOSIT]: {
      label: "Receita",
      color: "hsla(102, 59%, 44%, 0.9)"
    },
    [TransactionType.EXPENSE]: {
      label: "Gastos",
      color: "	hsla(0, 81%, 55%, 0.9)"
    },
    [TransactionType.INVESTMENT]: {
      label: "Investido",
      color: "hsla(284, 42%, 49%, 0.9)"
    }
  } satisfies ChartConfig

  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      total: depositsTotal,
      fill: "hsla(102, 59%, 44%, 0.9)"
    },
    {
      type: TransactionType.EXPENSE,
      total: expensesTotal,
      fill: "	hsla(0, 81%, 55%, 0.9)"
    },
    {
      type: TransactionType.INVESTMENT,
      total: investmentsTotal,
      fill: "hsla(284, 42%, 49%, 0.9)"
    }
  ]

  const totalAmount = depositsTotal + expensesTotal + investmentsTotal

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0"></CardHeader>
      <CardContent className="flex-1 pb-12">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="gap-2" />}
            />
            <Pie
              data={chartData}
              format={"sim"}
              dataKey="total"
              nameKey="type"
              innerRadius={70}
              strokeWidth={5}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row justify-center gap-2 text-sm">
        <div className="flex w-[80%] flex-col items-center gap-3">
          <PieDescriptionCard
            type="Receita"
            percent={(depositsTotal * 100) / totalAmount}
            icon={
              <div className="rounded-xl bg-tertiary/10 p-[.625rem] text-tertiary">
                <TrendingUpIcon size={16} />
              </div>
            }
          />

          <PieDescriptionCard
            type="Despesas"
            percent={(expensesTotal * 100) / totalAmount}
            icon={
              <div className="rounded-xl bg-danger/10 p-[.625rem] text-danger">
                <TrendingDownIcon size={16} />
              </div>
            }
          />

          <PieDescriptionCard
            type="Investimentos"
            percent={(investmentsTotal * 100) / totalAmount}
            icon={
              <div className="rounded-xl bg-secondary/10 p-[.625rem] text-secondary">
                <PiggyBankIcon size={16} />
              </div>
            }
          />
        </div>
      </CardFooter>
    </Card>
  )
}

interface PieDescriptionCardProps {
  type: string
  percent: number
  icon: React.ReactNode
}

const PieDescriptionCard = ({
  icon,
  percent,
  type
}: PieDescriptionCardProps) => {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        {icon}

        <div className="text-sm font-semibold text-zinc-500">{type}</div>
      </div>
      <div className="text-sm font-bold text-white">{percent.toFixed(2)}%</div>
    </div>
  )
}
