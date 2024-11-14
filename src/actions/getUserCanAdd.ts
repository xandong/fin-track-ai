import { auth } from "@clerk/nextjs/server"
import { getCurrentSubscription } from "./getCurrentSubscription"
import { getUserCountsPerMonth } from "./getUserCountsPerMonth"
import { DEFAULT_LIMITS } from "@/utils/constants/defaults"

interface GetUserCanAddResponse {
  transactions: {
    limit: number
    current: number
    canAdd: boolean
  }
  categories: {
    limit: number
    current: number
    canAdd: boolean
  }
  reports: {
    limit: number
    current: number
    canAdd: boolean
  }
}

export const getUserCanAdd = async (): Promise<GetUserCanAddResponse> => {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthenticated")

  const plan = await getCurrentSubscription()

  let [transactionsLimit, categoriesLimit, reportsLimit] = [
    DEFAULT_LIMITS.free.transactions,
    DEFAULT_LIMITS.free.categories,
    DEFAULT_LIMITS.free.reports
  ]

  const { categoriesCount, transactionsCount, reportsCount } =
    await getUserCountsPerMonth()

  if (plan === "advanced-monthly" || plan === "advanced-yearly") {
    categoriesLimit = DEFAULT_LIMITS.advanced.categories
    transactionsLimit = DEFAULT_LIMITS.advanced.transactions
    reportsLimit = DEFAULT_LIMITS.advanced.reports
  }

  if (plan === "premium-monthly" || plan === "premium-yearly") {
    categoriesLimit = DEFAULT_LIMITS.premium.categories
    transactionsLimit = DEFAULT_LIMITS.premium.transactions
    reportsLimit = DEFAULT_LIMITS.premium.reports
  }

  return {
    transactions: {
      limit: transactionsLimit,
      current: transactionsCount,
      canAdd: transactionsCount < transactionsLimit
    },
    categories: {
      limit: categoriesLimit,
      current: categoriesCount,
      canAdd: categoriesCount < categoriesLimit
    },
    reports: {
      limit: reportsLimit,
      current: reportsCount,
      canAdd: reportsCount < categoriesLimit
    }
  }
}
