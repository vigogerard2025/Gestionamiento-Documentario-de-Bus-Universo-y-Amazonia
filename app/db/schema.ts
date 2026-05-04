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

// ─── Types ────────────────────────────────────────────────────────────────────

export type Company = typeof companies.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type VehicleInsert = typeof vehicles.$inferInsert;
export type VehicleDocument = typeof vehicleDocuments.$inferSelect;
export type VehicleDocumentInsert = typeof vehicleDocuments.$inferInsert;
export type DocumentType = typeof documentTypes.$inferSelect;
