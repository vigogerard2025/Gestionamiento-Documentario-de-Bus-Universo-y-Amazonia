"use client";

import { useEffect, useRef } from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";

interface PdfModalProps {
  url: string;
  filename?: string;
  onClose: () => void;
}

export function PdfModal({
  url,
  filename = "contrato-leasing.pdf",
  onClose,
}: PdfModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "min(860px, 96vw)", height: "min(90vh, 900px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-green-50 p-2 rounded-lg">
              <FileText size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {filename}
              </p>
              <p className="text-xs text-gray-400 leading-tight">
                Contrato de leasing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Abrir en nueva pestaña */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink size={13} />
              Abrir
            </a>

            {/* Descargar */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Download size={13} />
              Descargar
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 overflow-hidden">
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            title={filename}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-gray-400">
            Presiona{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono text-xs">
              Esc
            </kbd>{" "}
            o haz clic fuera para cerrar
          </p>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 font-medium"
          >
            <Download size={12} />
            Guardar copia local
          </button>
        </div>
      </div>
    </div>
  );
}
