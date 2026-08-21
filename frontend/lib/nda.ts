/**
 * Field model for the Common Paper Mutual NDA Cover Page (Version 1.0).
 *
 * The Cover Page carries every negotiated variable; the Standard Terms are
 * fixed prose that cross-reference those variables by name. This module owns
 * the variables and the sentences derived from them, so both the Cover Page
 * and the Standard Terms render from one source.
 */

export type MndaTermMode = "expires" | "until-terminated";
export type ConfidentialityMode = "years" | "perpetuity";

export interface Party {
  printName: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export interface NdaFields {
  purpose: string;
  /** ISO `yyyy-mm-dd`, as produced by an `<input type="date">`. */
  effectiveDate: string;
  termMode: MndaTermMode;
  termYears: string;
  confidentialityMode: ConfidentialityMode;
  confidentialityYears: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: Party;
  party2: Party;
}

const emptyParty = (): Party => ({
  printName: "",
  title: "",
  company: "",
  noticeAddress: "",
});

/** The local calendar date as `yyyy-mm-dd`, matching `<input type="date">`. */
export function todayIso(now: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Seeded with the defaults the template itself suggests in brackets.
 *
 * The effective date is passed in rather than read from the clock here: the
 * server renders this component too, and a value derived from `new Date()` at
 * render time can differ between the server and the browser, which breaks
 * hydration. The page resolves today's date once and hands it down.
 */
export const defaultFields = (effectiveDate = ""): NdaFields => ({
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate,
  termMode: "expires",
  termYears: "1",
  confidentialityMode: "years",
  confidentialityYears: "1",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: emptyParty(),
  party2: emptyParty(),
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * `2026-08-20` -> `August 20, 2026`. Parsed field by field rather than through
 * `new Date()`, which reads a bare ISO date as UTC and can land on the previous
 * day west of Greenwich.
 */
export function formatEffectiveDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return "";
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) return "";
  return `${name} ${Number(day)}, ${year}`;
}

/** `"1"` -> `"1 year"`, `"2"` -> `"2 years"`. Empty for anything unusable. */
export function formatYears(value: string): string {
  const trimmed = value.trim();
  const count = Number(trimmed);
  if (!trimmed || !Number.isFinite(count) || count <= 0) return "";
  return `${trimmed} ${count === 1 ? "year" : "years"}`;
}

/** The selected "MNDA Term" line, worded as the Cover Page words it. */
export function mndaTermText(fields: NdaFields): string {
  if (fields.termMode === "until-terminated") {
    return "Continues until terminated in accordance with the terms of the MNDA.";
  }
  const years = formatYears(fields.termYears);
  return years ? `Expires ${years} from Effective Date.` : "";
}

/** The selected "Term of Confidentiality" line. */
export function confidentialityTermText(fields: NdaFields): string {
  if (fields.confidentialityMode === "perpetuity") return "In perpetuity.";
  const years = formatYears(fields.confidentialityYears);
  return years
    ? `${years} from Effective Date, but in the case of trade secrets until ` +
        "Confidential Information is no longer considered a trade secret under applicable laws."
    : "";
}

/**
 * How a Cover Page cross-reference should read inside the Standard Terms.
 *
 * The surrounding sentence decides. Section 9 reads "the laws of the State of
 * ___", which wants the value itself ("Delaware"); section 5 reads "expires at
 * the end of the ___", which already supplies the article and so wants the
 * defined term, with the value surfaced on hover.
 */
export type RefStyle = "substitute" | "defined-term";

export interface CoverPageRef {
  /** The Cover Page heading this refers to. */
  label: string;
  /** The user's entered value, or `""` while unset. */
  value: string;
  /** Shown in place of an unset value. */
  placeholder: string;
  style: RefStyle;
}

export const GOVERNING_LAW_PLACEHOLDER = "[Fill in state]";
export const JURISDICTION_PLACEHOLDER = "[Fill in city or county and state]";

export function coverPageRefs(fields: NdaFields): Record<string, CoverPageRef> {
  const refs: CoverPageRef[] = [
    {
      label: "Purpose",
      value: fields.purpose.trim(),
      placeholder: "[Not yet specified]",
      style: "defined-term",
    },
    {
      label: "Effective Date",
      value: formatEffectiveDate(fields.effectiveDate),
      placeholder: "[Not yet specified]",
      style: "defined-term",
    },
    {
      label: "MNDA Term",
      value: mndaTermText(fields),
      placeholder: "[Not yet specified]",
      style: "defined-term",
    },
    {
      label: "Term of Confidentiality",
      value: confidentialityTermText(fields),
      placeholder: "[Not yet specified]",
      style: "defined-term",
    },
    {
      label: "Governing Law",
      value: fields.governingLaw.trim(),
      placeholder: GOVERNING_LAW_PLACEHOLDER,
      style: "substitute",
    },
    {
      label: "Jurisdiction",
      value: fields.jurisdiction.trim(),
      placeholder: JURISDICTION_PLACEHOLDER,
      style: "substitute",
    },
  ];
  return Object.fromEntries(refs.map((ref) => [ref.label, ref]));
}

export const US_JURISDICTIONS = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
] as const;
