import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature")
  if (!signature) return NextResponse.error()

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET)
    return NextResponse.error()

  const text = await request.text()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia"
  })

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  switch (event.type) {
    case "invoice.paid":
      console.log({ type: event.type, event: event.data.object })
      // eslint-disable-next-line no-case-declarations
      const { customer, subscription, subscription_details, object } =
        event.data.object
      // eslint-disable-next-line no-case-declarations
      const clerkUserId = subscription_details?.metadata?.cleck_user_id

      if (!clerkUserId) return NextResponse.error()
      // Atualiza o usuário com o novo plano
      // eslint-disable-next-line no-case-declarations
      // eslint-disable-next-line no-case-declarations

      console.log({ customer, subscription, subscription_details, object })
      ;(await clerkClient()).users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription
        },
        publicMetadata: {
          subscriptionPlan: subscription_details?.metadata?.id
        }
      })
      break

    default:
      break
  }

  return NextResponse.json({ received: true })
}
