import type { ReactNode } from "react";

export function FieldNote({
  n,
  title,
  rule,
  children,
}: {
  /** A string: MDX here doesn't evaluate `{1}`-style expressions. */
  n: string;
  title: string;
  rule?: string;
  children: ReactNode;
}) {
  const id = `field-note-${n}`;

  return (
    <section aria-labelledby={id} className="pv-field-note">
      <div className="pv-field-note-numeral" aria-hidden>
        {n.padStart(2, "0")}
      </div>
      <div className="min-w-0">
        <h3 id={id} className="pv-field-note-title">
          {title}
        </h3>
        <div className="pv-field-note-body">{children}</div>
        {rule && (
          <p className="pv-field-note-rule">
            <span>Rule now</span>
            {rule}
          </p>
        )}
      </div>
    </section>
  );
}
