import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Tour from "@/models/Tour";

/**
 * Dynamic Sitemap Generation
 *
 * Automatically generates sitemap.xml for search engines.
 *
 * Why important?
 * - Helps search engines discover all pages
 * - Improves SEO and indexing
 * - Updates automatically with new tours
 * - Includes priority and change frequency
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://travelhub.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    // Fetch all tours for dynamic routes
    await connectDB();
    const tours = await Tour.find({}).select("_id updatedAt").lean();

    const tourPages: MetadataRoute.Sitemap = tours.map((tour) => ({
      url: `${baseUrl}/tours/${tour._id}`,
      lastModified: tour.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticPages, ...tourPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
