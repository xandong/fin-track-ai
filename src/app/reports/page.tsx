"use server"

import { CategoryType } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

import { Sidebar } from "@/components/Sidebar"
import { redirect } from "next/navigation"
import { getUserCanAdd } from "@/actions/getUserCanAdd"
import { getCurrentSubscription } from "@/actions/getCurrentSubscription"
import { ReportsTable } from "./_components/reportsTable"
import { WrapperLayout } from "@/components/WrapperLayout"

const Reports = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  const {
    reports: { canAdd: canAddReport }
  } = await getUserCanAdd()

  const currentSubscription = await getCurrentSubscription()

  if (currentSubscription === "free") {
    redirect("/")
  }

  const transactions = await prisma.transaction.findMany({
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    where: {
      userId: userId
    }
  })

  const categories = await prisma.transactionCategory.findMany({
    where: {
      OR: [
        {
          type: CategoryType.PUBLIC
        },
        {
          userId: userId,
          type: CategoryType.PRIVATE
        }
      ]
    }
  })

  const reports = await prisma.report.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <>
      <Sidebar reportsAccess={true} />
      <WrapperLayout title="Relatórios com IA" actions={<div></div>}>
        <ReportsTable
          canAddReport={canAddReport}
          reports={JSON.parse(JSON.stringify(reports))}
          categories={JSON.parse(JSON.stringify(categories))}
          transactions={JSON.parse(JSON.stringify(transactions))}
        />
      </WrapperLayout>
    </>
  )
}

export default Reports
