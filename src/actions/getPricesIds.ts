"use server"

import { initStripe } from "./initStripe"

interface ProductType {
  monthly:
    | {
        priceId: string
        price: number
        title: string
      }
    | undefined
  annually:
    | {
        priceId: string
        price: number
        title: string
      }
    | undefined
}

export const getPricesIds = async () => {
  const stripe = initStripe()

  const data = (await stripe.prices.list()).data

  // Advanced
  const advancedMonthlyPrice = process.env.STRIPE_ADVANCED_PLAN_MONTHLY_PRICE_ID
  const advancedYearlyPrice = process.env.STRIPE_ADVANCED_PLAN_YEARLY_PRICE_ID

  // Premium
  const premiumMonthlyPrice = process.env.STRIPE_PREMIUM_PLAN_MONTHLY_PRICE_ID
  const premiumYearlyPrice = process.env.STRIPE_PREMIUM_PLAN_YEARLY_PRICE_ID

  const prices: {
    advanced: ProductType
    premium: ProductType
  } = {
    advanced: {
      annually: undefined,
      monthly: undefined
    },
    premium: {
      annually: undefined,
      monthly: undefined
    }
  }

  data.forEach((price) => {
    if (advancedMonthlyPrice && price.product === advancedMonthlyPrice) {
      return (prices.advanced.monthly = {
        title: "Plano Advanced",
        priceId: price.id,
        price: price.unit_amount ? price.unit_amount / 100 : 0
      })
    }

    if (advancedYearlyPrice && price.product === advancedYearlyPrice) {
      return (prices.advanced.annually = {
        title: "Plano Advanced",
        priceId: price.id,
        price: price.unit_amount ? price.unit_amount / 100 : 0
      })
    }

    if (premiumMonthlyPrice && price.product === premiumMonthlyPrice) {
      return (prices.premium.monthly = {
        title: "Plano Premium",
        priceId: price.id,
        price: price.unit_amount ? price.unit_amount / 100 : 0
      })
    }

    if (premiumYearlyPrice && price.product === premiumYearlyPrice) {
      return (prices.premium.annually = {
        title: "Plano Premium",
        priceId: price.id,
        price: price.unit_amount ? price.unit_amount / 100 : 0
      })
    }
  })

  return { prices }
}
