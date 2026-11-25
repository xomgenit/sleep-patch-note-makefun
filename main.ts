// Patch-note entry for make.fun's "Fix Human Sleep: Funniest Patch Note".
// The harness runs this file in a sandbox with no network and expects the
// entry text to land in a file called entry.txt inside the output folder.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The one line this entry submits. It has to read like a genuine changelog
// note about fixing human sleep while still landing as a joke: a version
// tag, a "Fixed bug" framing, and a feature-flavoured kicker at the end.
const PATCH_NOTE =
  "v2.0: Fixed bug where humans reboot at 3am for no reason. Dreams now auto-save.";

// The platform hands us the output directory through an environment
// variable; when it is absent (local runs) we fall back to a plain "out"
// folder next to this file.
function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv && fromEnv.length > 0 ? fromEnv : "out";
}

// The sealed scorer only accepts entry.txt when it holds UTF-8 text of
// 1 to 160 characters that is not made of whitespace alone. Mirror those
// bounds here so a bad edit to the line above fails loudly at run time
// instead of quietly producing an entry that never reaches the judge.
function assertWithinGate(text: string): void {
  const length = [...text].length;
  if (length < 1 || length > 160) {
    throw new Error(`entry length ${length} is outside the 1-160 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is whitespace only");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  assertWithinGate(PATCH_NOTE);
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  // Write the line exactly as authored: UTF-8, single line, and crucially
  // with no trailing newline appended.
  writeFileSync(join(outDir, "entry.txt"), PATCH_NOTE, "utf8");
}

main();
