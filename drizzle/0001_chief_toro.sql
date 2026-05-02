CREATE TYPE "public"."doc_estado" AS ENUM('VIGENTE', 'POR_VENCER', 'VENCIDO', 'SIN_DATOS');--> statement-breakpoint
CREATE TYPE "public"."modalidad_de_compra" AS ENUM('PROPIO', 'FINANCIADO', 'LEASING');--> statement-breakpoint
ALTER TABLE "revision_tecnica" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "soat" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "revision_tecnica" CASCADE;--> statement-breakpoint
DROP TABLE "soat" CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_documents" DROP CONSTRAINT "vehicle_documents_vehicle_id_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "ruc" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "document_types" ALTER COLUMN "nombre" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "modalidad_de_compra" SET DATA TYPE "public"."modalidad_de_compra" USING "modalidad_de_compra"::"public"."modalidad_de_compra";--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "tipo_propiedad" SET DEFAULT 'PROPIO';--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "importe" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "importe_mejora" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "total" SET DATA TYPE numeric(14, 2);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "document_types" ADD COLUMN "tiene_vencimiento" text DEFAULT 'true';--> statement-breakpoint
ALTER TABLE "document_types" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD COLUMN "fecha_de_inicio" date;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD COLUMN "fecha_de_fin" date;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD COLUMN "estado" "doc_estado" DEFAULT 'SIN_DATOS';--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD COLUMN "archivo_nombre" text;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD COLUMN "notas" text;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "tipo_cambio" numeric(8, 4);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vehicle_doc_idx" ON "vehicle_documents" USING btree ("vehicle_id","document_type_id");--> statement-breakpoint
ALTER TABLE "vehicle_documents" DROP COLUMN "fecha";--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_nombre_unique" UNIQUE("nombre");--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_ruc_unique" UNIQUE("ruc");--> statement-breakpoint
ALTER TABLE "document_types" ADD CONSTRAINT "document_types_nombre_unique" UNIQUE("nombre");--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_placa_unique" UNIQUE("placa");