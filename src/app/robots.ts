import type { MetadataRoute } from "next";
import { sajt } from "@/konfig/sajt";

/** Stänger ute sökmotorer tills sajt.indexera sätts till true vid lansering. */
export default function robots(): MetadataRoute.Robots {
  if (!sajt.indexera) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${sajt.doman}/sitemap.xml`,
  };
}
