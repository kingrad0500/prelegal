import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The agreement templates live at the repository root, not inside this app.
 * `catalog.json` records their provenance (source repo, path, and commit), so
 * reading them in place keeps that dataset the single source of truth and lets
 * template updates flow through without a copy drifting out of date.
 *
 * Server-only: this resolves against the Next.js working directory (`frontend/`).
 */
const TEMPLATES_DIR = path.join(process.cwd(), "..", "templates");

export async function readTemplate(filename: string): Promise<string> {
  const file = path.join(TEMPLATES_DIR, filename);
  try {
    return await readFile(file, "utf8");
  } catch (cause) {
    throw new Error(
      `Could not read the template "${filename}" at ${file}. ` +
        `The app expects to run from the "frontend" directory of the prelegal repository.`,
      { cause },
    );
  }
}
