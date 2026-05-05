// ─── Document status types ────────────────────────────────────────────────────

export type DocStatus =
  | "VIGENTE"
  | "POR_VENCER"
  | "CRITICO"
  | "VENCIDO"
  | "SIN_DATOS";

export type DocStatusConfig = {
  label: string;
  labelShort: string;
  colorClass: string;
  dotClass: string;
  badgeClass: string;
  barClass: string;
  priority: number; // para ordenar alertas (0 = más urgente)
};

export const DOC_STATUS_CONFIG: Record<DocStatus, DocStatusConfig> = {
  VENCIDO: {
    label: "Vencido",
    labelShort: "Vencido",
    colorClass: "text-red-600",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    barClass: "bg-red-500",
    priority: 0,
  },
  CRITICO: {
    label: "Vence en < 7 días",
    labelShort: "Crítico",
    colorClass: "text-orange-600",
    dotClass: "bg-orange-500",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    barClass: "bg-orange-500",
    priority: 1,
  },
  POR_VENCER: {
    label: "Por vencer",
    labelShort: "Por vencer",
    colorClass: "text-yellow-600",
    dotClass: "bg-yellow-500",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    barClass: "bg-yellow-500",
    priority: 2,
  },
  VIGENTE: {
    label: "Vigente",
    labelShort: "Vigente",
    colorClass: "text-green-600",
    dotClass: "bg-green-500",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    barClass: "bg-green-500",
    priority: 3,
  },
  SIN_DATOS: {
    label: "Sin datos",
    labelShort: "Sin datos",
    colorClass: "text-gray-400",
    dotClass: "bg-gray-300",
    badgeClass: "bg-gray-50 text-gray-500 border-gray-200",
    barClass: "bg-gray-300",
    priority: 4,
  },
};

// ─── Vehicle row (lo que devuelve la query principal) ─────────────────────────

export type DocInfo = {
  id: number | null;
  nombre: string;
  inicio: string | null;
  fin: string | null;
  status: DocStatus;
  diasRestantes: number | null;
  archivoUrl: string | null;
  archivoNombre: string | null;
  notas: string | null;
};

export type VehicleRow = {
  id: number;
  placa: string | null;
  descripcion: string;
  marca: string;
  modelo: string | null;
  tipoDeVehiculo: string | null;
  uso: string | null;
  tipoPropiedad: "PROPIO" | "ALQUILADO";
  modalidadDeCompra: "PROPIO" | "FINANCIADO" | "LEASING" | null;
  moneda: "SOL" | "USD" | null;
  total: string | null;
  fechaDeAdquisicion: string | null;
  companyId: number;
  empresa: string;
  // Documentos indexados por nombre del tipo (SOAT, REVISION TECNICA, etc.)
  documents: Record<string, DocInfo>;
  // Shortcut para los dos más usados
  soat: DocInfo;
  rt: DocInfo;
  // Estado general del vehículo = el peor estado entre sus documentos
  worstStatus: DocStatus;
};

// ─── Filters ──────────────────────────────────────────────────────────────────

export type FleetFilters = {
  empresa: "all" | string;
  tipoUnidad: "all" | "BUS" | "CAMION";
  estado: "all" | DocStatus;
  propiedad: "all" | "PROPIO" | "ALQUILADO";
  search: string;
};
export type Payment = {
  loanId: number;
  entidad: string;
  tipo: "PRESTAMO" | "LEASING";
  nroCuota: number;
  fechaVencimiento: string;
  total: string;
  moneda: "SOL" | "USD";
  vehiclePlaca?: string | null;
  pagado: boolean;
};
