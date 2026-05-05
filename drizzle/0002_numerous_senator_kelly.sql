CREATE TYPE "public"."loan_type" AS ENUM('PRESTAMO', 'LEASING');--> statement-breakpoint
ALTER TYPE "public"."doc_estado" ADD VALUE 'CRITICO' BEFORE 'VENCIDO';--> statement-breakpoint
CREATE TABLE "loan_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_id" integer NOT NULL,
	"nro_cuota" integer NOT NULL,
	"fecha_vencimiento" date NOT NULL,
	"amortizacion" numeric(12, 2),
	"interes" numeric(12, 2),
	"igv" numeric(12, 2),
	"total" numeric(12, 2),
	"saldo" numeric(14, 2),
	"pagado" boolean DEFAULT false,
	"fecha_pago" date
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"vehicle_id" integer,
	"tipo" "loan_type" NOT NULL,
	"entidad" text NOT NULL,
	"nro_operacion" text,
	"monto" numeric(14, 2) NOT NULL,
	"moneda" "moneda" NOT NULL,
	"tasa_anual" numeric(8, 6),
	"plazo_meses" integer,
	"fecha_inicio" date,
	"fecha_fin" date,
	"cuota_mensual" numeric(12, 2),
	"descripcion" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loan_payments" ADD CONSTRAINT "loan_payments_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;