"use client";

import type { ReactNode } from "react";
import { track } from "@vercel/analytics";

export const PRODUCT_CLICK_EVENT = "brh_product_click";

export function TrackedLink({
  href,
  placement,
  className,
  children,
}: {
  href: string;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => track(PRODUCT_CLICK_EVENT, { placement })}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
