import type { VehicleRow, DocStatus } from "@/types/fleet";
import { DOC_STATUS_CONFIG } from "@/types/fleet";
import { formatDiasRestantes } from "../lib/fleet";

type Props = {
  vehicle: VehicleRow;
  onClick: () => void;
};

const PROPIEDAD_ACCENT: Record<string, string> = {
  PROPIO: "bg-blue-500",
  ALQUILADO: "bg-amber-500",
};

const MODALIDAD_BADGE: Record<string, string> = {
  PROPIO: "bg-green-50 text-green-700 border-green-200",
  FINANCIADO: "bg-purple-50 text-purple-700 border-purple-200",
  LEASING: "bg-pink-50 text-pink-700 border-pink-200",
};

function DocPill({
  label,
  status,
  diasRestantes,
}: {
  label: string;
  status: DocStatus;
  diasRestantes: number | null;
}) {
  const cfg = DOC_STATUS_CONFIG[status];
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${cfg.dotClass}`}
        />
        <span className={`text-[10px] font-medium ${cfg.colorClass}`}>
          {formatDiasRestantes(diasRestantes, status)}
        </span>
      </div>
    </div>
  );
}

export function VehicleCard({ vehicle: v, onClick }: Props) {
  const accent = PROPIEDAD_ACCENT[v.tipoPropiedad] ?? "bg-gray-400";
  const hasAlert = ["VENCIDO", "CRITICO", "POR_VENCER"].includes(v.worstStatus);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-background rounded-xl border transition-all duration-150 overflow-hidden hover:-translate-y-0.5 hover:shadow-sm ${
        hasAlert
          ? "border-yellow-300/60 hover:border-yellow-400/80"
          : "border-border/40 hover:border-border/70"
      }`}
    >
      {/* Accent bar */}
      <div className={`h-0.5 w-full ${accent}`} />

      <div className="px-4 pt-3 pb-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-[13px] font-medium leading-snug truncate">
              {v.descripcion}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {v.marca}
              {v.modelo ? ` · ${v.modelo}` : ""}
            </p>
          </div>
          {v.modalidadDeCompra && (
            <span
              className={`text-[9px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                MODALIDAD_BADGE[v.modalidadDeCompra] ?? ""
              }`}
            >
              {v.modalidadDeCompra.charAt(0) +
                v.modalidadDeCompra.slice(1).toLowerCase()}
            </span>
          )}
        </div>

        {/* Plate */}
        <div className="inline-flex items-center gap-1 bg-muted/60 border border-border/40 rounded-md px-2 py-1 mb-3">
          <span className="font-mono text-[11px] font-semibold tracking-wide">
            {v.placa ?? "Sin placa"}
          </span>
        </div>

        {/* Documents */}
        <div className="flex flex-col gap-1.5 border-t border-border/30 pt-2.5">
          <DocPill
            label="SOAT"
            status={v.soat.status}
            diasRestantes={v.soat.diasRestantes}
          />
          <DocPill
            label="Rev. técnica"
            status={v.rt.status}
            diasRestantes={v.rt.diasRestantes}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-muted/20 border-t border-border/30 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground truncate max-w-[60%]">
          {v.empresa}
        </span>
        <span className="text-[11px] font-semibold">
          {v.moneda === "USD" ? "$" : "S/"}
          {Number(v.total ?? 0).toLocaleString("es-PE")}
        </span>
      </div>
    </button>
  );
}
