"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck, UserCheck, Users } from "lucide-react"
import { toast } from "sonner"

import AuthShell from "@/components/shared/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDemoLogin = (role: "admin" | "manager" | "member") => {
    setIsLoading(true)
    const demoUser =
      role === "admin"
        ? { email: "admin@demo.com", label: "Admin" }
        : role === "manager"
          ? { email: "manager@demo.com", label: "Project Manager" }
          : { email: "member@demo.com", label: "Team Member" }

    setEmail(demoUser.email)
    setPassword("Demo@1234")

    setTimeout(() => {
      toast.success(`Logged in successfully as ${demoUser.label}!`)
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      toast.success("Welcome back to TaskFlow!")
      setIsLoading(false)
      router.push("/dashboard")
    }, 900)
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue managing projects, tasks, and team collaboration."
      primaryLinkHref="/register"
      primaryLinkLabel="Create a new account"
      footerLabel="Need help? Contact support"
      footerHref="/contact"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="h-11 pl-9"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="h-11 pl-9"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
          Sign in
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Quick demo login
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button type="button" variant="outline" size="sm" onClick={() => handleDemoLogin("admin")}>
            <ShieldCheck className="size-4" />
            Admin
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => handleDemoLogin("manager")}>
            <UserCheck className="size-4" />
            Manager
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => handleDemoLogin("member")}>
            <Users className="size-4" />
            Member
          </Button>
        </div>
      </div>
    </AuthShell>
  )
}