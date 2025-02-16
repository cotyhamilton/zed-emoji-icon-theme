#!/usr/bin/env -S deno run --allow-read --allow-write --no-lock
import { parse } from "jsr:@std/csv/parse";
import { openmojis } from "npm:openmoji";
import themeBase from "./theme-base.json" with { type: "json" };

type Theme = {
  name: string;
  appearance: "light" | "dark";
  iconsPath: string;
  color: "color" | "black";
};

const themes: Theme[] = [
  {
    name: "OpenMoji Icon Theme",
    appearance: "dark",
    iconsPath: "./icons/themes/color",
    color: "color",
  },
  {
    name: "OpenMoji Icon Theme Grayscale (Light)",
    appearance: "light",
    iconsPath: "./icons/themes/grayscale/light",
    color: "black",
  },
  {
    name: "OpenMoji Icon Theme Grayscale (Dark)",
    appearance: "dark",
    iconsPath: "./icons/themes/grayscale/dark",
    color: "black",
  },
];

const themeData = JSON.parse(
  await Deno.readTextFile(
    "./icon_themes/emoji-icon-theme.json",
  ),
);

/**
 * Builds an icon theme by processing directory and file icons from CSV files.
 * Converts emoji codes to SVG files using OpenMoji and creates a theme configuration.
 *
 * @param theme - Theme configuration containing paths and metadata
 * @returns Object containing processed directory and file icon mappings
 */
const buildTheme = async (theme: Theme) => {
  console.log(`Building ${theme.name}`);
  const dirIconsThemeData: { [key: string]: string } = {};
  const fileIconsThemeData: { [key: string]: { path: string } } = {};

  /**
   * Processes an icon by converting an emoji to an SVG file using OpenMoji.
   * Takes emoji data, finds the corresponding OpenMoji SVG, and copies it to the theme directory.
   *
   * @param data - Object containing emoji character and icon type
   * @returns Path to the generated SVG file
   */
  const processIcons = async (data: { emoji: string; type: string }) => {
    const emoji = data.emoji;
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

    console.log({ ...data, hex, emojiData: !!emojiData });

    // copy emoji file to theme directory
    const targetPath = `${theme.iconsPath}/${
      emojiData.annotation.replaceAll(" ", "-")
    }.svg`;

    await Deno.copyFile(
      emojiData.openmoji_images[theme.color].svg,
      targetPath,
    );

    // update stroke color and opacity for grayscale dark theme
    if (theme.color === "black" && theme.appearance === "dark") {
      const strokeColor = "white";
      const opacity = ".7";
      const svg = await Deno.readTextFile(targetPath);
      const updatedSvg = svg
        .replace(/stroke="#000"/g, `stroke="${strokeColor}"`)
        .replace(/stroke="#000000"/g, `stroke="${strokeColor}"`)
        .replace(/<g id="line"/, `<g id="line" stroke-opacity="${opacity}"`);
      await Deno.writeTextFile(targetPath, updatedSvg);
    }

    return targetPath;
  };

  const dirIconsData = parse(
    await Deno.readTextFile(import.meta.dirname + "/directory-icons.csv"),
    {
      skipFirstRow: true,
      columns: ["type", "emoji"],
    },
  );

  const fileIconsData = parse(
    await Deno.readTextFile(import.meta.dirname + "/file-icons.csv"),
    {
      skipFirstRow: true,
      columns: ["type", "emoji"],
    },
  );

  try {
    await Deno.mkdir(theme.iconsPath, { recursive: true });
  } catch {
    // Directory already exists
  }

  for (const row of dirIconsData) {
    const targetPath = await processIcons(row);
    dirIconsThemeData[row.type] = targetPath;
  }

  for (const row of fileIconsData) {
    const targetPath = await processIcons(row);
    fileIconsThemeData[row.type] = { path: targetPath };
  }

  return {
    dirIconsThemeData,
    fileIconsThemeData,
  };
};

if (import.meta.main) {
  for (let i = 0; i < themes.length; ++i) {
    const theme = themes[i];
    const { dirIconsThemeData, fileIconsThemeData } = await buildTheme(theme);

    themeData.themes[i] = {
      name: themes[i].name,
      appearance: themes[i].appearance,
      ...themeBase,
      directory_icons: dirIconsThemeData,
      file_icons: fileIconsThemeData,
    };
  }

  await Deno.writeTextFile(
    "./icon_themes/emoji-icon-theme.json",
    JSON.stringify(themeData, null, 2) + "\n",
  );
}
