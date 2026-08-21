import {
  confidentialityTermText,
  coverPageRefs,
  formatEffectiveDate,
  GOVERNING_LAW_PLACEHOLDER,
  JURISDICTION_PLACEHOLDER,
  mndaTermText,
  type NdaFields,
  type Party,
} from "@/lib/nda";
import type { StandardTerms } from "@/lib/standard-terms";
import { DocumentValue } from "@/components/DocumentValue";
import { StandardTermsBody } from "@/components/StandardTerms";

/**
 * The assembled agreement: the Cover Page carrying the user's answers, then
 * the Standard Terms.
 *
 * The Cover Page is written as markup rather than parsed from
 * `mutual-nda-cover-page.md` because it is a structure, not prose — every line
 * of it is a slot, a either/or election, or a table cell. The Standard Terms
 * are the opposite, so they come straight from the template file.
 *
 * This is the print target; `globals.css` styles it for paper.
 */
export function NdaDocument({
  fields,
  standardTerms,
}: {
  fields: NdaFields;
  standardTerms: StandardTerms;
}) {
  const refs = coverPageRefs(fields);

  return (
    <article className="paper mx-auto w-full max-w-[8.5in] rounded-sm border border-[var(--app-border)] px-10 py-12 shadow-sm sm:px-14">
      <h1 className="doc-h1">Mutual Non-Disclosure Agreement</h1>

      <section className="doc-section">
        <h2 className="doc-h2">Using this Mutual Non-Disclosure Agreement</h2>
        <p>
          This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists
          of: (1) this Cover Page (&ldquo;<strong>Cover Page</strong>&rdquo;) and
          (2) the Common Paper Mutual NDA Standard Terms Version 1.0 (&ldquo;
          <strong>Standard Terms</strong>&rdquo;) identical to those posted at{" "}
          <a
            className="doc-link"
            href="https://commonpaper.com/standards/mutual-nda/1.0"
            target="_blank"
            rel="noreferrer"
          >
            commonpaper.com/standards/mutual-nda/1.0
          </a>
          . Any modifications of the Standard Terms should be made on the Cover
          Page, which will control over conflicts with the Standard Terms.
        </p>
      </section>

      <section className="doc-section">
        <h3 className="doc-h3">Purpose</h3>
        <span className="doc-caption">
          How Confidential Information may be used
        </span>
        <p>
          <DocumentValue
            value={fields.purpose}
            placeholder="[Describe how Confidential Information may be used]"
            multiline
          />
        </p>
      </section>

      <section className="doc-section">
        <h3 className="doc-h3">Effective Date</h3>
        <p>
          <DocumentValue
            value={formatEffectiveDate(fields.effectiveDate)}
            placeholder="[Fill in the Effective Date]"
          />
        </p>
      </section>

      <section className="doc-section">
        <h3 className="doc-h3">MNDA Term</h3>
        <span className="doc-caption">The length of this MNDA</span>
        <p>
          <DocumentValue
            value={mndaTermText(fields)}
            placeholder="[Fill in the length of this MNDA]"
          />
        </p>
      </section>

      <section className="doc-section">
        <h3 className="doc-h3">Term of Confidentiality</h3>
        <span className="doc-caption">
          How long Confidential Information is protected
        </span>
        <p>
          <DocumentValue
            value={confidentialityTermText(fields)}
            placeholder="[Fill in how long Confidential Information is protected]"
          />
        </p>
      </section>

      <section className="doc-section">
        <h3 className="doc-h3">Governing Law &amp; Jurisdiction</h3>
        <p>
          Governing Law:{" "}
          <DocumentValue
            value={fields.governingLaw}
            placeholder={GOVERNING_LAW_PLACEHOLDER}
          />
        </p>
        <p>
          Jurisdiction:{" "}
          <DocumentValue
            value={fields.jurisdiction}
            placeholder={JURISDICTION_PLACEHOLDER}
          />
        </p>
      </section>

      <section className="doc-section">
        <h3 className="doc-h3">MNDA Modifications</h3>
        <span className="doc-caption">
          List any modifications to the MNDA
        </span>
        <p>
          {fields.modifications.trim() ? (
            <span className="whitespace-pre-line">{fields.modifications}</span>
          ) : (
            "None."
          )}
        </p>
      </section>

      <section className="doc-section">
        <p>
          By signing this Cover Page, each party agrees to enter into this MNDA
          as of the Effective Date.
        </p>
        <SignatureBlock party1={fields.party1} party2={fields.party2} />
      </section>

      <p className="doc-attribution">
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use
        under{" "}
        <a
          className="doc-link"
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>
        .
      </p>

      <div className="page-break mt-12">
        <StandardTermsBody terms={standardTerms} refs={refs} />
      </div>
    </article>
  );
}

/**
 * Signature and Date are left blank on purpose: they are filled in at signing,
 * not at drafting, and the Date here is the date of signature rather than the
 * Effective Date above.
 */
function SignatureBlock({ party1, party2 }: { party1: Party; party2: Party }) {
  const rows = [
    {
      label: "Print Name",
      get: (party: Party) => party.printName,
      placeholder: "[Name]",
    },
    { label: "Title", get: (party: Party) => party.title, placeholder: "[Title]" },
    {
      label: "Company",
      get: (party: Party) => party.company,
      placeholder: "[Company]",
    },
    {
      label: "Notice Address",
      get: (party: Party) => party.noticeAddress,
      placeholder: "[Email or postal address]",
      caption: "Use either email or postal address",
      multiline: true,
    },
  ];

  return (
    <table className="doc-signatures">
      <thead>
        <tr>
          <th scope="col">
            <span className="sr-only">Field</span>
          </th>
          <th scope="col">Party 1</th>
          <th scope="col">Party 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Signature</th>
          <td className="doc-signature-line" />
          <td className="doc-signature-line" />
        </tr>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">
              {row.label}
              {row.caption ? (
                <span className="doc-caption">{row.caption}</span>
              ) : null}
            </th>
            {[party1, party2].map((party, index) => (
              <td key={index}>
                <DocumentValue
                  value={row.get(party)}
                  placeholder={row.placeholder}
                  multiline={row.multiline}
                />
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <th scope="row">Date</th>
          <td className="doc-signature-line" />
          <td className="doc-signature-line" />
        </tr>
      </tbody>
    </table>
  );
}
