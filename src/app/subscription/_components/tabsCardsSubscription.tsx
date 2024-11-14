"use client"

import { useState } from "react"

import { CurrentSubscriptionType } from "@/actions/getCurrentSubscription"
import { ProductType } from "@/actions/getPricesIds"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_ui/tabs"
import CardSubscription from "./cardSubscription"

interface TabsCardsSubscriptionProps {
  subscriptionPlan: CurrentSubscriptionType
  standardList: {
    has: boolean
    label: string
  }[]
  advancedList: {
    has: boolean
    label: string
  }[]
  premiumList: {
    has: boolean
    label: string
  }[]
  advanced: ProductType
  premium: ProductType
}

export const TabsCardsSubscription = ({
  subscriptionPlan,
  advancedList,
  premiumList,
  standardList,
  advanced,
  premium
}: TabsCardsSubscriptionProps) => {
  const [isLoadingClickCheckout, setIsLoadingClickCheckout] = useState(false)

  return (
    <Tabs
      defaultValue={
        subscriptionPlan.includes("yearly") ? "annually" : "monthly"
      }
      className="flex flex-1 flex-col items-center"
    >
      <TabsList className="grid w-[240px] grid-cols-2 sm:w-[400px]">
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
            isLoading={isLoadingClickCheckout}
            setIsLoading={setIsLoadingClickCheckout}
            key={"free-monthly"}
            priceId={undefined}
            title={"Plano Standard"}
            current={subscriptionPlan === "free"}
            price={0}
            list={standardList}
          />

          {!!advanced.monthly && (
            <CardSubscription
              isLoading={isLoadingClickCheckout}
              setIsLoading={setIsLoadingClickCheckout}
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
              isLoading={isLoadingClickCheckout}
              setIsLoading={setIsLoadingClickCheckout}
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
            isLoading={isLoadingClickCheckout}
            setIsLoading={setIsLoadingClickCheckout}
            key={"free-annually"}
            priceId={undefined}
            current={subscriptionPlan === "free"}
            title={"Plano Standard"}
            price={0}
            list={standardList}
          />

          {!!advanced.annually && (
            <CardSubscription
              isLoading={isLoadingClickCheckout}
              setIsLoading={setIsLoadingClickCheckout}
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
              isLoading={isLoadingClickCheckout}
              setIsLoading={setIsLoadingClickCheckout}
              diffYear={
                (((premium.monthly?.price || 1) * 12 - premium.annually.price) /
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
  )
}
