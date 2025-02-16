#!/usr/bin/env -S deno run --allow-read --allow-write --no-lock
import { theme } from "./src/theme.ts";

if (import.meta.main) {
  await Deno.writeTextFile(
    "./icon_themes/emoji-icon-theme.json",
    JSON.stringify(theme, null, 2) + "\n",
  );
}
