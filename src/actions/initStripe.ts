import Stripe from "stripe"

export const initStripe = () => {
  const API_KEY = process.env.STRIPE_SECRET_KEY

  if (!API_KEY) {
    throw new Error("Stripe secret key not found")
  }

  const stripe = new Stripe(API_KEY, {
    apiVersion: "2024-10-28.acacia"
  })

  return stripe
}
