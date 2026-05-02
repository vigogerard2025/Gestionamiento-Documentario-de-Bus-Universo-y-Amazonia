"use client";

import { useState, useEffect } from "react";
import { X, FileText, Upload, Download, ExternalLink } from "lucide-react";
import type { VehicleRow, DocInfo } from "@/types/fleet";
import { DOC_STATUS_CONFIG } from "@/types/fleet";
import { formatDate } from "../lib/fleet";

type Props = {
  vehicle: VehicleRow;
  onClose: () => void;
};

// Orden de display de documentos
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

  // Cerrar con Escape
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

  // Ordenar documentos
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-background border border-border/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl pointer-events-auto">
          {/* Header */}
          <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border/40 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold">{v.descripcion}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {v.marca}
                {v.modelo ? ` · ${v.modelo}` : ""}
                {v.placa ? (
                  <span className="font-mono ml-1 bg-muted px-1.5 py-0.5 rounded text-[10px] border border-border/40">
                    {v.placa}
                  </span>
                ) : null}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">
            {/* Info general */}
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
                      className={`text-[12px] font-medium ${
                        item.mono ? "font-mono tracking-wide" : ""
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              {v.uso && (
                <p className="text-xs text-muted-foreground mt-2 px-1">
                  Uso: {v.uso}
                </p>
              )}
            </section>

            {/* Documentos */}
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
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg bg-background border border-border/40 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium">{nombre}</p>
                        {doc.inicio && doc.fin ? (
                          <p className="text-[10px] text-muted-foreground">
                            {formatDate(doc.inicio)} → {formatDate(doc.fin)}
                          </p>
                        ) : (
                          <p className="text-[10px] text-muted-foreground">
                            Sin fechas registradas
                          </p>
                        )}
                      </div>

                      {/* Status badge */}
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${cfg.badgeClass}`}
                      >
                        {doc.diasRestantes !== null &&
                        doc.status !== "SIN_DATOS"
                          ? doc.diasRestantes < 0
                            ? `Venció hace ${Math.abs(doc.diasRestantes)}d`
                            : doc.diasRestantes === 0
                              ? "Vence hoy"
                              : `${doc.diasRestantes}d`
                          : cfg.label}
                      </span>

                      {/* Actions */}
                      {doc.archivoUrl ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() =>
                              setPdfDoc({
                                nombre: `${nombre} · ${v.placa ?? v.descripcion}`,
                                url: doc.archivoUrl!,
                              })
                            }
                            className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Ver PDF
                          </button>
                          <a
                            href={doc.archivoUrl}
                            download={doc.archivoNombre ?? undefined}
                            className="w-7 h-7 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <button className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted border border-border/40 px-2.5 py-1 rounded-lg hover:bg-muted/80 transition-colors shrink-0">
                          <Upload className="w-3 h-3" />
                          Subir PDF
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* PDF Viewer modal */}
      {pdfDoc && (
        <PdfViewer
          title={pdfDoc.nombre}
          url={pdfDoc.url}
          onClose={() => setPdfDoc(null)}
        />
      )}
    </>
  );
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────

function PdfViewer({
  title,
  url,
  onClose,
}: {
  title: string;
  url: string;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-70 flex items-center justify-center p-6 pointer-events-none">
        <div className="bg-background border border-border/50 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl pointer-events-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-muted/30">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={url}
                download
                className="text-xs text-muted-foreground bg-background border border-border/40 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-muted transition-colors"
              >
                <Download className="w-3 h-3" />
                Descargar
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PDF iframe */}
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
            className="flex-1 w-full"
            title={title}
          />
        </div>
      </div>
    </>
  );
}
