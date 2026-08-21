# Mutual NDA creator

A prototype web app that turns the Common Paper Mutual NDA into a fill-in form:
enter the deal terms, watch the agreement fill in beside you, and print it to
PDF.

```bash
npm install
npm run dev     # http://localhost:3000
```

## How it fits together

The agreement text is **not** duplicated here. The Standard Terms are read from
`../templates/mutual-nda.md` at request time, so the template dataset at the
repository root — whose provenance `../catalog.json` records — stays the single
source of truth. Running the app therefore requires the surrounding repository;
`lib/templates.ts` is the only place that assumption lives.

The MNDA is two documents, and they are handled differently on purpose:

| Part | Source | Why |
| --- | --- | --- |
| **Cover Page** | `components/NdaDocument.tsx` | Every line is a slot, an either/or election, or a table cell. It is a structure, so it is written as markup. |
| **Standard Terms** | `templates/mutual-nda.md` | Eleven sections of fixed prose. It is text, so it is parsed. |

`lib/standard-terms.ts` parses the Standard Terms into tokens on the server, so
the browser receives the token stream and never the markdown or the parser. The
interesting tokens are the `<span class="coverpage_link">` markers, which name a
Cover Page heading. `lib/nda.ts` decides how each one reads in place: section 9
says "the laws of the State of ___" and wants the value itself, while section 5
says "expires at the end of the ___" and wants the defined term, with the value
on hover.

Fields left blank fall back to the template's own bracketed hint, so the
document always renders and anything outstanding reads as outstanding.

## Download

"Download PDF" calls `window.print()`. The print stylesheet in
`app/globals.css` drops the app chrome, breaks the page between the Cover Page
and the Standard Terms, and keeps the signature block from splitting across
pages. The browser's own "Save as PDF" does the rest — no PDF library, and the
output is real selectable text.

## Licence

The agreement text is Common Paper's, free to use under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See
`../templates/LICENSE.md`.
