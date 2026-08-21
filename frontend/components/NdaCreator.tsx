"use client";

import { useState } from "react";
import { defaultFields, type NdaFields } from "@/lib/nda";
import type { StandardTerms } from "@/lib/standard-terms";
import { NdaDocument } from "@/components/NdaDocument";
import { NdaForm } from "@/components/NdaForm";

export function NdaCreator({
  standardTerms,
  today,
}: {
  standardTerms: StandardTerms;
  /** Prefills the Effective Date. Resolved by the page so that the server and
   *  the browser render the same initial document. */
  today: string;
}) {
  const [fields, setFields] = useState<NdaFields>(() => defaultFields(today));

  const update = (patch: Partial<NdaFields>) =>
    setFields((previous) => ({ ...previous, ...patch }));

  return (
    <div className="app-shell flex h-dvh flex-col">
      <header className="screen-only flex flex-wrap items-center gap-4 border-b border-[var(--app-border)] bg-[var(--app-panel)] px-6 py-4">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold">Mutual NDA</h1>
          <p className="truncate text-xs text-[var(--app-muted)]">
            Common Paper Mutual Non-Disclosure Agreement, Version 1.0
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <p className="hidden text-xs text-[var(--app-muted)] sm:block">
            Choose <strong>Save as PDF</strong> as the destination.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-[var(--app-accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]/40"
          >
            Download PDF
          </button>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 lg:grid-cols-[minmax(340px,26rem)_1fr]">
        <div className="screen-only overflow-y-auto border-b border-[var(--app-border)] bg-[var(--app-panel)] px-6 py-6 lg:border-r lg:border-b-0">
          <NdaForm fields={fields} onChange={update} />
        </div>

        <div className="preview-pane min-h-0 overflow-hidden">
          <div className="preview-scroll h-full overflow-y-auto px-4 py-8 sm:px-8">
            <NdaDocument fields={fields} standardTerms={standardTerms} />
          </div>
        </div>
      </main>
    </div>
  );
}
