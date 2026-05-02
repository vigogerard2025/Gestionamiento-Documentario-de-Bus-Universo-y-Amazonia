import type { VehicleRow } from "@/types/fleet";
import { DOC_STATUS_CONFIG } from "@/types/fleet";
import { formatDate, formatDiasRestantes } from "../lib/fleet";

type Props = {
  vehicles: VehicleRow[];
  expanded: boolean;
  onToggle: () => void;
  onVehicleClick: (v: VehicleRow) => void;
};

type AlertItem = {
  vehicle: VehicleRow;
  tipo: string;
  fin: string | null;
  diasRestantes: number | null;
  status: "VENCIDO" | "CRITICO" | "POR_VENCER";
};

export function AlertBanner({
  vehicles,
  expanded,
  onToggle,
  onVehicleClick,
}: Props) {
  // Aplanar alertas
  const alerts: AlertItem[] = [];

  for (const v of vehicles) {
    for (const [key, doc] of Object.entries(v.documents)) {
      if (["VENCIDO", "CRITICO", "POR_VENCER"].includes(doc.status)) {
        alerts.push({
          vehicle: v,
          tipo: key,
          fin: doc.fin,
          diasRestantes: doc.diasRestantes,
          status: doc.status as "VENCIDO" | "CRITICO" | "POR_VENCER",
        });
      }
    }
  }

  // Ordenar por urgencia
  const priority = { VENCIDO: 0, CRITICO: 1, POR_VENCER: 2 };
  alerts.sort((a, b) => priority[a.status] - priority[b.status]);

  const vencidos = alerts.filter(
    (a) => a.status === "VENCIDO" || a.status === "CRITICO",
  ).length;
  const porVencer = alerts.filter((a) => a.status === "POR_VENCER").length;

  return (
    <div className="border-b border-yellow-200 bg-yellow-50/80">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-yellow-100/50 transition-colors"
      >
        <span className="text-base">⚠️</span>
        <span className="text-xs font-semibold text-yellow-800">
          {alerts.length} documentos requieren atención
        </span>
        <div className="flex items-center gap-2 ml-2">
          {vencidos > 0 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              {vencidos} vencido{vencidos > 1 ? "s" : ""}
            </span>
          )}
          {porVencer > 0 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
              {porVencer} por vencer
            </span>
          )}
        </div>
        <span className="ml-auto text-[11px] text-yellow-600">
          {expanded ? "▲ ocultar" : "▼ ver detalle"}
        </span>
      </button>

      {/* Alert list */}
      {expanded && (
        <div className="px-5 pb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {alerts.map((a, i) => {
            const cfg = DOC_STATUS_CONFIG[a.status];
            return (
              <button
                key={`${a.vehicle.id}-${a.tipo}-${i}`}
                onClick={() => onVehicleClick(a.vehicle)}
                className="flex items-center justify-between text-left bg-background border border-border/40 rounded-lg px-3 py-2 hover:border-border/70 transition-colors text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full inline-block ${cfg.dotClass}`}
                    />
                    <span className="font-mono font-semibold text-[11px]">
                      {a.vehicle.placa ?? "—"}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{a.tipo}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Vence: {formatDate(a.fin)}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold ${cfg.colorClass}`}>
                  {formatDiasRestantes(a.diasRestantes, a.status)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
