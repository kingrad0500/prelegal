"use client";

import type { ReactNode } from "react";
import {
  US_JURISDICTIONS,
  type ConfidentialityMode,
  type MndaTermMode,
  type NdaFields,
  type Party,
} from "@/lib/nda";

type PartyKey = "party1" | "party2";

export function NdaForm({
  fields,
  onChange,
}: {
  fields: NdaFields;
  onChange: (patch: Partial<NdaFields>) => void;
}) {
  const updateParty = (key: PartyKey, patch: Partial<Party>) =>
    onChange({ [key]: { ...fields[key], ...patch } });

  return (
    <form className="flex flex-col gap-8" onSubmit={(event) => event.preventDefault()}>
      <Section
        title="The agreement"
        description="These answers fill in the Cover Page and resolve the cross-references inside the Standard Terms."
      >
        <Field
          id="purpose"
          label="Purpose"
          hint="How Confidential Information may be used."
        >
          <textarea
            id="purpose"
            className={controlClass}
            rows={3}
            value={fields.purpose}
            onChange={(event) => onChange({ purpose: event.target.value })}
          />
        </Field>

        <Field id="effectiveDate" label="Effective Date">
          <input
            id="effectiveDate"
            type="date"
            className={controlClass}
            value={fields.effectiveDate}
            onChange={(event) => onChange({ effectiveDate: event.target.value })}
          />
        </Field>

        <Choice
          legend="MNDA Term"
          hint="The length of this MNDA."
          name="termMode"
          selected={fields.termMode}
          onSelect={(value: MndaTermMode) => onChange({ termMode: value })}
          options={[
            {
              value: "expires",
              label: "Expires a set number of years from the Effective Date",
              years: {
                value: fields.termYears,
                onChange: (value) => onChange({ termYears: value }),
                id: "termYears",
              },
            },
            {
              value: "until-terminated",
              label: "Continues until terminated under the terms of the MNDA",
            },
          ]}
        />

        <Choice
          legend="Term of Confidentiality"
          hint="How long Confidential Information is protected. Trade secrets stay protected for as long as the law treats them as trade secrets."
          name="confidentialityMode"
          selected={fields.confidentialityMode}
          onSelect={(value: ConfidentialityMode) =>
            onChange({ confidentialityMode: value })
          }
          options={[
            {
              value: "years",
              label: "A set number of years from the Effective Date",
              years: {
                value: fields.confidentialityYears,
                onChange: (value) => onChange({ confidentialityYears: value }),
                id: "confidentialityYears",
              },
            },
            { value: "perpetuity", label: "In perpetuity" },
          ]}
        />

        <Field id="governingLaw" label="Governing Law">
          <select
            id="governingLaw"
            className={controlClass}
            value={fields.governingLaw}
            onChange={(event) => onChange({ governingLaw: event.target.value })}
          >
            <option value="">Select a state…</option>
            {US_JURISDICTIONS.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="jurisdiction"
          label="Jurisdiction"
          hint="The city or county and state whose courts hear disputes, e.g. “New Castle, DE”."
        >
          <input
            id="jurisdiction"
            type="text"
            className={controlClass}
            placeholder="New Castle, DE"
            value={fields.jurisdiction}
            onChange={(event) => onChange({ jurisdiction: event.target.value })}
          />
        </Field>

        <Field
          id="modifications"
          label="MNDA Modifications"
          hint="Any changes to the Standard Terms. Left blank, the agreement reads “None.”"
        >
          <textarea
            id="modifications"
            className={controlClass}
            rows={2}
            value={fields.modifications}
            onChange={(event) => onChange({ modifications: event.target.value })}
          />
        </Field>
      </Section>

      {(["party1", "party2"] as const).map((key, index) => (
        <Section
          key={key}
          title={`Party ${index + 1}`}
          description="Signature and date are left blank for signing."
        >
          <PartyFields
            partyKey={key}
            party={fields[key]}
            onChange={(patch) => updateParty(key, patch)}
          />
        </Section>
      ))}
    </form>
  );
}

function PartyFields({
  partyKey,
  party,
  onChange,
}: {
  partyKey: PartyKey;
  party: Party;
  onChange: (patch: Partial<Party>) => void;
}) {
  const fields = [
    { key: "printName", label: "Print Name", placeholder: "Jane Doe" },
    { key: "title", label: "Title", placeholder: "Chief Executive Officer" },
    { key: "company", label: "Company", placeholder: "Acme, Inc." },
  ] as const;

  return (
    <>
      {fields.map((field) => (
        <Field
          key={field.key}
          id={`${partyKey}-${field.key}`}
          label={field.label}
        >
          <input
            id={`${partyKey}-${field.key}`}
            type="text"
            className={controlClass}
            placeholder={field.placeholder}
            value={party[field.key]}
            onChange={(event) => onChange({ [field.key]: event.target.value })}
          />
        </Field>
      ))}
      <Field
        id={`${partyKey}-noticeAddress`}
        label="Notice Address"
        hint="Either an email address or a postal address."
      >
        <textarea
          id={`${partyKey}-noticeAddress`}
          className={controlClass}
          rows={2}
          placeholder="legal@acme.com"
          value={party.noticeAddress}
          onChange={(event) => onChange({ noticeAddress: event.target.value })}
        />
      </Field>
    </>
  );
}

/* ------------------------------------------------------------- primitives */

const controlClass =
  "w-full rounded-md border border-[var(--app-border)] bg-white px-3 py-2 text-sm " +
  "text-[var(--app-ink)] outline-none transition " +
  "focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20 " +
  "disabled:cursor-not-allowed disabled:bg-[var(--app-bg)] disabled:text-[var(--app-muted)]";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="text-sm font-semibold tracking-wide text-[var(--app-ink)] uppercase">
          {title}
        </h2>
        <p className="mt-1 text-xs text-[var(--app-muted)]">{description}</p>
      </header>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint ? <p className="text-xs text-[var(--app-muted)]">{hint}</p> : null}
      {children}
    </div>
  );
}

interface YearsInput {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  /** Present when picking this option also needs a duration. */
  years?: YearsInput;
}

/**
 * The Cover Page offers these terms as a pair of checkboxes, exactly one of
 * which is ticked. Radio buttons say the same thing without letting the user
 * produce an agreement that elects both or neither.
 */
function Choice<T extends string>({
  legend,
  hint,
  name,
  selected,
  onSelect,
  options,
}: {
  legend: string;
  hint: string;
  name: string;
  selected: T;
  onSelect: (value: T) => void;
  options: ChoiceOption<T>[];
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-sm font-medium">{legend}</legend>
      <p className="text-xs text-[var(--app-muted)]">{hint}</p>
      <div className="mt-1 flex flex-col gap-2">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const active = selected === option.value;
          const years = option.years;
          return (
            <div key={option.value} className="flex items-center gap-2">
              <input
                id={id}
                type="radio"
                name={name}
                className="accent-[var(--app-accent)]"
                checked={active}
                onChange={() => onSelect(option.value)}
              />
              <label htmlFor={id} className="text-sm">
                {option.label}
              </label>
              {years ? (
                <span className="ml-auto flex items-center gap-1.5">
                  <input
                    id={years.id}
                    type="number"
                    min={1}
                    step={1}
                    aria-label={`${legend} in years`}
                    className={`${controlClass} w-20 text-center`}
                    disabled={!active}
                    value={years.value}
                    onChange={(event) => years.onChange(event.target.value)}
                  />
                  <span className="text-sm text-[var(--app-muted)]">yrs</span>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
