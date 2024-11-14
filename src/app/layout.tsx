import "@/styles/global.css"

import type { Metadata } from "next"
import { Mulish } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { ScrollArea } from "@/components/_ui/scroll-area"
import { SubscriptionProvider } from "@/context/SubscriptionContext"
import { SidebarProvider } from "@/components/_ui/sidebar"
import { ToastProvider } from "@/components/_ui/toast"
import { Toaster } from "@/components/_ui/toaster"

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "600", "500", "700", "800"],
  display: "swap"
})

const host = process.env.DASHBOARD_HOST || ""

export const metadata: Metadata = {
  title: "Fintrack AI",
  description:
    "Track and manage your finances with AI-driven insights on Fintrack AI.",
  openGraph: {
    title: "Fintrack AI - Financial Management Made Simple",
    description:
      "Track and manage your finances with AI-driven insights on Fintrack AI.",
    images: [`${host}/logo.png`],
    url: host,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Fintrack AI - Financial Management Made Simple",
    description:
      "Track and manage your finances with AI-driven insights on Fintrack AI.",
    images: [`${host}/logo.png`]
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
      appearance={{
        baseTheme: dark
      }}
    >
      <html lang="en">
        <link rel="icon" href="/logo.svg" />
        <body className={`${mulish.className} dark antialiased`}>
          <ToastProvider>
            <Toaster />
            <ScrollArea className="w-hull h-full">
              <SubscriptionProvider>
                <SidebarProvider defaultOpen={false}>
                  {children}
                  <SpeedInsights />
                </SidebarProvider>
              </SubscriptionProvider>
            </ScrollArea>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
