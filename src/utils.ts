import { parse } from "jsr:@std/csv/parse";
import { openmojis } from "npm:openmoji";
import { DirectoryIconsContent, IconDefinitionContent } from "./schema.ts";

export type ThemeData = {
  iconsPath: string;
  color: "color" | "black";
};

export type ProcessIconProps = {
  emoji: string;
  type: string;
  iconsPath: string;
  color: "color" | "black";
};

export const processIcon = async (
  data: ProcessIconProps,
) => {
  const { emoji, color, iconsPath } = data;
  const hex = emoji.codePointAt(0)?.toString(16);

  let emojiData;
  // @ts-ignore - no types for openmoji
  emojiData = openmojis.find((o) => o.emoji === emoji);

  if (!emojiData) {
    // @ts-ignore - no types for openmoji
    emojiData = openmojis.find((o) => o.hexcode.toLowerCase() === hex);
  }

  if (!emojiData) {
    throw new Error(`Emoji not found: ${emoji}`);
  }

  console.log({ emoji, hex, emojiData: !!emojiData });

  try {
    await Deno.mkdir(data.iconsPath, { recursive: true });
  } catch {
    // Directory exists
  }

  // Copy emoji file to theme directory
  const targetPath = `${iconsPath}/${
    emojiData.annotation.replaceAll(" ", "-")
  }.svg`;

  await Deno.copyFile(
    emojiData.openmoji_images[color].svg,
    targetPath,
  );

  return targetPath;
};

export const processIconDarkMono = async (
  data: ProcessIconProps,
) => {
  const targetPath = await processIcon(data);

  // Update stroke color and opacity
  const strokeColor = "white";
  const opacity = ".7";

  const svg = await Deno.readTextFile(targetPath);
  const updatedSvg = svg
    .replace(/stroke="#000"/g, `stroke="${strokeColor}"`)
    .replace(/stroke="#000000"/g, `stroke="${strokeColor}"`)
    .replace(/<g id="line"/, `<g id="line" stroke-opacity="${opacity}"`);

  await Deno.writeTextFile(targetPath, updatedSvg);

  return targetPath;
};

export const fileIcons = async (
  theme: ThemeData,
): Promise<{ [key: string]: IconDefinitionContent }> => {
  const iconsThemeData: { [key: string]: IconDefinitionContent } = {};

  const icons = parse(
    await Deno.readTextFile(import.meta.dirname + "/file-icons.csv"),
    {
      skipFirstRow: true,
      columns: ["type", "emoji"],
    },
  );

  for (const icon of icons) {
    const targetPath = await processIcon({
      type: icon.type,
      emoji: icon.emoji,
      ...theme,
    });
    iconsThemeData[icon.type] = { path: targetPath };
  }

  return iconsThemeData;
};

export const fileIconsDarkMono = async (
  theme: ThemeData,
): Promise<{ [key: string]: IconDefinitionContent }> => {
  const iconsThemeData: { [key: string]: IconDefinitionContent } = {};

  const icons = parse(
    await Deno.readTextFile(import.meta.dirname + "/file-icons.csv"),
    {
      skipFirstRow: true,
      columns: ["type", "emoji"],
    },
  );

  for (const icon of icons) {
    const targetPath = await processIconDarkMono({
      type: icon.type,
      emoji: icon.emoji,
      ...theme,
    });
    iconsThemeData[icon.type] = { path: targetPath };
  }

  return iconsThemeData;
};

export const directoryIcons = async (
  theme: ThemeData,
): Promise<DirectoryIconsContent> => {
  const iconsThemeData: DirectoryIconsContent = {};

  const icons = parse(
    await Deno.readTextFile(import.meta.dirname + "/directory-icons.csv"),
    {
      skipFirstRow: true,
      columns: ["type", "emoji"],
    },
  );

  for (const icon of icons) {
    const targetPath = await processIcon({
      type: icon.type,
      emoji: icon.emoji,
      ...theme,
    });
    iconsThemeData[icon.type] = targetPath;
  }

  return iconsThemeData;
};

export const directoryIconsDarkMono = async (
  theme: ThemeData,
): Promise<DirectoryIconsContent> => {
  const iconsThemeData: DirectoryIconsContent = {};

  const icons = parse(
    await Deno.readTextFile(import.meta.dirname + "/directory-icons.csv"),
    {
      skipFirstRow: true,
      columns: ["type", "emoji"],
    },
  );

  for (const icon of icons) {
    const targetPath = await processIconDarkMono({
      type: icon.type,
      emoji: icon.emoji,
      ...theme,
    });
    iconsThemeData[icon.type] = targetPath;
  }

  return iconsThemeData;
};
