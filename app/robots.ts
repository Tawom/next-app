import { MetadataRoute } from "next";

/**
 * Robots.txt Configuration
 *
 * Controls how search engines crawl the site.
 *
 * Why important?
 * - Tells search engines which pages to index
 * - Improves SEO by guiding crawlers
 * - Can block sensitive routes
 * - Points to sitemap for better indexing
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/"],
    },
    sitemap: "https://travelhub.com/sitemap.xml",
  };
}
