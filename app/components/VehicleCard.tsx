import type { VehicleRow, DocStatus } from "@/types/fleet";
import { DOC_STATUS_CONFIG } from "@/types/fleet";
import { formatDiasRestantes } from "../lib/fleet";

type Props = {
  vehicle: VehicleRow;
  onClick: () => void;
};

// Barra de color izquierda según worstStatus
const STATUS_LEFT_BAR: Record<DocStatus, string> = {
  VENCIDO: "bg-red-500",
  CRITICO: "bg-orange-500",
  POR_VENCER: "bg-yellow-400",
  VIGENTE: "bg-green-500",
  SIN_DATOS: "bg-gray-200",
};

// Semáforo visual: círculo grande con color
const STATUS_DOT_BIG: Record<DocStatus, string> = {
  VENCIDO: "bg-red-500 ring-4 ring-red-100",
  CRITICO: "bg-orange-500 ring-4 ring-orange-100",
  POR_VENCER: "bg-yellow-400 ring-4 ring-yellow-100",
  VIGENTE: "bg-green-500 ring-4 ring-green-100",
  SIN_DATOS: "bg-gray-300 ring-4 ring-gray-100",
};

const MODALIDAD_BADGE: Record<string, string> = {
  PROPIO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FINANCIADO: "bg-violet-50 text-violet-700 border-violet-200",
  LEASING: "bg-sky-50 text-sky-700 border-sky-200",
};

// Fila de doc con semáforo en línea
function DocRow({
  label,
  status,
  diasRestantes,
}: {
  label: string;
  status: DocStatus;
  diasRestantes: number | null;
}) {
  const cfg = DOC_STATUS_CONFIG[status];

  // Badge de estado más compacto y expresivo
  const badgeColors: Record<DocStatus, string> = {
    VENCIDO: "bg-red-50 text-red-700 border border-red-200",
    CRITICO: "bg-orange-50 text-orange-700 border border-orange-200",
    POR_VENCER: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    VIGENTE: "bg-green-50 text-green-700 border border-green-200",
    SIN_DATOS: "bg-gray-50 text-gray-500 border border-gray-200",
  };

  const dotColors: Record<DocStatus, string> = {
    VENCIDO: "bg-red-500",
    CRITICO: "bg-orange-500",
    POR_VENCER: "bg-yellow-400",
    VIGENTE: "bg-green-500",
    SIN_DATOS: "bg-gray-300",
  };

  const text = formatDiasRestantes(diasRestantes, status);
  const shortText =
    status === "VIGENTE" && diasRestantes && diasRestantes > 30
      ? `${diasRestantes}d`
      : text.replace(" restantes", "").replace("Venció hace ", "-");

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${dotColors[status]}`}
        />
        <span className="text-[11px] text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[status]}`}
      >
        {shortText}
      </span>
    </div>
  );
}

export function VehicleCard({ vehicle: v, onClick }: Props) {
  const leftBar = STATUS_LEFT_BAR[v.worstStatus] ?? "bg-gray-200";
  const bigDot = STATUS_DOT_BIG[v.worstStatus] ?? "bg-gray-300";

  const isAlert = ["VENCIDO", "CRITICO"].includes(v.worstStatus);
  const isPorVencer = v.worstStatus === "POR_VENCER";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-background rounded-xl border overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md group ${
        isAlert
          ? "border-red-200 hover:border-red-300 shadow-sm shadow-red-50"
          : isPorVencer
            ? "border-yellow-200 hover:border-yellow-300"
            : "border-border/40 hover:border-border/70"
      }`}
    >
      <div className="flex">
        {/* Barra lateral de estado */}
        <div className={`w-1 shrink-0 ${leftBar}`} />

        <div className="flex-1 min-w-0 p-3">
          {/* Header: descripción + semáforo general */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-snug truncate text-foreground group-hover:text-blue-700 transition-colors">
                {v.descripcion}
              </p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {v.marca}
                {v.modelo ? ` · ${v.modelo}` : ""}
              </p>
            </div>
            {/* Semáforo grande */}
            <div className="shrink-0 flex flex-col items-center gap-1 mt-0.5">
              <div className={`w-3.5 h-3.5 rounded-full ${bigDot}`} />
            </div>
          </div>

          {/* Placa + modalidad */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-muted/60 border border-border/40 rounded-md px-2 py-1">
              <span className="font-mono text-[11px] font-bold tracking-wider text-foreground">
                {v.placa ?? "SIN PLACA"}
              </span>
            </div>
            {v.modalidadDeCompra && (
              <span
                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                  MODALIDAD_BADGE[v.modalidadDeCompra] ?? ""
                }`}
              >
                {v.modalidadDeCompra === "FINANCIADO"
                  ? "Financ."
                  : v.modalidadDeCompra === "LEASING"
                    ? "Leasing"
                    : "Propio"}
              </span>
            )}
          </div>

          {/* Semáforo de documentos */}
          <div className="bg-muted/30 rounded-lg px-3 py-2 flex flex-col gap-1.5 border border-border/30">
            <DocRow
              label="SOAT"
              status={v.soat.status}
              diasRestantes={v.soat.diasRestantes}
            />
            <div className="h-px bg-border/30" />
            <DocRow
              label="Rev. técnica"
              status={v.rt.status}
              diasRestantes={v.rt.diasRestantes}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-muted/20 border-t border-border/30 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground truncate max-w-[60%]">
          {v.empresa}
        </span>
        <span className="text-[11px] font-semibold tabular-nums text-foreground">
          {v.moneda === "USD" ? "$" : "S/"}
          {Number(v.total ?? 0).toLocaleString("es-PE")}
        </span>
      </div>
    </button>
  );
}
