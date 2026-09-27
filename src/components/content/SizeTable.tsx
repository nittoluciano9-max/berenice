interface SizeTableProps {
  titulo: string;
  columnas: string[];
  filas: string[][];
}

export function SizeTable({ titulo, columnas, filas }: SizeTableProps) {
  // La primera columna (talle) queda fija al deslizar la tabla en pantallas angostas.
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[20rem] border-collapse text-sm">
        <caption className="mb-3 text-left text-xs tracking-[0.18em] uppercase">
          {titulo}
        </caption>
        <thead>
          <tr className="border-b border-ink">
            {columnas.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={
                  i === 0
                    ? "sticky left-0 bg-background py-3 pr-4 text-left font-medium"
                    : "px-3 py-3 text-right font-normal whitespace-nowrap text-muted-foreground"
                }
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map(([talle, ...medidas]) => (
            <tr key={talle} className="border-b">
              <th
                scope="row"
                className="sticky left-0 bg-background py-3 pr-4 text-left font-medium"
              >
                {talle}
              </th>
              {medidas.map((m, i) => (
                <td key={i} className="px-3 py-3 text-right tabular-nums">
                  {m}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
