const formatDisplay = (str?: string) =>
  str ? `${str.charAt(0)}${str.slice(1).toLowerCase()}` : "-"

export const formatTransactionCategory = (category?: string) => {
  switch (category) {
    case "HOUSING":
      return "Moradia"

    case "TRANSPORTATION":
      return "Transporte"

    case "FOOD":
      return "Comida"

    case "ENTERTAINMENT":
      return "Entretenimento"

    case "HEALTH":
      return "Saúde"

    case "UTILITY":
      return "Utilidade"

    case "SALARY":
      return "Salário"

    case "EDUCATION":
      return "Educação"

    case "OTHER":
      return "Outro"

    default:
      return formatDisplay(category)
  }
}
