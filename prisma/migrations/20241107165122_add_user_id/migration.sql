/*
  Warnings:

  - Added the required column `userId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactional"."transactions" ADD COLUMN     "userId" TEXT NOT NULL;