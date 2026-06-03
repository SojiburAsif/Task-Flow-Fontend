export default function AdminDashboardPage() {
  return (
    <section className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Admin panel</p>
      <h2 className="mt-2 text-2xl font-semibold text-foreground">Administration tools</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Review system health, control permissions, and oversee the full workspace from one place.
      </p>
    </section>
  )
}
