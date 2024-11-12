import { CategoryType, PrismaClient } from "@prisma/client"
import { DEFAULT_CATEGORIES } from "./data"

const prisma = new PrismaClient()

const main = async () => {
  try {
    const categories = await prisma.transactionCategory.findMany({
      where: {
        type: CategoryType.PUBLIC
      }
    })

    const uniqueCategories = DEFAULT_CATEGORIES.filter(
      (defaultCategory) =>
        !!categories.find((category) => !(category.name === defaultCategory))
    )

    await prisma.transactionCategory.createMany({
      data: uniqueCategories.map((category) => ({
        name: category,
        type: CategoryType.PUBLIC
      })),
      skipDuplicates: true
    })
  } catch (error) {
    console.error("[SEED]: ", { error })
  } finally {
    prisma.$disconnect()
  }
}

main()
