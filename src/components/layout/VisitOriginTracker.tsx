"use client";

import { useEffect } from "react";

import { captureVisitOrigin } from "@/lib/origin";

/** Registra `?ref=` de la visita (QR, Instagram) para sumarlo como "Origen:" al pedido. */
export function VisitOriginTracker() {
  useEffect(() => {
    captureVisitOrigin(window.location.search);
  }, []);
  return null;
}
