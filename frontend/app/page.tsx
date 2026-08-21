import { connection } from "next/server";
import { NdaCreator } from "@/components/NdaCreator";
import { todayIso } from "@/lib/nda";
import { parseStandardTerms } from "@/lib/standard-terms";
import { readTemplate } from "@/lib/templates";

/**
 * Server Component: the Standard Terms are read from the repository's template
 * dataset and parsed here, so the browser receives the finished token stream
 * and never the markdown or the parser.
 */
export default async function Page() {
  // Today's date prefills the Effective Date, so this page has to render per
  // request rather than being frozen into the build.
  await connection();

  const markdown = await readTemplate("mutual-nda.md");
  return (
    <NdaCreator
      standardTerms={parseStandardTerms(markdown)}
      today={todayIso()}
    />
  );
}
