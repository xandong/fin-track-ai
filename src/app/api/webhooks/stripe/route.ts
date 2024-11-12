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

  let event: Stripe.Event
  console.debug("HandlerStripeEvent")
  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error("Error when verify the signature of webhook", { error })
    return NextResponse.error()
  }

  const ClerkClient = await clerkClient()

  switch (event.type) {
    case "invoice.paid": {
      // eslint-disable-next-line no-case-declarations
      const { customer, subscription, subscription_details } = event.data.object
      // eslint-disable-next-line no-case-declarations
      const clerkUserId = subscription_details?.metadata?.cleck_user_id
      // eslint-disable-next-line no-case-declarations
      const priceId = subscription_details?.metadata?.price_id

      if (!clerkUserId) return NextResponse.error()
      // Atualiza o usuário com o novo plano
      // eslint-disable-next-line no-case-declarations
      // eslint-disable-next-line no-case-declarations

      console.debug({
        clerkUserId,
        customer,
        subscription,
        priceId,
        subscription_details
      })

      try {
        ClerkClient.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: customer,
            stripeSubscriptionId: subscription,
            priceId: priceId
          }
        })
      } catch (error) {
        console.error("Erro when update clerk user: ", error)
        return NextResponse.error()
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
      )
      const clerkUserId = subscription.metadata.cleck_user_id
      if (!clerkUserId) return NextResponse.error()

      ClerkClient.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          priceId: null
        }
      })
      break
    }
    default:
      console.debug(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
