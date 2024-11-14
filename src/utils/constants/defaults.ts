export const DEFAULT_LIMITS = {
  free: { categories: 5, transactions: 10, reports: 0 },
  advanced: { categories: 15, transactions: 30, reports: 5 },
  premium: { transactions: 10000, categories: 10000, reports: 1000 }
}

export const DEFAULT_TOAST_MESSAGES = {
  error: {
    title: "Algo de errado aconteceu",
    description:
      "Estamos enfrentando um problema inesperado, tente novamente mais tarde."
  }
}
