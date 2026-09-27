import { Children } from "react";

interface ScrollRowProps {
  children: React.ReactNode;
}

/**
 * Mobile: fila deslizable con scroll-snap que deja asomar la tarjeta siguiente (swipe sin JS).
 * Desktop: grilla de 4.
 */
export function ScrollRow({ children }: ScrollRowProps) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {Children.map(children, (child) => (
        <li className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-auto">
          {child}
        </li>
      ))}
    </ul>
  );
}
