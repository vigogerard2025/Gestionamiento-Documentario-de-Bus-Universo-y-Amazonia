import "dotenv/config";

import { db } from "@/app/db";
import { companies, vehicles } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Insertando vehículos...");

  // 1. Buscar empresa
  const empresa = await db.query.companies.findFirst({
    where: eq(companies.nombre, "AMAZONIA TOURS"),
  });

  if (!empresa) {
    throw new Error("❌ Empresa AMAZONIA TOURS no existe");
  }

  // 2. DATA TIPADA 🔥
  const data: (typeof vehicles.$inferInsert)[] = [
    {
      company_id: empresa.id,
      descripcion: "FURGÓN FRIGORÍFICO",
      marca: "MERCEDES BENZ",
      modelo: "ATEGO 1725/54",
      placa: "AKW-788",
      modalidad_de_compra: "PROPIO",
      tipo_propiedad: "PROPIO",
      importe: "87290.00",
      moneda: "SOL",
      total: "87290.00",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
      uso: "Transporte de Mercancías en General Publico",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION",
      marca: "KIA",
      modelo: "K2 700",
      placa: "D1M-825",
      modalidad_de_compra: "PROPIO",
      tipo_propiedad: "PROPIO",
      importe: "4000.00",
      moneda: "SOL",
      total: "4000.00",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camioneta Pick up de Carga",
      uso: "Transporte de Mercancías Privado",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "MITSUBISHI FUSO",
      modelo: "CANTER TURBO TD T5 5 TON",
      placa: "T8C-855",
      modalidad_de_compra: "PROPIO",
      tipo_propiedad: "PROPIO",
      importe: "3000.00",
      moneda: "SOL",
      total: "3000.00",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
      uso: "Transporte de Mercancías en General Publico",
    },

    // FINANCIADOS
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055KN",
      placa: "TFM-869",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055KN",
      placa: "TFP-846",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055KN",
      placa: "TFM-919",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055N",
      placa: "TFM-884",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055KN",
      placa: "TFM-912",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055KN",
      placa: "TFM-937",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055KN",
      placa: "TFM-924",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },
    {
      company_id: empresa.id,
      descripcion: "CAMION BARANDA",
      marca: "JAC",
      modelo: "HFC1055KN",
      placa: "TFM-813",
      modalidad_de_compra: "FINANCIADO",
      tipo_propiedad: "PROPIO",
      importe: "25100.00",
      moneda: "USD",
      tipo_cambio: "3.55",
      total: "89130.10",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
    },

    // último
    {
      company_id: empresa.id,
      descripcion: "FURGON",
      marca: "HYUNDAI",
      modelo: "EX6",
      placa: "P4M-783",
      modalidad_de_compra: "PROPIO",
      tipo_propiedad: "PROPIO",
      importe: "5200.00",
      moneda: "SOL",
      total: "5200.00",
      fecha_de_adquisicion: "2021-12-20",
      tipo_de_vehiculo: "Camion de Carga",
      uso: "Transporte de Mercanías en General Público",
    },
  ];

  // 3. Insertar
  await db.insert(vehicles).values(data);

  console.log("🔥 Vehículos insertados correctamente");
}

main();
