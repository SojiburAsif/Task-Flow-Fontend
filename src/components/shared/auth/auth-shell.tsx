import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles, Users2 } from "lucide-react"

import Logo from "@/components/shared/logo/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/lib/site"

const authHighlights = [
  { icon: ShieldCheck, title: "Role-based access", description: "Admin, manager, and member flows in one place." },
  { icon: Users2, title: "Team collaboration", description: "Keep work visible for everyone on the team." },
  { icon: CheckCircle2, title: "Task delivery", description: "Plan, assign, and close tasks without noise." },
]

type AuthShellProps = {
  title: string
  description: string
  primaryLinkHref: string
  primaryLinkLabel: string
  footerLabel: string
  footerHref: string
  children: ReactNode
}

export default function AuthShell({
  title,
  description,
  primaryLinkHref,
  primaryLinkLabel,
  footerLabel,
  footerHref,
  children,
}: AuthShellProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-4xl border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,var(--background),color-mix(in_oklch,var(--background),black_2%))] p-8 shadow-2xl shadow-foreground/5">
          <div className="relative z-10 flex h-full flex-col justify-between gap-8 text-foreground">
            <div className="space-y-6">
              <Logo />
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="size-3.5 text-emerald-500" />
                {siteConfig.name}
              </div>
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  {siteConfig.tagline}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {siteConfig.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {authHighlights.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="rounded-3xl border border-border/60 bg-background/85 p-4 backdrop-blur">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-muted text-foreground">
                      <Icon className="size-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <Card className="border-border/60 bg-background/95 shadow-xl shadow-foreground/5 backdrop-blur">
          <CardHeader className="space-y-3 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground w-fit">
              <LockKeyhole className="size-3.5" />
              Secure access
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {children}

            <p className="text-center text-sm text-muted-foreground">
              <Link href={footerHref} className="font-medium text-foreground hover:underline">
                {footerLabel}
              </Link>
            </p>

            <Link
              href={primaryLinkHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {primaryLinkLabel}
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}