import { IconThemeFamilyContent } from "./schema.ts";
import { themes } from "./themes.ts";

export const theme: IconThemeFamilyContent = {
  $schema: "https://zed.dev/schema/icon_themes/v0.2.0.json",
  name: "OpenMoji Emoji Icons Theme",
  author: "Coty Hamilton",
  themes: themes.map((theme) => ({
    name: theme.name,
    appearance: theme.appearance,
    file_stems: {
      "LICENSE": "license",
    },
    file_suffixes: {
      "deno.json": "deno",
      "deno.jsonc": "deno",
      "LICENSE.txt": "license",
    },
    directory_icons: theme.directory_icons,
    file_icons: theme.file_icons,
  })),
};
