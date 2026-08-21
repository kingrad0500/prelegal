import type { CoverPageRef } from "@/lib/nda";
import type { InlineToken, StandardTerms } from "@/lib/standard-terms";
import { DocumentValue } from "@/components/DocumentValue";

/**
 * Renders a Cover Page cross-reference the way its sentence needs it: either
 * substituted for the value, or kept as the defined term with the value on
 * hover. See `RefStyle` in `lib/nda.ts`.
 */
function CrossReference({ reference }: { reference: CoverPageRef }) {
  if (reference.style === "substitute") {
    return (
      <DocumentValue
        value={reference.value}
        placeholder={reference.placeholder}
      />
    );
  }
  return (
    <span
      className="doc-term"
      title={
        reference.value
          ? `${reference.label}: ${reference.value}`
          : `${reference.label} is not yet specified on the Cover Page.`
      }
    >
      {reference.label}
    </span>
  );
}

function Inline({
  tokens,
  refs,
}: {
  tokens: InlineToken[];
  refs: Record<string, CoverPageRef>;
}) {
  return (
    <>
      {tokens.map((token, index) => {
        switch (token.kind) {
          case "strong":
            return <strong key={index}>{token.value}</strong>;
          case "link":
            return (
              <a
                key={index}
                href={token.href}
                target="_blank"
                rel="noreferrer"
                className="doc-link"
              >
                {token.text}
              </a>
            );
          case "ref": {
            const reference = refs[token.label];
            // An unrecognised heading falls back to its own name rather than
            // dropping out of the agreement.
            return reference ? (
              <CrossReference key={index} reference={reference} />
            ) : (
              <span key={index}>{token.label}</span>
            );
          }
          default:
            return <span key={index}>{token.value}</span>;
        }
      })}
    </>
  );
}

export function StandardTermsBody({
  terms,
  refs,
}: {
  terms: StandardTerms;
  refs: Record<string, CoverPageRef>;
}) {
  return (
    <>
      <h2 className="doc-h1">Standard Terms</h2>
      <ol className="doc-terms">
        {terms.sections.map((section) => (
          <li key={section.number} value={Number(section.number)}>
            <Inline tokens={section.tokens} refs={refs} />
          </li>
        ))}
      </ol>
      <p className="doc-attribution">
        <Inline tokens={terms.attribution} refs={refs} />
      </p>
    </>
  );
}
