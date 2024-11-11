"use server"

import { Button } from "@/components/_ui/button"
import { Navbar } from "@/components/Navbar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import CardSubscription from "./_components/cardSubscription"
import { getPricesIds } from "@/actions/getPricesIds"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_ui/tabs"
import { getSubscriptionPage } from "@/actions/getSubscriptionPage"
import { ScrollArea } from "@/components/_ui/scroll-area"

const Subscription = async () => {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  const { categories: categoriesCount, transactions: transactionsCount } =
    await getSubscriptionPage()

  const {
    prices: { advanced, premium }
  } = await getPricesIds()

  const standardList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Apenas 5 transações por dia (${transactionsCount}/5)`
    },
    {
      has: true,
      label: `Apenas 3 novas categorias (${categoriesCount}/3)`
    },
    {
      has: false,
      label: "Relatórios de IA ilimitados"
    },
    {
      has: false,
      label: "Transações ilimitadas"
    },
    {
      has: false,
      label: "Categorias de gasto ilimitadas"
    }
  ]
  const advancedList: { has: boolean; label: string }[] = [
    {
      has: true,
      label: `Apenas 15 transações por dia (${transactionsCount}/15)`
    },
    {
      has: true,
      label: `Apenas 15 novas categorias (${categoriesCount}/15)`
    },
    {
      has: true,
      label: "Apenas 5 Relatórios de IA por mês (0/5)"
    },
    {
      has: false,
      label: "Transações ilimitadas"
    },
    {
      has: false,
      label: "Categorias de gasto ilimitadas"
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
      label: "Gere Relatórios Avançados Ilimitados com IA"
    },
    // {
    //   has: true,
    //   label: "Salve e Organize seus Relatórios para Acessos Futuros"
    // },
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
    <ScrollArea className="h-screen w-screen">
      <div className="flex h-full w-full flex-col items-center">
        <Navbar />

        <main className="flex w-full max-w-[90rem] flex-1 flex-col gap-6 p-6">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl font-bold leading-8">Assinatura</h1>
            <div>
              <Button>Action</Button>
            </div>
          </div>

          <div className="flex flex-1">
            <Tabs
              defaultValue="monthly"
              className="flex flex-1 flex-col items-center"
            >
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="monthly">Assinatura mensal</TabsTrigger>
                <TabsTrigger value="annually">Assinatura anual</TabsTrigger>
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
                    title={"Standard"}
                    price={0}
                    list={standardList}
                  />

                  {!!advanced.monthly && (
                    <CardSubscription
                      key={advanced.monthly.priceId}
                      priceId={advanced.monthly.priceId}
                      title={advanced.monthly.title}
                      price={advanced.monthly.price}
                      list={advancedList}
                    />
                  )}

                  {!!premium.monthly && (
                    <CardSubscription
                      key={premium.monthly.priceId}
                      priceId={premium.monthly.priceId}
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
                    title={"Standard"}
                    price={0}
                    current
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
    </ScrollArea>
  )
}

export default Subscription
