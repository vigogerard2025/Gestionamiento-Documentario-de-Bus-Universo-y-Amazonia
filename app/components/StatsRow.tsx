import type { FleetStats } from "../lib/queries";

type Props = { stats: FleetStats };

export function StatsRow({ stats }: Props) {
  const cards = [
    {
      label: "Total flota",
      value: stats.total,
      sub: `${stats.propios} propios · ${stats.alquilados} alquilados`,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      label: "SOAT",
      value: stats.soatVencidos > 0 ? stats.soatVencidos : "✓",
      sub:
        stats.soatVencidos > 0
          ? `${stats.soatVencidos} vencidos / críticos`
          : stats.soatPorVencer > 0
            ? `${stats.soatPorVencer} por vencer`
            : "Todos vigentes",
      color:
        stats.soatVencidos > 0
          ? "text-red-600"
          : stats.soatPorVencer > 0
            ? "text-yellow-600"
            : "text-green-600",
      bg:
        stats.soatVencidos > 0
          ? "bg-red-50"
          : stats.soatPorVencer > 0
            ? "bg-yellow-50"
            : "bg-green-50",
    },
    {
      label: "Rev. técnica",
      value:
        stats.rtVencidos > 0
          ? stats.rtVencidos
          : stats.rtPorVencer > 0
            ? stats.rtPorVencer
            : "✓",
      sub:
        stats.rtVencidos > 0
          ? `${stats.rtVencidos} vencidas / críticas`
          : stats.rtPorVencer > 0
            ? `${stats.rtPorVencer} por vencer`
            : "Todas vigentes",
      color:
        stats.rtVencidos > 0
          ? "text-red-600"
          : stats.rtPorVencer > 0
            ? "text-yellow-600"
            : "text-green-600",
      bg:
        stats.rtVencidos > 0
          ? "bg-red-50"
          : stats.rtPorVencer > 0
            ? "bg-yellow-50"
            : "bg-green-50",
    },
    {
      label: "Valor estimado",
      value: `$${Math.round(stats.valorUsd / 1000)}K`,
      sub: "Equivalente USD",
      color: "text-gray-700",
      bg: "bg-gray-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-background rounded-xl border border-border/40 px-4 py-3"
        >
          <p className="text-[11px] text-muted-foreground mb-1">{c.label}</p>
          <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
