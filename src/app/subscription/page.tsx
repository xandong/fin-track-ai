"use server"

import { Navbar } from "@/components/Navbar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import CardSubscription from "./_components/cardSubscription"
import { getPricesIds } from "@/actions/getPricesIds"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_ui/tabs"
import { getUserCountsPerMonth } from "@/actions/getUserCountsPerMonth"
import { getCurrentSubscription } from "@/actions/getCurrentSubscription"
import { ManageSubscription } from "./_components/manageSubscription"
import { DEFAULT_LIMITS } from "@/utils/constants/defaults"

const Subscription = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  const { categoriesCount, transactionsCount, reportsCount } =
    await getUserCountsPerMonth()

  const {
    prices: { advanced, premium }
  } = await getPricesIds()
  const subscriptionPlan = await getCurrentSubscription()

  const standardList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Apenas ${DEFAULT_LIMITS.free.transactions} transações por dia (${transactionsCount}/${DEFAULT_LIMITS.free.transactions})`
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
      label: "Crie Categorias de gasto ilimitadas"
    }
  ]
  const advancedList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Apenas ${DEFAULT_LIMITS.advanced.transactions} transações por dia (${transactionsCount}/${DEFAULT_LIMITS.advanced.transactions})`
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
      label: "Crie Categorias de gasto ilimitadas"
    }
  ]
  const premiumList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Adicione Transações Ilimitadas Diariamente`
    },
    {
      has: true,
      label: `Crie Categorias de Gastos Ilimitadas 100% Personalizadas`
    },
    {
      has: true,
      label: "Gere Relatórios Avançados com IA"
    },
    {
      has: true,
      label: "Salve e Organize seus Relatórios para Acessos Futuros"
    },
    {
      has: true,
      label: "Exporte seus Relatórios em PDF para Analisar Quando Quiser"
    },
    {
      has: true,
      label: "Suporte Prioritário 24/7"
    }
  ]

  return (
    <div className="flex h-full w-full flex-col items-center">
      <Navbar reportsAccess={subscriptionPlan !== "free"} />

      <main className="flex w-full max-w-[90rem] flex-1 flex-col gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold leading-8">Assinatura</h1>
          {subscriptionPlan !== "free" ? <ManageSubscription /> : <div />}
        </div>

        <div className="flex flex-1">
          <Tabs
            defaultValue={
              subscriptionPlan.includes("yearly") ? "annually" : "monthly"
            }
            className="flex flex-1 flex-col items-center"
          >
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="annually">Anual</TabsTrigger>
            </TabsList>

            <div className="flex pt-6">
              <TabsContent
                hidden
                value="monthly"
                className="flex flex-1 flex-col justify-start gap-6 xl:flex-row"
              >
                <CardSubscription
                  key={"free-monthly"}
                  priceId={undefined}
                  title={"Plano Standard"}
                  current={subscriptionPlan === "free"}
                  price={0}
                  list={standardList}
                />

                {!!advanced.monthly && (
                  <CardSubscription
                    key={advanced.monthly.priceId}
                    priceId={advanced.monthly.priceId}
                    current={subscriptionPlan === "advanced-monthly"}
                    title={advanced.monthly.title}
                    price={advanced.monthly.price}
                    list={advancedList}
                  />
                )}

                {!!premium.monthly && (
                  <CardSubscription
                    key={premium.monthly.priceId}
                    priceId={premium.monthly.priceId}
                    current={subscriptionPlan === "premium-monthly"}
                    title={premium.monthly.title}
                    price={premium.monthly.price}
                    list={premiumList}
                  />
                )}
              </TabsContent>

              <TabsContent
                hidden
                value="annually"
                className="flex flex-1 flex-col justify-start gap-6 xl:flex-row"
              >
                <CardSubscription
                  key={"free-annually"}
                  priceId={undefined}
                  current={subscriptionPlan === "free"}
                  title={"Plano Standard"}
                  price={0}
                  list={standardList}
                />

                {!!advanced.annually && (
                  <CardSubscription
                    diffYear={
                      (((advanced.monthly?.price || 1) * 12 -
                        advanced.annually.price) /
                        ((advanced.monthly?.price || 1) * 12)) *
                      100
                    }
                    key={advanced.annually.priceId}
                    priceId={advanced.annually.priceId}
                    current={subscriptionPlan === "advanced-yearly"}
                    title={advanced.annually.title}
                    price={advanced.annually.price}
                    list={advancedList}
                  />
                )}

                {!!premium.annually && (
                  <CardSubscription
                    diffYear={
                      (((premium.monthly?.price || 1) * 12 -
                        premium.annually.price) /
                        ((premium.monthly?.price || 1) * 12)) *
                      100
                    }
                    key={premium.annually.priceId}
                    priceId={premium.annually.priceId}
                    current={subscriptionPlan === "premium-yearly"}
                    title={premium.annually.title}
                    price={premium.annually.price}
                    list={premiumList}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default Subscription
