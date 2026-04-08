import z from "zod";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  LOCALES,
  THEMES,
} from "@/utils/constants";

export const AppSettingsSchema = z.object({
  locale: z.enum(LOCALES).catch(DEFAULT_LOCALE),
  theme: z.enum(THEMES).catch(DEFAULT_THEME),
});
