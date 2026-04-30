CREATE TYPE "public"."moneda" AS ENUM('SOL', 'USD');--> statement-breakpoint
CREATE TYPE "public"."tipo_propiedad" AS ENUM('PROPIO', 'ALQUILADO');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"ruc" text
);
--> statement-breakpoint
CREATE TABLE "document_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text
);
--> statement-breakpoint
CREATE TABLE "revision_tecnica" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"fecha_de_inicio" date,
	"fecha_de_fin" date,
	"estado" text,
	"archivo_pdf" text
);
--> statement-breakpoint
CREATE TABLE "soat" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"fecha_de_inicio" date,
	"fecha_de_fin" date,
	"estado" text,
	"archivo_pdf" text
);
--> statement-breakpoint
CREATE TABLE "vehicle_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"document_type_id" integer NOT NULL,
	"archivo_url" text,
	"fecha" date
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"descripcion" text NOT NULL,
	"marca" text NOT NULL,
	"modelo" text,
	"placa" text,
	"modalidad_de_compra" text,
	"tipo_propiedad" "tipo_propiedad" NOT NULL,
	"importe" integer,
	"moneda" "moneda",
	"importe_mejora" integer,
	"total" integer,
	"fecha_de_adquisicion" date,
	"fecha_de_venta" date,
	"tipo_de_vehiculo" text,
	"uso" text
);
--> statement-breakpoint
ALTER TABLE "revision_tecnica" ADD CONSTRAINT "revision_tecnica_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "soat" ADD CONSTRAINT "soat_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_document_type_id_document_types_id_fk" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;