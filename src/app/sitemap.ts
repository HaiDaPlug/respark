import type { MetadataRoute } from "next";
import { sajt } from "@/konfig/sajt";

/** Bara startsidan. Integritetspolicy och villkor läggs till när de inte längre är utkast. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${sajt.doman}/`, changeFrequency: "monthly", priority: 1 }];
}
