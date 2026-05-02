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

const statusItems: { status: DocStatus; label: string; icon: string }[] = [
  { status: "VENCIDO", label: "Vencido / crítico", icon: "🔴" },
  { status: "POR_VENCER", label: "Por vencer (30d)", icon: "🟡" },
  { status: "VIGENTE", label: "Vigente", icon: "🟢" },
  { status: "SIN_DATOS", label: "Sin datos", icon: "⚪" },
];

export function Sidebar({
  vehicles,
  filters,
  empresas,
  onFilterChange,
}: Props) {
  // Contadores
  const countByEmpresa = (id: number) =>
    vehicles.filter((v) => v.companyId === id).length;

  const countByStatus = (s: DocStatus) =>
    vehicles.filter((v) => v.worstStatus === s).length;

  const countBus = vehicles.filter(
    (v) =>
      v.tipoDeVehiculo?.toLowerCase().includes("ómnibus") ||
      v.tipoDeVehiculo?.toLowerCase().includes("omnibus"),
  ).length;

  const Item = ({
    label,
    count,
    active,
    icon,
    onClick,
  }: {
    label: string;
    count: number;
    active: boolean;
    icon?: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-muted-foreground hover:bg-muted/60"
      }`}
    >
      <span className="flex items-center gap-1.5">
        {icon && <span className="text-[11px]">{icon}</span>}
        {label}
      </span>
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-blue-100 text-blue-700"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1">
      <p className="text-[9px] font-semibold text-muted-foreground tracking-widest uppercase px-2.5 mb-1">
        {title}
      </p>
      {children}
    </div>
  );

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
          label="Camiones"
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
            key={s.status}
            label={s.label}
            count={countByStatus(s.status)}
            active={filters.estado === s.status}
            icon={s.icon}
            onClick={() => onFilterChange("estado", s.status)}
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
