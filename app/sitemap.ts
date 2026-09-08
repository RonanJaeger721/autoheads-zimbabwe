import type { MetadataRoute } from "next";
import { makes, vehicles, motoringTips, posts } from "@/lib/autoheads-data";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://autoheads-three.vercel.app";
  const staticRoutes = [
    "",
    "cars",
    "list-makes",
    "list-shops",
    "list-mechanics",
    "workshops",
    "motoring",
    "list-motoring-tips",
    "list-posts",
    "verified",
    "about",
    "apply",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}/${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...makes.map(([id]) => ({
      url: `${base}/make/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...vehicles.map((v) => ({
      url: `${base}/vehicle/${v.makeId}/${v.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...motoringTips.map((x) => ({
      url: `${base}/view-motoring-tip-${x.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((x) => ({
      url: `${base}/view-${x.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
