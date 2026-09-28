"use client";

import {
  Banknote,
  Landmark,
  MapPin,
  MessageSquareText,
  Smartphone,
  Store,
  Truck,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useId } from "react";

import { ChoiceGroup } from "@/components/cart/ChoiceGroup";
import { OrderField } from "@/components/cart/OrderField";
import { COMENTARIO_MAX, ENTREGA_LABELS, PAGO_LABELS } from "@/lib/checkout";
import type {
  DatosPedido,
  FormaEntrega,
  FormaPago,
  OrderErrors,
} from "@/types/cart";

const ICONOS_PAGO = {
  transferencia: Landmark,
  efectivo: Banknote,
} satisfies Record<FormaPago, LucideIcon>;
const ICONOS_ENTREGA = { envio: Truck, retiro: Store } satisfies Record<
  FormaEntrega,
  LucideIcon
>;

interface OrderDetailsFormProps {
  datos: DatosPedido;
  onChange: (datos: DatosPedido) => void;
  /** Vacío hasta el primer intento de envío: no se marca nada mientras se completa. */
  errores: OrderErrors;
}

export function OrderDetailsForm({
  datos,
  onChange,
  errores,
}: OrderDetailsFormProps) {
  const id = useId();
  const set = (patch: Partial<DatosPedido>) => onChange({ ...datos, ...patch });

  return (
    // Sin <form>: no hay submit propio, los datos completan el mensaje de WhatsApp.
    <section aria-labelledby={`${id}-titulo`} className="space-y-5 py-6">
      <div>
        <h3 id={`${id}-titulo`} className="text-xl">
          Datos para el pedido
        </h3>
        <p className="text-xs text-muted-foreground">
          Los campos con * son necesarios para coordinar tu pedido.
        </p>
      </div>

      <OrderField
        id={`${id}-nombre`}
        label="Nombre y apellido"
        icon={UserRound}
        required
        value={datos.nombre}
        onChange={(nombre) => set({ nombre })}
        error={errores.nombre}
        autoComplete="name"
      />
      <OrderField
        id={`${id}-celular`}
        label="Celular de contacto"
        icon={Smartphone}
        required
        value={datos.celular}
        onChange={(celular) => set({ celular })}
        error={errores.celular}
        autoComplete="tel"
        inputMode="tel"
      />
      <ChoiceGroup
        name={`${id}-pago`}
        legend="Forma de pago"
        icon={Wallet}
        options={PAGO_LABELS}
        optionIcons={ICONOS_PAGO}
        value={datos.pago}
        onChange={(pago) => set({ pago })}
        error={errores.pago}
      />
      <ChoiceGroup
        name={`${id}-entrega`}
        legend="Forma de entrega"
        icon={Truck}
        options={ENTREGA_LABELS}
        optionIcons={ICONOS_ENTREGA}
        value={datos.entrega}
        onChange={(entrega) => set({ entrega })}
        error={errores.entrega}
      />
      {/* Oculta con Retiro, pero lo escrito se conserva si se vuelve a elegir Envío. */}
      {datos.entrega === "envio" && (
        <OrderField
          id={`${id}-direccion`}
          label="Dirección de entrega"
          icon={MapPin}
          required
          multiline
          value={datos.direccion}
          onChange={(direccion) => set({ direccion })}
          error={errores.direccion}
          hint="Calle, altura, localidad y una referencia para encontrarte."
          autoComplete="street-address"
        />
      )}
      <OrderField
        id={`${id}-comentario`}
        label="Comentario"
        icon={MessageSquareText}
        multiline
        maxLength={COMENTARIO_MAX}
        value={datos.comentario}
        onChange={(comentario) => set({ comentario })}
        error={errores.comentario}
      />
    </section>
  );
}
