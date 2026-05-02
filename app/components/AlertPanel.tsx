"use client";
// app/_components/AlertPanel.tsx

import { useState } from "react";
import type { VehicleRow, DocumentStatus } from "../page";

// ── Helpers ──────────────────────────────────────────────────────────────
const statusConfig: Record<
  DocumentStatus,
  { label: string; color: string; border: string; icon: string }
> = {
  VENCIDO: {
    label: "VENCIDO",
    color: "text-red-400",
    border: "border-red-500/40",
    icon: "🔴",
  },
  CRITICO: {
    label: "VENCE EN 7D",
    color: "text-orange-400",
    border: "border-orange-500/40",
    icon: "🟠",
  },
  POR_VENCER: {
    label: "VENCE EN 30D",
    color: "text-yellow-400",
    border: "border-yellow-500/40",
    icon: "🟡",
  },
  VIGENTE: {
    label: "VIGENTE",
    color: "text-green-400",
    border: "border-green-500/20",
    icon: "🟢",
  },
  SIN_DATOS: {
    label: "SIN DATOS",
    color: "text-white/30",
    border: "border-white/10",
    icon: "⚪",
  },
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type DocAlert = {
  vehicleId: number;
  placa: string;
  empresa: string;
  descripcion: string;
  tipo: "SOAT" | "REVISIÓN TÉCNICA";
  status: DocumentStatus;
  fin: string | null;
  diasRestantes: number | null;
};

// ─────────────────────────────────────────────────────────────────────────
export default function AlertPanel({ alerts }: { alerts: VehicleRow[] }) {
  const [collapsed, setCollapsed] = useState(false);

  // Aplanar alerts por documento
  const docAlerts: DocAlert[] = [];
  for (const v of alerts) {
    if (["VENCIDO", "CRITICO", "POR_VENCER"].includes(v.soat.status)) {
      docAlerts.push({
        vehicleId: v.id,
        placa: v.placa,
        empresa: v.empresa,
        descripcion: v.descripcion,
        tipo: "SOAT",
        status: v.soat.status,
        fin: v.soat.fin,
        diasRestantes: v.soat.diasRestantes,
      });
    }
    if (["VENCIDO", "CRITICO", "POR_VENCER"].includes(v.rt.status)) {
      docAlerts.push({
        vehicleId: v.id,
        placa: v.placa,
        empresa: v.empresa,
        descripcion: v.descripcion,
        tipo: "REVISIÓN TÉCNICA",
        status: v.rt.status,
        fin: v.rt.fin,
        diasRestantes: v.rt.diasRestantes,
      });
    }
  }

  // Ordenar: vencidos primero, luego críticos, luego por vencer
  const order: Record<DocumentStatus, number> = {
    VENCIDO: 0,
    CRITICO: 1,
    POR_VENCER: 2,
    VIGENTE: 3,
    SIN_DATOS: 4,
  };
  docAlerts.sort((a, b) => order[a.status] - order[b.status]);

  if (docAlerts.length === 0) {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-6 py-4 flex items-center gap-3">
        <span className="text-xl">✅</span>
        <p className="text-green-400 text-sm font-medium">
          Todos los documentos están vigentes. Sin alertas activas.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <h2 className="font-semibold text-white">Alertas de documentos</h2>
          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-mono">
            {docAlerts.length}
          </span>
        </div>
        <span className="text-white/40 text-sm">
          {collapsed ? "▼ Ver" : "▲ Ocultar"}
        </span>
      </div>

      {/* Lista */}
      {!collapsed && (
        <div className="divide-y divide-white/5">
          {docAlerts.map((a, i) => {
            const cfg = statusConfig[a.status];
            return (
              <div
                key={`${a.vehicleId}-${a.tipo}-${i}`}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-l-2 ${cfg.border}`}
              >
                {/* Info vehículo */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {a.placa}
                    </span>
                    <span className="text-white/30 text-xs">•</span>
                    <span className="text-white/60 text-xs">
                      {a.descripcion}
                    </span>
                    <span className="text-white/30 text-xs">•</span>
                    <span className="text-white/40 text-xs">{a.empresa}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-white/70 bg-white/10 px-2 py-0.5 rounded">
                      {a.tipo}
                    </span>
                    <span className="text-xs text-white/40">
                      Vence: {formatDate(a.fin)}
                    </span>
                  </div>
                </div>

                {/* Badge estado */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-base">{cfg.icon}</span>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${cfg.color}`}>
                      {cfg.label}
                    </p>
                    {a.diasRestantes !== null && (
                      <p className="text-xs text-white/40">
                        {a.diasRestantes < 0
                          ? `Venció hace ${Math.abs(a.diasRestantes)} días`
                          : a.diasRestantes === 0
                            ? "Vence HOY"
                            : `${a.diasRestantes} días restantes`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
