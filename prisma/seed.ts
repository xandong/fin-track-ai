import { CategoryType, PrismaClient } from "@prisma/client";
import { categories } from "./data"

const prisma = new PrismaClient()

const main = async () => {
  try {
    await prisma.transactionCategory.deleteMany()

    await prisma.transactionCategory.createMany({
      data: categories.map(category => ({
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