-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "base";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "transactional";

-- CreateEnum
CREATE TYPE "transactional"."TransactionType" AS ENUM ('DEPOSIT', 'EXPENSE', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "transactional"."TransactionPaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'BANK_SLIP', 'CASH', 'PIX', 'OTHER');

-- CreateEnum
CREATE TYPE "transactional"."CategoryType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "transactional"."transactions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" MONEY NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER,
    "type" "transactional"."TransactionType" NOT NULL,
    "paymentMethod" "transactional"."TransactionPaymentMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactional"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "type" "transactional"."CategoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_name_key" ON "transactional"."categories"("userId", "name");

-- AddForeignKey
ALTER TABLE "transactional"."transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "transactional"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
