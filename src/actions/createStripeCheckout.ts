"use server"

import { auth } from "@clerk/nextjs/server"
import { initStripe } from "./initStripe"

export const createSripeCheckout = async (priceId: string) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const BASE_HOST_URL = process.env.DASHBOARD_HOST

  if (!BASE_HOST_URL) {
    throw new Error("Dashboard host url not found")
  }

  const stripe = initStripe()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: BASE_HOST_URL,
    cancel_url: BASE_HOST_URL,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    subscription_data: {
      metadata: {
        cleck_user_id: userId
      }
    }
  })

  console.log({ session })
  return { sessionId: session.id, url: session.url }
}
