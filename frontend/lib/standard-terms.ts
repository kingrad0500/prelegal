/**
 * Parser for `templates/mutual-nda.md` (the MNDA Standard Terms).
 *
 * The Standard Terms are a numbered list of fixed prose. What makes them worth
 * parsing rather than pasting is the `<span class="coverpage_link">` markers
 * scattered through them: each names a Cover Page heading, and resolving those
 * against the user's answers is what turns the preview into a filled-in
 * agreement instead of a form printout.
 *
 * Runs on the server, so the token stream reaches the browser but this parser
 * never does.
 */

export type InlineToken =
  | { kind: "text"; value: string }
  | { kind: "strong"; value: string }
  | { kind: "link"; text: string; href: string }
  /** A `<span class="coverpage_link">` reference to a Cover Page heading. */
  | { kind: "ref"; label: string };

export interface StandardTermsSection {
  number: string;
  tokens: InlineToken[];
}

export interface StandardTerms {
  sections: StandardTermsSection[];
  /** The Common Paper CC BY 4.0 credit that closes the document. */
  attribution: InlineToken[];
}

const COVERPAGE_LINK = String.raw`<span class="coverpage_link">([\s\S]*?)<\/span>`;
const STRONG = String.raw`\*\*([\s\S]+?)\*\*`;
const LINK = String.raw`\[([^\]]+)\]\(([^)\s]+)\)`;
const INLINE = new RegExp(`${COVERPAGE_LINK}|${STRONG}|${LINK}`, "g");

const NUMBERED = /^(\d+)\.\s+([\s\S]+)$/;

/** Splits a paragraph into text, bold runs, links, and Cover Page references. */
export function parseInline(markdown: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let cursor = 0;

  const pushText = (value: string) => {
    if (value) tokens.push({ kind: "text", value });
  };

  for (const match of markdown.matchAll(INLINE)) {
    const [full, refLabel, strong, linkText, href] = match;
    pushText(markdown.slice(cursor, match.index));
    if (refLabel !== undefined) {
      tokens.push({ kind: "ref", label: refLabel.trim() });
    } else if (strong !== undefined) {
      tokens.push({ kind: "strong", value: strong });
    } else {
      tokens.push({ kind: "link", text: linkText, href });
    }
    cursor = match.index + full.length;
  }

  pushText(markdown.slice(cursor));
  return tokens;
}

export function parseStandardTerms(markdown: string): StandardTerms {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim().replace(/\s*\n\s*/g, " "))
    .filter((block) => block && !block.startsWith("#"));

  const sections: StandardTermsSection[] = [];
  let attribution: InlineToken[] = [];

  for (const block of blocks) {
    const numbered = NUMBERED.exec(block);
    if (numbered) {
      sections.push({ number: numbered[1], tokens: parseInline(numbered[2]) });
    } else {
      // Anything unnumbered after the sections is the closing credit line.
      attribution = parseInline(block);
    }
  }

  if (sections.length === 0) {
    throw new Error(
      "No numbered sections found in the Mutual NDA Standard Terms template.",
    );
  }

  return { sections, attribution };
}
