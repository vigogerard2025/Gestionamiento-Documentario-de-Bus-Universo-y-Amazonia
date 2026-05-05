import {
  pgTable,
  serial,
  text,
  numeric,
  timestamp,
  pgEnum,
  integer,
  date,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const monedaEnum = pgEnum("moneda", ["SOL", "USD"]);
export const propiedadEnum = pgEnum("tipo_propiedad", ["PROPIO", "ALQUILADO"]);
export const modalidadEnum = pgEnum("modalidad_de_compra", [
  "PROPIO",
  "FINANCIADO",
  "LEASING",
]);
// FIX: agregado CRITICO que faltaba
export const docEstadoEnum = pgEnum("doc_estado", [
  "VIGENTE",
  "POR_VENCER",
  "CRITICO",
  "VENCIDO",
  "SIN_DATOS",
]);

// ─── Companies ────────────────────────────────────────────────────────────────

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().unique(),
  ruc: text("ruc").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Document Types ───────────────────────────────────────────────────────────

export const documentTypes = pgTable("document_types", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().unique(),
  tieneVencimiento: text("tiene_vencimiento").default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  descripcion: text("descripcion").notNull(),
  marca: text("marca").notNull(),
  modelo: text("modelo"),
  placa: text("placa").unique(),
  tipoDeVehiculo: text("tipo_de_vehiculo"),
  uso: text("uso"),
  tipoPropiedad: propiedadEnum("tipo_propiedad").notNull().default("PROPIO"),
  modalidadDeCompra: modalidadEnum("modalidad_de_compra"),
  moneda: monedaEnum("moneda"),
  importe: numeric("importe", { precision: 12, scale: 2 }),
  tipoCambio: numeric("tipo_cambio", { precision: 8, scale: 4 }),
  importeMejora: numeric("importe_mejora", { precision: 12, scale: 2 }),
  total: numeric("total", { precision: 14, scale: 2 }),
  fechaDeAdquisicion: date("fecha_de_adquisicion"),
  fechaDeVenta: date("fecha_de_venta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Vehicle Documents ────────────────────────────────────────────────────────

export const vehicleDocuments = pgTable(
  "vehicle_documents",
  {
    id: serial("id").primaryKey(),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    documentTypeId: integer("document_type_id")
      .notNull()
      .references(() => documentTypes.id),
    fechaDeInicio: date("fecha_de_inicio"),
    fechaDeFin: date("fecha_de_fin"),
    estado: docEstadoEnum("estado").default("SIN_DATOS"),
    archivoUrl: text("archivo_url"),
    archivoNombre: text("archivo_nombre"),
    notas: text("notas"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    vehicleDocIdx: index("vehicle_doc_idx").on(t.vehicleId, t.documentTypeId),
  }),
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const companiesRelations = relations(companies, ({ many }) => ({
  vehicles: many(vehicles),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  company: one(companies, {
    fields: [vehicles.companyId],
    references: [companies.id],
  }),
  documents: many(vehicleDocuments),
}));

export const vehicleDocumentsRelations = relations(
  vehicleDocuments,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [vehicleDocuments.vehicleId],
      references: [vehicles.id],
    }),
    documentType: one(documentTypes, {
      fields: [vehicleDocuments.documentTypeId],
      references: [documentTypes.id],
    }),
  }),
);
// ─── Loans (Préstamos / Leasing) ─────────────────────────────────────────────
export const loanTypeEnum = pgEnum("loan_type", ["PRESTAMO", "LEASING"]);

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  tipo: loanTypeEnum("tipo").notNull(),
  entidad: text("entidad").notNull(),
  nroOperacion: text("nro_operacion"),
  monto: numeric("monto", { precision: 14, scale: 2 }).notNull(),
  moneda: monedaEnum("moneda").notNull(),
  tasaAnual: numeric("tasa_anual", { precision: 8, scale: 6 }),
  plazoMeses: integer("plazo_meses"),
  fechaInicio: date("fecha_inicio"),
  fechaFin: date("fecha_fin"),
  cuotaMensual: numeric("cuota_mensual", { precision: 12, scale: 2 }),
  descripcion: text("descripcion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loanPayments = pgTable("loan_payments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id")
    .notNull()
    .references(() => loans.id, { onDelete: "cascade" }),
  nroCuota: integer("nro_cuota").notNull(),
  fechaVencimiento: date("fecha_vencimiento").notNull(),
  amortizacion: numeric("amortizacion", { precision: 12, scale: 2 }),
  interes: numeric("interes", { precision: 12, scale: 2 }),
  igv: numeric("igv", { precision: 12, scale: 2 }),
  total: numeric("total", { precision: 12, scale: 2 }),
  saldo: numeric("saldo", { precision: 14, scale: 2 }),
  pagado: boolean("pagado").default(false),
  fechaPago: date("fecha_pago"),
});

export const loansRelations = relations(loans, ({ one, many }) => ({
  company: one(companies, {
    fields: [loans.companyId],
    references: [companies.id],
  }),
  vehicle: one(vehicles, {
    fields: [loans.vehicleId],
    references: [vehicles.id],
  }),
  payments: many(loanPayments),
}));

export const loanPaymentsRelations = relations(loanPayments, ({ one }) => ({
  loan: one(loans, { fields: [loanPayments.loanId], references: [loans.id] }),
}));

export type Loan = typeof loans.$inferSelect;
export type LoanInsert = typeof loans.$inferInsert;
export type LoanPayment = typeof loanPayments.$inferSelect;

export type Company = typeof companies.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type VehicleInsert = typeof vehicles.$inferInsert;
export type VehicleDocument = typeof vehicleDocuments.$inferSelect;
export type VehicleDocumentInsert = typeof vehicleDocuments.$inferInsert;
export type DocumentType = typeof documentTypes.$inferSelect;
