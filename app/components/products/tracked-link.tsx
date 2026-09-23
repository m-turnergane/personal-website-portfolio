"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";

export const PRODUCT_CLICK_EVENT = "brh_product_click";

export function TrackedLink({
  href,
  placement,
  event = PRODUCT_CLICK_EVENT,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  placement: string;
  event?: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      aria-label={ariaLabel}
      onClick={() => track(event, { placement })}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
