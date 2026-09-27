import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  onAdd: () => void;
  agotado: boolean;
  aviso: string | null;
  /** Para que la StickyBuyBar sepa si el botón principal está en pantalla. */
  ref?: React.Ref<HTMLDivElement>;
}

export function AddToCartButton({
  onAdd,
  agotado,
  aviso,
  ref,
}: AddToCartButtonProps) {
  return (
    <div ref={ref} className="space-y-3">
      <Button size="lg" className="w-full" onClick={onAdd} disabled={agotado}>
        {agotado ? "Sin stock" : "Agregar al carrito"}
      </Button>
      {aviso && (
        <p role="status" className="text-sm text-rosewood">
          {aviso}
        </p>
      )}
    </div>
  );
}
