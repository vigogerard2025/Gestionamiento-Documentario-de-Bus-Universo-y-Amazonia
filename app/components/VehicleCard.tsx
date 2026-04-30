"use client";
import { Card, CardContent } from "./ui/card";

type Vehicle = {
  id: number;
  descripcion: string;
  marca: string;
  modelo?: string | null;
  placa?: string | null;
  moneda?: string | null;
  total?: string | null;
  tipo_propiedad: string;
  modalidad_de_compra?: string | null;
  uso?: string | null;
};

const PROPIEDAD_STYLES = {
  PROPIO: {
    accent: "bg-blue-500",
    badge: "bg-blue-50 text-blue-800 border border-blue-100",
    icon: "bg-blue-50",
    iconStroke: "stroke-blue-600",
    label: "Propio",
  },
  ALQUILADO: {
    accent: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800 border border-amber-100",
    icon: "bg-amber-50",
    iconStroke: "stroke-amber-600",
    label: "Alquilado",
  },
};

const MODALIDAD_BADGE: Record<string, string> = {
  PROPIO: "bg-green-50 text-green-800 border border-green-100",
  FINANCIADO: "bg-purple-50 text-purple-800 border border-purple-100",
  LEASING: "bg-pink-50 text-pink-800 border border-pink-100",
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const style =
    PROPIEDAD_STYLES[vehicle.tipo_propiedad as keyof typeof PROPIEDAD_STYLES] ??
    PROPIEDAD_STYLES.PROPIO;

  return (
    <Card className="rounded-2xl border border-border/40 shadow-none hover:border-border/70 transition-all duration-200 overflow-hidden">
      <div className={`h-1 ${style.accent}`} />
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-border/40">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${style.icon} flex items-center justify-center shrink-0`}
            >
              <svg
                className={`w-5 h-5 fill-none ${style.iconStroke}`}
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path d="M5 17H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14l4 4v6a2 2 0 0 1-2 2h-2" />
                <circle cx="7.5" cy="17.5" r="2.5" />
                <circle cx="16.5" cy="17.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-[14px] font-medium leading-snug">
                {vehicle.descripcion}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {vehicle.marca}
                {vehicle.modelo ? ` · ${vehicle.modelo}` : ""}
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${style.badge}`}
          >
            {style.label}
          </span>
        </div>

        <div className="px-5 py-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Placa</span>
            <span className="font-mono text-[11px] font-medium bg-muted px-2 py-0.5 rounded border border-border/40 tracking-wider">
              {vehicle.placa ?? "—"}
            </span>
          </div>

          {vehicle.modalidad_de_compra && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Modalidad</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${MODALIDAD_BADGE[vehicle.modalidad_de_compra] ?? ""}`}
              >
                {vehicle.modalidad_de_compra.charAt(0) +
                  vehicle.modalidad_de_compra.slice(1).toLowerCase()}
              </span>
            </div>
          )}

          {vehicle.uso && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Uso</span>
              <span className="text-xs font-medium">{vehicle.uso}</span>
            </div>
          )}

          <div className="h-px bg-border/40 my-0.5" />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Valor</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-muted-foreground">
                {vehicle.moneda}
              </span>
              <span className="text-base font-semibold">
                {vehicle.total ? Number(vehicle.total).toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
