"use client";

import { useState, useEffect } from "react";
import { X, FileText, ExternalLink, Download } from "lucide-react";
import type { VehicleRow, DocInfo } from "@/types/fleet";
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
  const [pdfDoc, setPdfDoc] = useState<{
    nombre: string;
    url: string;
  } | null>(null);

  // Escape para cerrar
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
    { label: "Placa", value: v.placa ?? "—" },
    { label: "Tipo de vehículo", value: v.tipoDeVehiculo ?? "—" },
    { label: "Propiedad", value: v.tipoPropiedad },
    { label: "Modalidad", value: v.modalidadDeCompra ?? "—" },
    { label: "Adquisición", value: formatDate(v.fechaDeAdquisicion) },
    { label: "Moneda", value: v.moneda ?? "—" },
    {
      label: "Valor total",
      value: `${v.moneda === "USD" ? "$" : "S/"} ${Number(
        v.total ?? 0,
      ).toLocaleString("es-PE")}`,
    },
  ];

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-background border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl pointer-events-auto overflow-hidden">
          {/* HEADER */}
          <div className="px-6 py-4 border-b flex justify-between">
            <div>
              <h2 className="font-semibold">{v.descripcion}</h2>
              <p className="text-xs text-gray-500">
                {v.marca} {v.modelo} {v.placa}
              </p>
            </div>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 overflow-y-auto flex flex-col gap-6">
            {/* INFO */}
            <section>
              <p className="text-xs font-semibold mb-2">Información general</p>
              <div className="grid grid-cols-2 gap-2">
                {infoItems.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* DOCUMENTOS */}
            <section>
              <p className="text-xs font-semibold mb-2">Documentos</p>

              {orderedDocs.map(([nombre, doc]) => (
                <div
                  key={nombre}
                  className="flex items-center gap-3 border p-3 rounded-lg"
                >
                  <FileText />

                  <div className="flex-1">
                    <p>{nombre}</p>
                  </div>

                  <div className="flex gap-2 items-center">
                    {/* BOTÓN VER PDF */}
                    <button
                      onClick={() => {
                        console.log("CLICK DOC:", nombre);
                        console.log("URL ORIGINAL:", doc.archivoUrl);

                        if (!doc.archivoUrl) {
                          alert("Este documento no tiene PDF");
                          return;
                        }

                        const url = doc.archivoUrl.startsWith("/")
                          ? doc.archivoUrl
                          : `/uploads/${doc.archivoUrl}`;

                        console.log("URL FINAL:", url);

                        setPdfDoc({
                          nombre,
                          url,
                        });
                      }}
                      className="flex items-center gap-1 text-xs border px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Ver PDF
                    </button>

                    {/* DESCARGAR */}
                    {doc.archivoUrl && (
                      <a
                        href={doc.archivoUrl}
                        download
                        className="text-xs border px-2 py-1 rounded hover:bg-gray-100"
                      >
                        <Download className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      {/* VISOR PDF */}
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

// 🔥 MODAL PDF
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
      <div className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} />

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          {/* HEADER */}
          <div className="flex justify-between p-3 border-b">
            <span className="text-sm font-medium">{title}</span>

            <div className="flex gap-2">
              <a
                href={url}
                download
                className="text-xs border px-2 py-1 rounded hover:bg-gray-100"
              >
                Descargar
              </a>
              <button onClick={onClose}>
                <X />
              </button>
            </div>
          </div>

          {/* PDF */}
          <iframe src={url} className="flex-1 w-full" />
        </div>
      </div>
    </>
  );
}
