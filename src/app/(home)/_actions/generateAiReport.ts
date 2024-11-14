"use server"

import { getCurrentSubscription } from "@/actions/getCurrentSubscription"
import { getUserCanAdd } from "@/actions/getUserCanAdd"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { isMatch } from "date-fns"

import OpenAI from "openai"
import { z } from "zod"

interface GenerateAiReportParams {
  year: string
  month: string
}

const generateAiReportSchema = z.object({
  month: z.string().refine((value) => isMatch(value, "MM")),
  year: z.string().refine((value) => isMatch(value, "yyyy"))
})

export const generateAiReport = async ({
  month,
  year
}: GenerateAiReportParams) => {
  generateAiReportSchema.parse({ month, year })

  const { userId } = await auth()

  if (!userId) throw new Error("Unauthenticated")

  if (!process.env.OPEN_AI_SECRET_KEY) throw new Error("OpenAI key not found")

  const openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY
  })

  const currentSubscription = await getCurrentSubscription()
  const {
    reports: { canAdd }
  } = await getUserCanAdd()

  if (
    !canAdd &&
    currentSubscription !== "premium-monthly" &&
    currentSubscription !== "premium-yearly"
  )
    throw new Error("Limit exceded. Upgrade your plan")

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`)
      },
      userId: userId
    },
    include: {
      category: true
    }
  })

  if (transactions.length === 0) return ""

  // ChatGPT

  const content = `Gere um relatório com insights sobre as minhas finanças. Forneça uma análise com dicas e orientações de como melhorar minha vida financeira. Inicie sempre com um titulo padrão {"Relatório dd/mm/yyy"}. Nas despesas adicione sobre o que foram, um resumo bem construido e formatado. Se achar necessário uma conclusão, tudo bem. Mas ao final, não interaja. Você irá gerar um relatório para uma aplicação de controle de gastos, então não recomende isso como uma dica, pois será redundante. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{VALOR}-{TIPO}-{METODO_PAGAMENTO}-{CATEGORIA_DE_GASTO}. São elas:
  ${transactions
    .map(
      (transaction) =>
        `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.paymentMethod}-${transaction.type}-${transaction.category?.name}`
    )
    .join(";")}`
  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças."
      },
      {
        role: "user",
        content
      }
    ]
  })

  const generatedAiReport = completion.choices[0].message.content

  if (generatedAiReport) {
    await prisma.report.create({
      data: {
        report: generatedAiReport,
        userId,
        transactionsId: transactions.map((el) => el.id)
      }
    })
  }

  return generatedAiReport
}
