"use client";

import Form from "next/form";
import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="-mr-3"
        aria-label={open ? "Cerrar búsqueda" : "Buscar"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X strokeWidth={1.5} /> : <Search strokeWidth={1.5} />}
      </Button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b bg-background"
      >
        <Form
          action="/productos"
          role="search"
          onSubmit={() => setOpen(false)}
          className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3 sm:px-6"
        >
          <label htmlFor={`${panelId}-q`} className="sr-only">
            Buscar productos
          </label>
          <input
            ref={inputRef}
            id={`${panelId}-q`}
            name="q"
            type="search"
            required
            placeholder="Buscar productos…"
            autoComplete="off"
            enterKeyHint="search"
            className="h-11 min-w-0 flex-1 border-b border-input bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground focus:border-ink"
          />
          <Button type="submit" size="icon" variant="ghost" aria-label="Buscar">
            <Search strokeWidth={1.5} />
          </Button>
        </Form>
      </div>
    </>
  );
}
