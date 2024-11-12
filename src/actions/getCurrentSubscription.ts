"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { getPricesIds } from "./getPricesIds"

export type CurrentSubscriptionType =
  | "free"
  | "advanced-monthly"
  | "advanced-yearly"
  | "premium-monthly"
  | "premium-yearly"

export const getCurrentSubscription =
  async (): Promise<CurrentSubscriptionType> => {
    const { userId } = await auth()

    if (!userId) throw new Error("Unautenticated")

    const ClerkClient = await clerkClient()

    if (!ClerkClient) throw new Error("Error when initialize Clerk")

    const user = await ClerkClient.users.getUser(userId)

    const privateMetadata = user.privateMetadata

    const { prices } = await getPricesIds()

    if (prices.advanced.monthly?.priceId === privateMetadata.priceId)
      return "advanced-monthly"

    if (prices.advanced.annually?.priceId === privateMetadata.priceId)
      return "advanced-yearly"

    if (prices.premium.monthly?.priceId === privateMetadata.priceId)
      return "premium-monthly"

    if (prices.premium.annually?.priceId === privateMetadata.priceId)
      return "premium-yearly"

    return "free"
  }
