"use client"

import {
  CurretnSubscriptionType,
  getCurrentSubscription
} from "@/actions/getCurrentSubscription"
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from "react"

const SubscriptionContext = createContext<{
  subscriptionPlan: CurretnSubscriptionType
}>({ subscriptionPlan: "free" })

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<CurretnSubscriptionType>("free")

  useEffect(() => {
    const getSubscriptionPlan = async () => {
      try {
        const response = await getCurrentSubscription()
        setSubscriptionPlan(response)
      } catch (error) {
        console.error("Error fetching subscription plan:", error)
      }
    }

    getSubscriptionPlan()
  }, [])

  return (
    <SubscriptionContext.Provider value={{ subscriptionPlan }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
