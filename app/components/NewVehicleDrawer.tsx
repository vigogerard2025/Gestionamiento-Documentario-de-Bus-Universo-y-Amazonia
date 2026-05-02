"use client";
import { useState } from "react";
import { createVehicle } from "@/app/actions/vehicle-actions";
type Props = {
  empresas: Empresa[];
};
type Empresa = {
  id: number;
  nombre: string;
};

export function NewVehicleDrawer({ empresas }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const importe = parseFloat(fd.get("importe") as string) || 0;
    const mejora = parseFloat(fd.get("importe_mejora") as string) || 0;
    const total = (importe + mejora).toFixed(2);

    await createVehicle({
      companyId: 1, // ajusta según tu lógica de empresa activa
      descripcion: fd.get("descripcion") as string,
      marca: fd.get("marca") as string,
      modelo: (fd.get("modelo") as string) || null,
      placa: (fd.get("placa") as string) || null,
      tipoPropiedad: fd.get("tipoPropiedad") as "PROPIO" | "ALQUILADO",
      modalidadDeCompra: fd.get("modalidad_de_compra") as
        | "PROPIO"
        | "FINANCIADO"
        | "LEASING"
        | null,
      moneda: fd.get("moneda") as "SOL" | "USD" | null,
      importe: (fd.get("importe") as string) || null,
      tipoCambio: (fd.get("tipoCambio") as string) || null,
      importeMejora: (fd.get("importeMejora") as string) || null,
      total,
      tipoDeVehiculo: (fd.get("tipoDeVehiculo") as string) || null,
      uso: (fd.get("uso") as string) || null,
      fechaDeAdquisicion: (fd.get("fecha_de_adquisicion") as string) || null,
      fechaDeVenta: (fd.get("fecha_de_venta") as string) || null,
    });

    setLoading(false);
    setOpen(false);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nueva unidad
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end p-4">
          <div className="bg-background border border-border/60 rounded-2xl w-[400px] max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 sticky top-0 bg-background z-10">
              <h2 className="text-sm font-semibold">Registrar nueva unidad</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:bg-muted text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 px-5 py-4 flex-1"
            >
              {/* Identificación */}
              <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                Identificación
              </p>
              <Field label="Descripción *">
                <input
                  name="descripcion"
                  required
                  placeholder="Ej: Camioneta Pickup 4x4"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Marca *">
                  <input name="marca" required placeholder="Toyota" />
                </Field>
                <Field label="Modelo">
                  <input name="modelo" placeholder="Hilux" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Placa">
                  <input
                    name="placa"
                    placeholder="ABC-123"
                    className="uppercase"
                  />
                </Field>
                <Field label="Tipo de vehículo">
                  <input name="tipo_de_vehiculo" placeholder="Camioneta" />
                </Field>
              </div>
              <Field label="Uso">
                <input
                  name="uso"
                  placeholder="Transporte de carga, gerencia…"
                />
              </Field>

              <hr className="border-border/40" />

              {/* Propiedad */}
              <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                Propiedad y compra
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tipo propiedad *">
                  <select name="tipo_propiedad" required>
                    <option value="PROPIO">Propio</option>
                    <option value="ALQUILADO">Alquilado</option>
                  </select>
                </Field>
                <Field label="Modalidad">
                  <select name="modalidad_de_compra">
                    <option value="PROPIO">Propio</option>
                    <option value="FINANCIADO">Financiado</option>
                    <option value="LEASING">Leasing</option>
                  </select>
                </Field>
              </div>

              <hr className="border-border/40" />

              {/* Valorización */}
              <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                Valorización
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Moneda">
                  <select name="moneda">
                    <option value="USD">USD</option>
                    <option value="SOL">SOL</option>
                  </select>
                </Field>
                <Field label="Importe">
                  <input
                    name="importe"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tipo de cambio">
                  <input
                    name="tipo_cambio"
                    type="number"
                    step="0.01"
                    placeholder="3.75"
                  />
                </Field>
                <Field label="Importe mejora">
                  <input
                    name="importe_mejora"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </Field>
              </div>
              <Field label="Total (calculado)">
                <input
                  name="total"
                  type="number"
                  step="0.01"
                  placeholder="Se calcula automáticamente"
                  readOnly
                  className="bg-muted"
                />
              </Field>

              <hr className="border-border/40" />

              {/* Fechas */}
              <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                Fechas
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Adquisición">
                  <input name="fecha_de_adquisicion" type="date" />
                </Field>
                <Field label="Venta">
                  <input name="fecha_de_venta" type="date" />
                </Field>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-background pt-4 pb-1 flex gap-2 border-t border-border/40 -mx-5 px-5 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-border/60 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                >
                  {loading ? "Guardando…" : "Guardar unidad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="[&_input]:w-full [&_input]:px-3 [&_input]:py-2 [&_input]:rounded-lg [&_input]:border [&_input]:border-border/60 [&_input]:text-sm [&_input]:bg-background [&_input]:outline-none [&_input:focus]:border-blue-400 [&_select]:w-full [&_select]:px-3 [&_select]:py-2 [&_select]:rounded-lg [&_select]:border [&_select]:border-border/60 [&_select]:text-sm [&_select]:bg-background [&_select]:outline-none">
        {children}
      </div>
    </div>
  );
}
