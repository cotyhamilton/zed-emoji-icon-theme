import { IconThemeContent } from "./schema.ts";
import {
  directoryIcons,
  directoryIconsDarkMono,
  fileIcons,
  fileIconsDarkMono,
} from "./utils.ts";

export const themes: IconThemeContent[] = [
  {
    name: "OpenMoji Icon Theme",
    appearance: "dark",
    file_icons: await fileIcons({
      iconsPath: "./icons/themes/color",
      color: "color",
    }),
    directory_icons: await directoryIcons({
      iconsPath: "./icons/themes/color",
      color: "color",
    }),
  },
  {
    name: "OpenMoji Icon Theme Grayscale (Light)",
    appearance: "light",
    file_icons: await fileIcons({
      iconsPath: "./icons/themes/grayscale/light",
      color: "black",
    }),
    directory_icons: await directoryIcons({
      iconsPath: "./icons/themes/grayscale/light",
      color: "black",
    }),
  },
  {
    name: "OpenMoji Icon Theme Grayscale (Dark)",
    appearance: "dark",
    file_icons: await fileIconsDarkMono({
      iconsPath: "./icons/themes/grayscale/dark",
      color: "black",
    }),
    directory_icons: await directoryIconsDarkMono({
      iconsPath: "./icons/themes/grayscale/dark",
      color: "black",
    }),
  },
];
