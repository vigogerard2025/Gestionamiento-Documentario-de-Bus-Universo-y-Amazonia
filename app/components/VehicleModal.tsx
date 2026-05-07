"use client";

import { useState, useEffect } from "react";
import { X, FileText, Download, ExternalLink } from "lucide-react";
import type { VehicleRow, DocInfo } from "@/types/fleet";
import { DOC_STATUS_CONFIG } from "@/types/fleet";
import { formatDate } from "../lib/fleet";

type Props = {
  vehicle: VehicleRow;
  onClose: () => void;
};

const DOC_ORDER = [
  "SOAT",
  "REVISION TECNICA",
  "TARJETA DE PROPIEDAD",
  "TARJETA UNICA DE CIRCULACION",
  "DOCUMENTACION DE COMPRA",
];

export function VehicleModal({ vehicle: v, onClose }: Props) {
  const [pdfDoc, setPdfDoc] = useState<{ nombre: string; url: string } | null>(
    null,
  );

  const [inputDoc, setInputDoc] = useState<string | null>(null);

  // 🔥 CAMBIO REAL
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pdfDoc) setPdfDoc(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pdfDoc, onClose]);

  const orderedDocs: [string, DocInfo][] = DOC_ORDER.map((nombre) => [
    nombre,
    v.documents[nombre] ?? {
      id: null,
      nombre,
      inicio: null,
      fin: null,
      status: "SIN_DATOS" as const,
      diasRestantes: null,
      archivoUrl: null,
      archivoNombre: null,
      notas: null,
    },
  ]);

  const infoItems = [
    { label: "Empresa", value: v.empresa },
    { label: "Placa", value: v.placa ?? "—", mono: true },
    { label: "Tipo de vehículo", value: v.tipoDeVehiculo ?? "—" },
    { label: "Propiedad", value: v.tipoPropiedad },
    { label: "Modalidad", value: v.modalidadDeCompra ?? "—" },
    { label: "Adquisición", value: formatDate(v.fechaDeAdquisicion) },
    { label: "Moneda", value: v.moneda ?? "—" },
    {
      label: "Valor total",
      value: `${v.moneda === "USD" ? "$" : "S/"} ${Number(v.total ?? 0).toLocaleString("es-PE")}`,
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-background border border-border/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl pointer-events-auto">
          {/* HEADER */}
          <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border/40 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold">{v.descripcion}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {v.marca}
                {v.modelo ? ` · ${v.modelo}` : ""}
                {v.placa && (
                  <span className="font-mono ml-1 bg-muted px-1.5 py-0.5 rounded text-[10px] border border-border/40">
                    {v.placa}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">
            {/* INFO */}
            <section>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Información general
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {infoItems.map((item) => (
                  <div key={item.label} className="bg-muted/40 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p
                      className={`text-[12px] font-medium ${item.mono ? "font-mono tracking-wide" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* DOCUMENTOS */}
            <section>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Documentos
              </p>

              <div className="flex flex-col gap-2">
                {orderedDocs.map(([nombre, doc]) => {
                  const cfg = DOC_STATUS_CONFIG[doc.status];

                  return (
                    <div
                      key={nombre}
                      className="flex items-center gap-3 bg-muted/30 border border-border/40 rounded-xl px-4 py-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>

                      <div className="flex-1">
                        <p className="text-[12px] font-medium">{nombre}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {doc.inicio && doc.fin
                            ? `${formatDate(doc.inicio)} → ${formatDate(doc.fin)}`
                            : "Sin fechas"}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-1 rounded ${cfg.badgeClass}`}
                      >
                        {cfg.label}
                      </span>

                      {/* 🔥 SOLO AQUÍ CAMBIÓ */}
                      {doc.archivoUrl && inputDoc !== nombre ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setPdfDoc({ nombre, url: doc.archivoUrl! })
                            }
                            className="text-xs text-blue-600 border px-2 py-1 rounded"
                          >
                            Ver PDF
                          </button>

                          <button
                            onClick={() => {
                              setInputDoc(nombre);
                              setInputValues((prev) => ({
                                ...prev,
                                [nombre]: doc.archivoUrl || "",
                              }));
                            }}
                            className="text-xs border px-2 py-1 rounded"
                          >
                            Editar
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {!doc.archivoUrl && (
                            <button
                              onClick={() => setInputDoc(nombre)}
                              className="text-xs border px-2 py-1 rounded"
                            >
                              Agregar PDF
                            </button>
                          )}

                          {inputDoc === nombre && (
                            <div className="flex gap-2">
                              <input
                                value={inputValues[nombre] || ""}
                                onChange={(e) =>
                                  setInputValues((prev) => ({
                                    ...prev,
                                    [nombre]: e.target.value,
                                  }))
                                }
                                placeholder="/soat/bus1.pdf"
                                className="border px-2 py-1 text-xs w-full"
                              />

                              <button
                                onClick={async () => {
                                  const value = inputValues[nombre];
                                  if (!value?.trim()) return;

                                  await fetch("/api/documentos", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      vehicleId: v.id,
                                      nombre,
                                      archivoUrl: value,
                                    }),
                                  });

                                  setInputDoc(null);
                                  window.location.reload();
                                }}
                                className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                              >
                                Guardar
                              </button>

                              <button
                                onClick={() => setInputDoc(null)}
                                className="text-xs text-red-500"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* PDF MODAL */}
      {pdfDoc && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden flex flex-col">
            <div className="flex justify-between p-2 border-b">
              <span>{pdfDoc.nombre}</span>
              <button onClick={() => setPdfDoc(null)}>X</button>
            </div>
            <iframe src={pdfDoc.url} className="flex-1 w-full" />
          </div>
        </div>
      )}
    </>
  );
}
