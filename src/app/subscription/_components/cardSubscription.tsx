"use client"

import { useMemo } from "react"
import { Badge } from "@/components/_ui/badge"
import { Button } from "@/components/_ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/_ui/card"
import { Separator } from "@/components/_ui/separator"
import { CheckIcon, XIcon } from "lucide-react"
import { createSripeCheckout } from "@/actions/createStripeCheckout"
import { loadStripe } from "@stripe/stripe-js"

interface CardSubscriptionProps {
  priceId?: string
  title: string
  price: number
  list: { has: boolean; label: string }[]
  diffYear?: number
  current?: boolean
}

const CardSubscription = ({
  title,
  priceId,
  price,
  list,
  diffYear,
  current
}: CardSubscriptionProps) => {
  const formattedPrice = useMemo(() => {
    if (price === 0) return "0"
    return price.toFixed(2).toString().replaceAll(".", ",")
  }, [price])

  const handleAcquirePlanClick = async () => {
    if (!priceId) return

    const { sessionId } = await createSripeCheckout(priceId)

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key not found")
    }

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    )

    if (!stripe) {
      throw new Error("Stripe not found")
    }

    await stripe.redirectToCheckout({ sessionId })
  }

  return (
    <Card className={`h-fit w-[25rem] max-w-full ${current && "bg-zinc-900"}`}>
      <CardHeader className="p-0">
        <div className="relative flex flex-col items-center gap-4 px-6 py-10">
          {diffYear && (
            <Badge className="absolute right-4 top-4 bg-danger/10 text-base font-bold text-danger hover:bg-danger/20">
              {Math.ceil(diffYear)}% OFF
            </Badge>
          )}

          {current && (
            <Badge className="absolute left-4 top-4 bg-tertiary/10 text-sm font-semibold text-tertiary hover:bg-tertiary/10">
              Atual
            </Badge>
          )}

          <div>
            <span className="text-2xl font-semibold">{title}</span>
          </div>

          <div>
            <span className="text-4xl">R$</span>{" "}
            <span className="text-6xl font-semibold">{formattedPrice}</span>{" "}
            <span className="text-2xl text-zinc-500">
              {diffYear ? "/ano" : "/mês"}
            </span>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3 p-10 pb-0">
        {list.map((el) => (
          <div
            key={el.label}
            className="flex flex-row flex-nowrap items-center gap-3"
          >
            <div>
              {el.has ? (
                <CheckIcon className="text-tertiary" size={24} />
              ) : (
                <XIcon size={24} />
              )}
            </div>
            <div className="whitespace-break-spaces">{el.label}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end p-10 pt-8">
        {current ? (
          <Button
            className="w-full border-2 border-primary bg-zinc-900 text-secondary"
            variant={"outline"}
            disabled
            onClick={() => {}}
          >
            Plano atual
          </Button>
        ) : (
          <Button className="w-full" onClick={handleAcquirePlanClick}>
            Alterar plano
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default CardSubscription
