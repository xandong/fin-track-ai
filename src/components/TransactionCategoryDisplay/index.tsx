import { formatTransactionCategory } from "@/utils/formatter"

interface TransactionCategoryDisplayProps {
  category: {
    name: string
  } | null
}

export const TransactionCategoryDisplay = ({
  category
}: TransactionCategoryDisplayProps) => {
  return formatTransactionCategory(category?.name)
}
