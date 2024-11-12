"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/_ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const MONTH_OPTIONS: { value: string; label: string }[] = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" }
]

const getYearOptions = (): string[] => {
  const INITIAL_YEAR = 2024
  const LAST_YEAR = new Date().getFullYear() + 1

  const years: string[] = []

  for (let index = INITIAL_YEAR; index <= LAST_YEAR; index++) {
    years.push(index.toString())
  }

  return years
}

const YEAR_OPTIONS = getYearOptions()

const TimeSelect = () => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const month =
    searchParams.get("month") &&
    !!MONTH_OPTIONS.find((el) => el.value === searchParams.get("month"))
      ? searchParams.get("month")!
      : (new Date().getMonth() + 1).toString()

  const year =
    searchParams.get("year") &&
    YEAR_OPTIONS.find((el) => el === searchParams.get("year"))
      ? searchParams.get("year")!
      : new Date().getFullYear().toString()

  useEffect(() => {
    push(`/?month=${month}&year=${year}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMonthChange = ({
    m: month,
    y: year
  }: {
    m: string | undefined
    y: string | undefined
  }) => {
    push(`/?month=${month}&year=${year}`)
  }

  return (
    <div className="flex flex-row gap-2">
      <Select
        onValueChange={(value) => handleMonthChange({ m: value, y: year })}
        defaultValue={month}
      >
        <SelectTrigger className="w-[112px] rounded-full">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTH_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleMonthChange({ m: month, y: value })}
        defaultValue={year}
      >
        <SelectTrigger className="w-[112px] rounded-full">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {YEAR_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TimeSelect
