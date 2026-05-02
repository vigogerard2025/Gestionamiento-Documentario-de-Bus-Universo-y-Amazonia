"use client";

// StatsRow recalcula en el cliente para que los contadores de alertas
// sean siempre frescos (no dependen solo del snapshot del servidor).
// Si usas ISR con revalidate=60, el servidor ya trae datos recientes,
// pero este componente puede recalcular desde VehicleRow[] si se pasa.

import type { FleetStats } from "@/app/lib/queries";

type Props = { stats: FleetStats };

type Card = {
  label: string;
  value: string | number;
  sub: string;
  accent: "blue" | "red" | "yellow" | "green" | "gray";
  pulse?: boolean;
};

function StatCard({ label, value, sub, accent, pulse }: Card) {
  const accentMap = {
    blue: {
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-100",
      dot: "bg-blue-500",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    yellow: {
      text: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      dot: "bg-yellow-400",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    gray: {
      text: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
      dot: "bg-gray-400",
    },
  };
  const a = accentMap[accent];

  return (
    <div
      className={`rounded-xl border ${a.border} ${a.bg} px-4 py-3 flex flex-col gap-1 relative overflow-hidden`}
    >
      {/* Dot indicador arriba a la derecha */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <span
          className={`w-2 h-2 rounded-full ${a.dot} ${pulse ? "animate-pulse" : ""}`}
        />
      </div>

      <p className="text-[11px] font-medium text-muted-foreground pr-4">
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${a.text}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground leading-tight">{sub}</p>
    </div>
  );
}

export function StatsRow({ stats }: Props) {
  // Determina acento dinámico para SOAT
  const soatAccent =
    stats.soatVencidos > 0
      ? "red"
      : stats.soatPorVencer > 0
        ? "yellow"
        : "green";

  const soatValue =
    stats.soatVencidos > 0
      ? stats.soatVencidos
      : stats.soatPorVencer > 0
        ? stats.soatPorVencer
        : "✓";

  const soatSub =
    stats.soatVencidos > 0
      ? `${stats.soatVencidos} vencidos o críticos`
      : stats.soatPorVencer > 0
        ? `${stats.soatPorVencer} por vencer pronto`
        : "Todos vigentes";

  // Rev técnica
  const rtAccent =
    stats.rtVencidos > 0 ? "red" : stats.rtPorVencer > 0 ? "yellow" : "green";

  const rtValue =
    stats.rtVencidos > 0
      ? stats.rtVencidos
      : stats.rtPorVencer > 0
        ? stats.rtPorVencer
        : "✓";

  const rtSub =
    stats.rtVencidos > 0
      ? `${stats.rtVencidos} vencidas o críticas`
      : stats.rtPorVencer > 0
        ? `${stats.rtPorVencer} por vencer pronto`
        : "Todas vigentes";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Total flota"
        value={stats.total}
        sub={`${stats.propios} propios · ${stats.alquilados} alquilados`}
        accent="blue"
      />
      <StatCard
        label="SOAT"
        value={soatValue}
        sub={soatSub}
        accent={soatAccent}
        pulse={stats.soatVencidos > 0}
      />
      <StatCard
        label="Rev. técnica"
        value={rtValue}
        sub={rtSub}
        accent={rtAccent}
        pulse={stats.rtVencidos > 0}
      />
      <StatCard
        label="Valor estimado"
        value={`$${Math.round(stats.valorUsd / 1000)}K`}
        sub="Equivalente USD total"
        accent="gray"
      />
    </div>
  );
}
