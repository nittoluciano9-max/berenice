"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";
import { ENTREGA_LABELS } from "@/lib/whatsapp";
import type { DatosPedido, FormaEntrega } from "@/types/cart";

interface OrderDetailsFormProps {
  datos: DatosPedido;
  onChange: (datos: DatosPedido) => void;
}

const inputClass =
  "h-11 w-full border-b border-input bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground focus:border-ink";
const labelClass = "text-xs tracking-[0.18em] uppercase";

export function OrderDetailsForm({ datos, onChange }: OrderDetailsFormProps) {
  const id = useId();
  const set = (patch: Partial<DatosPedido>) => onChange({ ...datos, ...patch });

  return (
    // Sin <form>: no hay submit, los datos solo completan el mensaje de WhatsApp.
    <section aria-labelledby={`${id}-titulo`} className="space-y-5 py-6">
      <div>
        <h3 id={`${id}-titulo`} className="text-xl">
          Datos para el pedido
        </h3>
        <p className="text-xs text-muted-foreground">
          Opcionales: nos ayudan a coordinar más rápido.
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-nombre`} className={labelClass}>
          Nombre
        </label>
        <input
          id={`${id}-nombre`}
          value={datos.nombre}
          onChange={(e) => set({ nombre: e.target.value })}
          autoComplete="given-name"
          enterKeyHint="next"
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className={cn(labelClass, "mb-2")}>Forma de entrega</legend>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ENTREGA_LABELS) as FormaEntrega[]).map((forma) => (
            <label key={forma} className="relative">
              <input
                type="radio"
                name={`${id}-entrega`}
                value={forma}
                checked={datos.entrega === forma}
                onChange={() => set({ entrega: forma })}
                className="peer sr-only"
              />
              <span className="flex h-11 cursor-pointer items-center justify-center border border-input text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:ring-1 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 hover:border-ink">
                {ENTREGA_LABELS[forma]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-localidad`} className={labelClass}>
          Localidad
        </label>
        <input
          id={`${id}-localidad`}
          value={datos.localidad}
          onChange={(e) => set({ localidad: e.target.value })}
          autoComplete="address-level2"
          enterKeyHint="done"
          className={inputClass}
        />
      </div>
    </section>
  );
}
