import {
  pgTable,
  serial,
  text,
  integer,
  date,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";

// ENUMS
export const tipoPropiedadEnum = pgEnum("tipo_propiedad", [
  "PROPIO",
  "ALQUILADO",
]);

export const monedaEnum = pgEnum("moneda", ["SOL", "USD"]);

// COMPANIES
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  ruc: text("ruc"),
});
export const modalidadCompraEnum = pgEnum("modalidad_compra", [
  "PROPIO",
  "FINANCIADO",
  "LEASING",
]);
// VEHICLES
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),

  company_id: integer("company_id")
    .references(() => companies.id)
    .notNull(),

  descripcion: text("descripcion").notNull(),
  marca: text("marca").notNull(),
  modelo: text("modelo"),

  placa: text("placa").unique(), // 🔥 importante

  modalidad_de_compra: modalidadCompraEnum("modalidad_de_compra"),

  tipo_propiedad: tipoPropiedadEnum("tipo_propiedad").notNull(),

  // 💸 usar numeric
  importe: numeric("importe", { precision: 12, scale: 2 }),

  moneda: monedaEnum("moneda"),

  tipo_cambio: numeric("tipo_cambio", { precision: 10, scale: 2 }),

  importe_mejora: numeric("importe_mejora", { precision: 12, scale: 2 }),

  total: numeric("total", { precision: 12, scale: 2 }),

  fecha_de_adquisicion: date("fecha_de_adquisicion"),
  fecha_de_venta: date("fecha_de_venta"),

  tipo_de_vehiculo: text("tipo_de_vehiculo"),
  uso: text("uso"),
});

// SOAT
export const soat = pgTable("soat", {
  id: serial("id").primaryKey(),

  vehicle_id: integer("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),

  fecha_de_inicio: date("fecha_de_inicio"),
  fecha_de_fin: date("fecha_de_fin"),
  estado: text("estado"),
  archivo_pdf: text("archivo_pdf"),
});

// REVISION TECNICA
export const revision_tecnica = pgTable("revision_tecnica", {
  id: serial("id").primaryKey(),

  vehicle_id: integer("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),

  fecha_de_inicio: date("fecha_de_inicio"),
  fecha_de_fin: date("fecha_de_fin"),
  estado: text("estado"),
  archivo_pdf: text("archivo_pdf"),
});

// DOCUMENT TYPES
export const documentTypes = pgTable("document_types", {
  id: serial("id").primaryKey(),
  nombre: text("nombre"),
});

// VEHICLE DOCUMENTS
export const vehicleDocuments = pgTable("vehicle_documents", {
  id: serial("id").primaryKey(),

  vehicle_id: integer("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),

  document_type_id: integer("document_type_id")
    .references(() => documentTypes.id)
    .notNull(),

  archivo_url: text("archivo_url"),
  fecha: date("fecha"),
});
