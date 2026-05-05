export function LoanList({ loans }: { loans: any[] }) {
  return (
    <div className="bg-background border rounded-xl p-4">
      <h2 className="text-sm font-semibold mb-3">Préstamos / Leasing</h2>

      <div className="space-y-3">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="border rounded-lg p-3 flex flex-col gap-1"
          >
            <div className="flex justify-between text-xs">
              <span className="font-medium">{loan.entidad}</span>
              <span className="text-muted-foreground">{loan.tipo}</span>
            </div>

            <div className="text-xs text-muted-foreground">
              {loan.descripcion}
            </div>

            <div className="flex justify-between text-xs mt-1">
              <span>Monto: S/ {loan.monto}</span>
              <span>Cuota: S/ {loan.cuotaMensual}</span>
            </div>

            <div className="text-[10px] text-muted-foreground">
              {loan.payments.length} cuotas
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
