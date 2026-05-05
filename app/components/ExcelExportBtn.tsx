"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { exportVehiclesToExcel, exportPaymentsToExcel } from "../lib/excel";
import type { VehicleRow } from "@/types/fleet";

type Props = { vehicles: VehicleRow[]; payments?: any[] };

export function ExcelExportBtn({ vehicles, payments }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-border/60 text-sm px-3 py-2 rounded-xl hover:bg-muted transition-colors"
      >
        <Download className="w-4 h-4" />
        Exportar
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 bg-background border border-border/60 rounded-xl shadow-lg w-52 py-1 text-sm overflow-hidden">
            <button
              onClick={() => {
                exportVehiclesToExcel(vehicles, "flota_filtrada");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors"
            >
              📋 Vehículos filtrados
            </button>
            <button
              onClick={() => {
                exportVehiclesToExcel(
                  vehicles.filter((v) => v.soat.status !== "VIGENTE"),
                  "alertas_soat",
                );
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors"
            >
              ⚠️ Alertas SOAT / Rev. Técnica
            </button>
            {payments && (
              <button
                onClick={() => {
                  exportPaymentsToExcel(payments, "cronograma_pagos");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors"
              >
                💳 Cronograma de pagos
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
