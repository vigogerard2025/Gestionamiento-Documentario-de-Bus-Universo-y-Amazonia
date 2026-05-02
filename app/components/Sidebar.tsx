import type { VehicleRow, FleetFilters, DocStatus } from "@/types/fleet";

type Props = {
  vehicles: VehicleRow[];
  filters: FleetFilters;
  empresas: { id: number; nombre: string }[];
  onFilterChange: <K extends keyof FleetFilters>(
    key: K,
    value: FleetFilters[K],
  ) => void;
};

// FIX: agrupa CRITICO con VENCIDO en los contadores, igual que en filterVehicles
const statusItems: {
  filterValue: string;
  label: string;
  dot: string;
  countFn: (v: VehicleRow) => boolean;
}[] = [
  {
    filterValue: "VENCIDO",
    label: "Vencido / crítico",
    dot: "bg-red-500",
    // cuenta VENCIDO + CRITICO juntos
    countFn: (v) => v.worstStatus === "VENCIDO" || v.worstStatus === "CRITICO",
  },
  {
    filterValue: "POR_VENCER",
    label: "Por vencer (≤30d)",
    dot: "bg-yellow-400",
    countFn: (v) => v.worstStatus === "POR_VENCER",
  },
  {
    filterValue: "VIGENTE",
    label: "Vigente",
    dot: "bg-green-500",
    countFn: (v) => v.worstStatus === "VIGENTE",
  },
  {
    filterValue: "SIN_DATOS",
    label: "Sin datos",
    dot: "bg-gray-300",
    countFn: (v) => v.worstStatus === "SIN_DATOS",
  },
];

export function Sidebar({
  vehicles,
  filters,
  empresas,
  onFilterChange,
}: Props) {
  const countByEmpresa = (id: number) =>
    vehicles.filter((v) => v.companyId === id).length;

  const countBus = vehicles.filter(
    (v) =>
      v.tipoDeVehiculo?.toLowerCase().includes("ómnibus") ||
      v.tipoDeVehiculo?.toLowerCase().includes("omnibus"),
  ).length;

  function Item({
    label,
    count,
    active,
    dot,
    onClick,
  }: {
    label: string;
    count: number;
    active: boolean;
    dot?: string;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-all ${
          active
            ? "bg-blue-50 text-blue-700 font-semibold ring-1 ring-blue-200"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {dot && (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${dot} ${active ? "ring-2 ring-offset-1 ring-blue-300" : ""}`}
            />
          )}
          <span className="truncate">{label}</span>
        </span>
        <span
          className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${
            active
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {count}
        </span>
      </button>
    );
  }

  function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-0.5">
        <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase px-2.5 mb-1.5">
          {title}
        </p>
        {children}
      </div>
    );
  }

  return (
    <div className="bg-background border border-border/40 rounded-xl p-3 flex flex-col gap-4 sticky top-[72px]">
      <Section title="Empresa">
        <Item
          label="Todas"
          count={vehicles.length}
          active={filters.empresa === "all"}
          onClick={() => onFilterChange("empresa", "all")}
        />
        {empresas.map((e) => (
          <Item
            key={e.id}
            label={e.nombre}
            count={countByEmpresa(e.id)}
            active={filters.empresa === e.id.toString()}
            onClick={() => onFilterChange("empresa", e.id.toString())}
          />
        ))}
      </Section>

      <div className="h-px bg-border/40" />

      <Section title="Tipo de unidad">
        <Item
          label="Todos"
          count={vehicles.length}
          active={filters.tipoUnidad === "all"}
          onClick={() => onFilterChange("tipoUnidad", "all")}
        />
        <Item
          label="Ómnibus"
          count={countBus}
          active={filters.tipoUnidad === "BUS"}
          onClick={() => onFilterChange("tipoUnidad", "BUS")}
        />
        <Item
          label="Camiones / otros"
          count={vehicles.length - countBus}
          active={filters.tipoUnidad === "CAMION"}
          onClick={() => onFilterChange("tipoUnidad", "CAMION")}
        />
      </Section>

      <div className="h-px bg-border/40" />

      <Section title="Estado documentos">
        <Item
          label="Todos"
          count={vehicles.length}
          active={filters.estado === "all"}
          onClick={() => onFilterChange("estado", "all")}
        />
        {statusItems.map((s) => (
          <Item
            key={s.filterValue}
            label={s.label}
            count={vehicles.filter(s.countFn).length}
            active={filters.estado === s.filterValue}
            dot={s.dot}
            onClick={() =>
              onFilterChange("estado", s.filterValue as DocStatus | "all")
            }
          />
        ))}
      </Section>

      <div className="h-px bg-border/40" />

      <Section title="Propiedad">
        <Item
          label="Todos"
          count={vehicles.length}
          active={filters.propiedad === "all"}
          onClick={() => onFilterChange("propiedad", "all")}
        />
        <Item
          label="Propio"
          count={vehicles.filter((v) => v.tipoPropiedad === "PROPIO").length}
          active={filters.propiedad === "PROPIO"}
          onClick={() => onFilterChange("propiedad", "PROPIO")}
        />
        <Item
          label="Alquilado / Leasing"
          count={vehicles.filter((v) => v.tipoPropiedad === "ALQUILADO").length}
          active={filters.propiedad === "ALQUILADO"}
          onClick={() => onFilterChange("propiedad", "ALQUILADO")}
        />
      </Section>
    </div>
  );
}
