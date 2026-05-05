"use client";
import { differenceInDays, parseISO } from "date-fns";

type Payment = {
  loanId: number;
  entidad: string;
  tipo: "PRESTAMO" | "LEASING";
  nroCuota: number;
  fechaVencimiento: string;
  total: string;
  moneda: string;
  vehiclePlaca?: string | null;
  pagado: boolean; // ✅ AGREGAR ESTO
};

type Props = { payments: Payment[] };

export function PaymentAlerts({ payments }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alerts = payments
    .map((p) => {
      const fin = parseISO(p.fechaVencimiento);
      const dias = differenceInDays(fin, today);
      return { ...p, dias };
    })
    .filter((p) => p.dias <= 15 && !p.pagado) // próximas 15 días o vencidas
    .sort((a, b) => a.dias - b.dias);

  if (alerts.length === 0) return null;

  return (
    <div className="border-b border-blue-100 bg-blue-50/60 px-5 py-3">
      <p className="text-xs font-semibold text-blue-800 mb-2">
        💳 {alerts.length} cuota{alerts.length > 1 ? "s" : ""} próximas a vencer
      </p>
      <div className="flex flex-wrap gap-2">
        {alerts.map((a) => {
          const vencida = a.dias < 0;
          const critica = a.dias >= 0 && a.dias <= 3;
          const color = vencida
            ? "bg-red-50 border-red-200 text-red-700"
            : critica
              ? "bg-orange-50 border-orange-200 text-orange-700"
              : "bg-blue-50 border-blue-200 text-blue-700";

          return (
            <div
              key={`${a.loanId}-${a.nroCuota}`}
              className={`text-[11px] border rounded-lg px-3 py-1.5 ${color}`}
            >
              <span className="font-semibold">{a.entidad}</span>
              {a.vehiclePlaca && (
                <span className="font-mono ml-1">· {a.vehiclePlaca}</span>
              )}
              <span className="ml-1">
                cuota {a.nroCuota} — {a.moneda === "USD" ? "$" : "S/"}
                {Number(a.total).toLocaleString("es-PE")}
              </span>
              <span className="ml-2 font-bold">
                {vencida
                  ? `Venció hace ${Math.abs(a.dias)}d`
                  : a.dias === 0
                    ? "Vence HOY"
                    : `${a.dias}d`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
