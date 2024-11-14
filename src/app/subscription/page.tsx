"use server"

import { Sidebar } from "@/components/Sidebar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getPricesIds } from "@/actions/getPricesIds"
import { getUserCountsPerMonth } from "@/actions/getUserCountsPerMonth"
import { getCurrentSubscription } from "@/actions/getCurrentSubscription"
import { ManageSubscription } from "./_components/manageSubscription"
import { DEFAULT_LIMITS } from "@/utils/constants/defaults"
import { WrapperLayout } from "@/components/WrapperLayout"
import { TabsCardsSubscription } from "./_components/tabsCardsSubscription"

const Subscription = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  const [
    { categoriesCount, transactionsCount, reportsCount },
    {
      prices: { advanced, premium }
    },
    subscriptionPlan
  ] = await Promise.all([
    await getUserCountsPerMonth(),
    await getPricesIds(),
    await getCurrentSubscription()
  ])

  const standardList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Crie ${DEFAULT_LIMITS.free.transactions} transações por mês (${transactionsCount}/${DEFAULT_LIMITS.free.transactions})`
    },
    {
      has: true,
      label: `Apenas ${DEFAULT_LIMITS.free.categories} novas categorias (${categoriesCount}/${DEFAULT_LIMITS.free.categories})`
    },
    {
      has: false,
      label: "Gere Relatórios Avançados com IA"
    },
    {
      has: false,
      label: "Adicione Transações ilimitadas"
    },
    {
      has: false,
      label: "Crie Categorias ilimitadas"
    }
  ]
  const advancedList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Crie ${DEFAULT_LIMITS.advanced.transactions} transações por mês (${transactionsCount}/${DEFAULT_LIMITS.advanced.transactions})`
    },
    {
      has: true,
      label: `Apenas ${DEFAULT_LIMITS.advanced.categories} novas categorias (${categoriesCount}/${DEFAULT_LIMITS.advanced.categories})`
    },
    {
      has: true,
      label: `Apenas ${DEFAULT_LIMITS.advanced.reports} Relatórios com IA por mês (${reportsCount}/${DEFAULT_LIMITS.advanced.reports})`
    },
    {
      has: false,
      label: "Adicione Transações ilimitadas"
    },
    {
      has: false,
      label: "Crie Categorias ilimitadas"
    }
  ]
  const premiumList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Adicione Transações Ilimitadas Diariamente`
    },
    {
      has: true,
      label: `Crie Categorias Ilimitadas 100% Personalizadas`
    },
    {
      has: true,
      label: "Gere Relatórios Avançados Ilimitados com IA"
    },
    {
      has: true,
      label: "Salve e Organize seus Relatórios para Acessos Futuros"
    },
    // {
    //   has: true,
    //   label: "Exporte seus Relatórios em PDF para Analisar Quando Quiser"
    // },
    {
      has: true,
      label: "Suporte Prioritário 24/7"
    }
  ]

  return (
    <>
      <Sidebar reportsAccess={subscriptionPlan !== "free"} />

      <WrapperLayout
        title="Assinatura"
        actions={subscriptionPlan !== "free" ? <ManageSubscription /> : <div />}
      >
        <div className="flex flex-1">
          <TabsCardsSubscription
            subscriptionPlan={subscriptionPlan}
            standardList={standardList}
            advanced={advanced}
            advancedList={advancedList}
            premium={premium}
            premiumList={premiumList}
          />
        </div>
      </WrapperLayout>
    </>
  )
}

export default Subscription
