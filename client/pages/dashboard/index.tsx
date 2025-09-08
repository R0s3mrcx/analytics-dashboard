import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { computeMetrics, fetchEvents, type EventsFilters } from "@/lib/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Filters } from "@/components/dashboard/Filters";
import { EventsTable } from "@/components/dashboard/EventsTable";
import { BarSection } from "@/components/dashboard/Charts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const [filters, setFilters] = useState<EventsFilters>({});
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["events", { ...filters, page }],
    queryFn: () => fetchEvents({ ...filters, page, limit: 50 }),
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];
  const metrics = useMemo(() => computeMetrics(items), [items]);

  const sample = useMemo(() => ({
    events: Array.from(new Set(items.map((i) => i.eventoName || ""))).filter(Boolean),
    platforms: Array.from(new Set(items.map((i) => i.platform || ""))).filter(Boolean),
  }), [items]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header onRefresh={() => refetch()} refreshing={isFetching} />
      <main className="container py-6 space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard title="Total de eventos" value={metrics.total} />
          <MetricCard title="Usuarios totales" value={metrics.uniqueUsers} />
          <MetricCard
            title="Top evento"
            value={metrics.topEvents[0]?.[0] ?? "—"}
            subtitle={metrics.topEvents[0] ? `${metrics.topEvents[0][1]} ocurrencias` : undefined}
          />
        </section>

        <Filters
          value={filters}
          onChange={(v) => setFilters(v)}
          onApply={() => { setPage(1); refetch(); }}
          onClear={() => { setFilters({}); setPage(1); refetch(); }}
          sample={sample}
        />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Eventos recientes</h2>
            <div className="text-xs text-muted-foreground">Mostrando últimos 50</div>
          </div>
          {isLoading ? (
            <div className="grid place-items-center p-10">
              <div className="animate-spin size-8 rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <EventsTable items={items} />
          )}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
            <div className="text-sm">Página {page}</div>
            <Button onClick={() => setPage((p) => p + 1)} disabled={items.length < 50}>Siguiente</Button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <BarSection title="Eventos por tipo" data={metrics.byType} />
          <BarSection title="Eventos por plataforma" data={metrics.byPlatform} color="#22C55E" />
        </section>
      </main>
    </div>
  );
}

function Header({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) {
  const { logout } = useAuth();
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-primary/10 grid place-items-center"><span className="size-3 rounded-sm bg-primary" /></div>
          <div>
            <div className="text-sm font-semibold leading-tight">Analytics Dashboard</div>
            <div className="text-xs text-muted-foreground -mt-1">Eventos de la app</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onRefresh} disabled={refreshing}>{refreshing ? "Actualizando..." : "Actualizar"}</Button>
          <Button variant="ghost" onClick={() => logout()}>Salir</Button>
        </div>
      </div>
    </header>
  );
}

