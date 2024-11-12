-- CreateTable
CREATE TABLE "transactional"."reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "transactionsId" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);
